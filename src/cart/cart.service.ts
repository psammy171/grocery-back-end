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
    return cart?.items || [];
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
    if (!cart) {
      await this.prisma.userOrder.create({
        data: {
          isCart: true,
          userId: userId,
          items: {
            create: {
              groceryItemId: itemId,
              quantity: 1,
            },
          },
        },
      });
    } else {
      await this.prisma.orderItem.upsert({
        where: {
          groceryItemId_orderId: {
            groceryItemId: itemId,
            orderId: cart.id,
          },
        },
        create: {
          orderId: cart.id,
          quantity: 1,
          groceryItemId: itemId,
        },
        update: {
          quantity: { increment: 1 },
          groceryItemId: itemId,
        },
      });
    }
    return {
      message: 'Item added to cart',
    };
  }

  async removeItemFromCart(userId: string, itemId: string) {
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
    const item = await this.prisma.orderItem.findUnique({
      where: {
        groceryItemId_orderId: {
          orderId: cart.id,
          groceryItemId: itemId,
        },
      },
    });
    if (item.quantity === 1) {
      await this.prisma.orderItem.delete({
        where: {
          groceryItemId_orderId: {
            orderId: cart.id,
            groceryItemId: itemId,
          },
        },
      });
    } else {
      await this.prisma.orderItem.update({
        where: {
          groceryItemId_orderId: {
            orderId: cart.id,
            groceryItemId: itemId,
          },
        },
        data: {
          quantity: { decrement: 1 },
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
    console.log('Cart', cart);
    if (cart.count === 0) throw new BadRequestException();
    return {
      message: 'Cart checked out',
    };
  }
}
