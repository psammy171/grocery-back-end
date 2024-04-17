import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  allOrders() {
    return this.prisma.userOrder.findMany({
      where: {
        isCart: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
          },
        },
        address: true,
      },
    });
  }

  allMyOrders(userId: string) {
    return this.prisma.userOrder.findMany({
      where: {
        AND: {
          userId: userId,
          isCart: false,
        },
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
        address: true,
      },
    });
  }

  async overview() {
    const totalUsers = await this.prisma.user.count();
    const totalOrders = await this.prisma.userOrder.count({
      where: {
        isCart: false,
      },
    });
    return {
      totalUsers,
      totalOrders,
    };
  }
}
