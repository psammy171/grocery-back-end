import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/global/guards/admin.guard';
import { UserGuard } from 'src/global/guards/user.guard';
import { CreateGroceryDto } from './dtos/create-grocery.dto';
import { GroceryService } from './grocery.service';
import { UpdateGroceryDto } from './dtos/update-grocery.dto';

@Controller('grocery')
export class GroceryController {
  constructor(private groceryService: GroceryService) {}

  // @UseGuards(UserGuard)
  // @Get('/user')
  // allGroceries() {
  //   return ['all', 'groceries', 'for', 'user'];
  // }

  // @UseGuards(AdminGuard)
  // @UseGuards(UserGuard)
  // @Get('/admin')
  // allAdminGroceries() {
  //   return ['all', 'groceries', 'for', 'admin'];
  // }

  @UseGuards(AdminGuard)
  @UseGuards(UserGuard)
  @Post('/')
  createGrocery(@Body() body: CreateGroceryDto) {
    return this.groceryService.createGrocery(body);
  }

  @UseGuards(AdminGuard)
  @UseGuards(UserGuard)
  @Patch('/:groceryId')
  updateGrocery(
    @Param('groceryId') groceryId: string,
    @Body() body: UpdateGroceryDto,
  ) {
    return this.groceryService.updateGrocery(groceryId, body);
  }

  @UseGuards(AdminGuard)
  @UseGuards(UserGuard)
  @Delete('/:groceryId')
  deleteGrocery(@Param('groceryId') groceryId: string) {
    return this.groceryService.deleteGrocery(groceryId);
  }

  @Get('/:groceryId')
  getGroceryDetails(@Param('groceryId') groceryId: string) {
    return this.groceryService.getGroceryItemDetail(groceryId);
  }

  @Get('/')
  allGrocery() {
    return this.groceryService.allGroceries();
  }
}
