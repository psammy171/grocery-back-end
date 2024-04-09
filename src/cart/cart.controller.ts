import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request as Req } from 'express';
import { CartService } from './cart.service';
import { UserGuard } from 'src/global/guards/user.guard';
import { CartItemDto } from './dtos/cart-item.dto';

@UseGuards(UserGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get('/items')
  getItems(@Request() req: Req) {
    const user = req['user'] as User;
    return this.cartService.getCartItems(user.id);
  }

  @Post('/add-item')
  addItemToCart(@Request() req: Req, @Body() body: CartItemDto) {
    const user = req['user'] as User;
    return this.cartService.addItemToCart(user.id, body.itemId);
  }

  @Delete('/remove-item')
  removeItemFromCart(@Request() req: Req, @Body() body: CartItemDto) {
    const user = req['user'] as User;
    return this.cartService.removeItemFromCart(user.id, body.itemId);
  }

  @Post('/checkout')
  checkoutCart(@Request() req: Req) {
    const user = req['user'] as User;
    return this.cartService.checkoutCartItems(user.id);
  }
}
