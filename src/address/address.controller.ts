import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as Req } from 'express';
import { UserGuard } from 'src/global/guards/user.guard';
import { CreateAddressDto } from './dtos/create-address.dto';
import { AddressService } from './address.service';
import { User } from '@prisma/client';

@UseGuards(UserGuard)
@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  createAddress(@Request() req: Req, @Body() body: CreateAddressDto) {
    return this.addressService.createAddress((req['user'] as User).id, body);
  }

  @Patch('/:id')
  updateAddress(
    @Request() req: Req,
    @Body() body: Partial<CreateAddressDto>,
    @Param('id') addressId: string,
  ) {
    return this.addressService.updateAddress(
      (req['user'] as User).id,
      addressId,
      body,
    );
  }

  @Get('/:id')
  getAddressDetails(@Request() req: Req, @Param('id') addressId: string) {
    return this.addressService.getAddress((req['user'] as User).id, addressId);
  }

  @Get()
  getAllAddress(@Request() req: Req) {
    return this.addressService.getAllAddress((req['user'] as User).id);
  }

  @Delete('/:id')
  deleteAddress(@Request() req: Req, @Param('id') addressId: string) {
    return this.addressService.deleteAddress(
      (req['user'] as User).id,
      addressId,
    );
  }
}
