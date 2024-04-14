import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dtos/create-address.dto';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  createAddress(userId: string, body: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        userId,
        ...body,
      },
    });
  }

  updateAddress(
    userId: string,
    addressId: string,
    body: Partial<CreateAddressDto>,
  ) {
    return this.prisma.address.update({
      where: {
        id: addressId,
        userId: userId,
      },
      data: {
        ...body,
      },
    });
  }

  getAddress(userId: string, addressId: string) {
    return this.prisma.address.findUnique({
      where: {
        id: addressId,
        userId,
      },
    });
  }

  deleteAddress(userId: string, addressId: string) {
    return this.prisma.address.delete({
      where: {
        id: addressId,
        userId,
      },
    });
  }

  getAllAddress(userId: string) {
    return this.prisma.address.findMany({
      where: {
        userId: userId,
      },
    });
  }
}
