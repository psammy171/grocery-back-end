import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCartItems(userId: string) {
    const cart = await this.prisma.userOrder.findFirst({
      where: {
        isCart: true,
        userId: userId,
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });
    const modifiedCart = {
      cartId: cart?.id || '',
      total: cart?.total || 0,
      items: cart?.items || [],
    };
    return modifiedCart;
  }

  async addItemToCart(userId: string, itemId: string) {
    const item = await this.prisma.groceryItem.findUnique({
      where: {
        id: itemId,
      },
    });
    if (!item) throw new BadRequestException();
    const cart = await this.prisma.userOrder.findFirst({
      where: {
        AND: {
          userId: userId,
          isCart: true,
        },
      },
      include: {
        items: true,
      },
    });
    let newCart: any;
    if (!cart) {
      newCart = await this.prisma.userOrder.create({
        data: {
          isCart: true,
          userId: userId,
          total: item.price,
          items: {
            create: {
              groceryItemId: itemId,
              quantity: 1,
            },
          },
        },
      });
    } else {
      newCart = cart;
      await this.prisma.userOrder.update({
        where: {
          id: cart.id,
        },
        data: {
          total: { increment: item.price },
          items: {
            upsert: {
              where: {
                groceryItemId_orderId: {
                  groceryItemId: itemId,
                  orderId: cart.id,
                },
              },
              create: {
                quantity: 1,
                groceryItemId: itemId,
              },
              update: {
                quantity: { increment: 1 },
              },
            },
          },
        },
      });
    }
    return {
      cartId: newCart.id,
      message: 'Item added to cart',
    };
  }

  async removeItemFromCart(userId: string, itemId: string) {
    const item = await this.prisma.groceryItem.findUnique({
      where: {
        id: itemId,
      },
    });
    if (!item) throw new BadRequestException();
    const cart = await this.prisma.userOrder.findFirst({
      where: {
        AND: {
          userId: userId,
          isCart: true,
        },
      },
      include: {
        items: true,
      },
    });
    if (!cart) throw new BadRequestException();
    const cartItem = cart.items.find(
      (crtItm) => crtItm.groceryItemId === item.id,
    );
    if (cartItem?.quantity === 1) {
      await this.prisma.userOrder.update({
        where: {
          id: cart.id,
        },
        data: {
          total: { decrement: item.price },
          items: {
            delete: {
              groceryItemId_orderId: {
                groceryItemId: itemId,
                orderId: cart.id,
              },
            },
          },
        },
      });
    } else {
      await this.prisma.userOrder.update({
        where: {
          id: cart.id,
        },
        data: {
          total: { decrement: item.price },
          items: {
            update: {
              where: {
                groceryItemId_orderId: {
                  orderId: cart.id,
                  groceryItemId: item.id,
                },
              },
              data: {
                quantity: { decrement: 1 },
              },
            },
          },
        },
      });
    }
    return {
      message: 'Item removed from cart',
    };
  }

  async checkoutCartItems(userId: string) {
    const cart = await this.prisma.userOrder.updateMany({
      where: {
        isCart: true,
        userId: userId,
      },
      data: {
        isCart: false,
      },
    });
    if (cart.count === 0) throw new BadRequestException();
    return {
      message: 'Cart checked out',
    };
  }
}
