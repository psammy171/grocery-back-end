import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

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
          quantity: 1,
          groceryItemId: itemId,
        },
      });
    }
  }
}
