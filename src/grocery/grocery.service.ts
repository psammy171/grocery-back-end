import { Injectable } from '@nestjs/common';
import { CreateGroceryDto } from './dtos/create-grocery.dto';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { UpdateGroceryDto } from './dtos/update-grocery.dto';

@Injectable()
export class GroceryService {
  constructor(private prisma: PrismaService) {}

  createGrocery(body: CreateGroceryDto) {
    return this.prisma.groceryItem.create({
      data: body,
    });
  }

  updateGrocery(id: string, body: UpdateGroceryDto) {
    return this.prisma.groceryItem.update({
      where: {
        id: id,
      },
      data: body,
    });
  }

  deleteGrocery(id: string) {
    return this.prisma.groceryItem.delete({
      where: {
        id: id,
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
    return this.prisma.groceryItem.findMany();
  }
}
