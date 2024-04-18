import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroceryDto } from './dtos/create-grocery.dto';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { UpdateGroceryDto } from './dtos/update-grocery.dto';

@Injectable()
export class GroceryService {
  constructor(private prisma: PrismaService) {}

  createGrocery(body: CreateGroceryDto) {
    if ('id' in body) delete body.id;
    return this.prisma.groceryItem.create({
      data: body,
    });
  }

  async updateGrocery(id: string, body: UpdateGroceryDto) {
    const item = await this.prisma.groceryItem.findUnique({
      where: {
        id: id,
      },
    });
    if (!item) throw new NotFoundException();
    if ('id' in body) {
      delete body.id;
    }
    return this.prisma.groceryItem.update({
      where: {
        id: id,
      },
      data: body,
    });
  }

  deleteGrocery(id: string) {
    return this.prisma.groceryItem.update({
      where: {
        id: id,
      },
      data: {
        archived: true,
      },
    });
  }

  getGroceryItemDetail(id: string) {
    return this.prisma.groceryItem.findUnique({
      where: {
        id: id,
      },
    });
  }

  allGroceries() {
    return this.prisma.groceryItem.findMany({
      where: {
        archived: false,
      },
    });
  }

  allGroceriesForCRUD() {
    return this.prisma.groceryItem.findMany();
  }
}
