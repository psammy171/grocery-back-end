import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { UserGuard } from 'src/global/guards/user.guard';
import { Request as Req } from 'express';
import { User } from '@prisma/client';
import { AdminGuard } from 'src/global/guards/admin.guard';

@UseGuards(UserGuard)
@Controller('')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(AdminGuard)
  @Get('/orders')
  allOrders() {
    return this.orderService.allOrders();
  }

  @Get('/my-orders')
  myOrders(@Request() req: Req) {
    const user = req['user'] as User;
    return this.orderService.allMyOrders(user.id);
  }
}
