import { Module } from '@nestjs/common';
import { GroceryController } from './grocery.controller';
import { GroceryService } from './grocery.service';
import { PrismaModule } from 'src/global/prisma/prisma.module';

@Module({
  controllers: [GroceryController],
  providers: [GroceryService],
  exports: [GroceryService],
  imports: [PrismaModule],
})
export class GroceryModule {}
