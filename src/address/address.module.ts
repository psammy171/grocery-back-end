import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { PrismaModule } from 'src/global/prisma/prisma.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [PrismaModule],
})
export class AddressModule {}
