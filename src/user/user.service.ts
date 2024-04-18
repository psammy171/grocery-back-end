import { Injectable } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  allUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        addresses: true,
        roles: true,
      },
    });
  }

  async makeUserAdmin(email: string) {
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        roles: {
          create: {
            role: RoleEnum.ADMIN,
          },
        },
      },
    });
    return {
      message: 'user is admin now',
    };
  }

  async removeAsAdmin(email: string) {
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        roles: {
          deleteMany: {
            role: RoleEnum.ADMIN,
          },
        },
      },
    });
    return {
      message: 'User is no more admin',
    };
  }
}
