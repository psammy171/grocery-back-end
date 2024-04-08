import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/global/guards/admin.guard';
import { UserGuard } from 'src/global/guards/user.guard';

@Controller('grocery')
export class GroceryController {
  @UseGuards(UserGuard)
  @Get('/user')
  allGroceries() {
    return ['all', 'groceries', 'for', 'user'];
  }

  @UseGuards(AdminGuard)
  @UseGuards(UserGuard)
  @Get('/admin')
  allAdminGroceries() {
    return ['all', 'groceries', 'for', 'admin'];
  }
}
