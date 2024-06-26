import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GuardsModule } from './global/guards/guards.module';
import { PrismaModule } from './global/prisma/prisma.module';
import { GroceryModule } from './grocery/grocery.module';
import { GroceryController } from './grocery/grocery.controller';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    GuardsModule,
    GroceryModule,
    CartModule,
    OrderModule,
    AddressModule,
    UserModule,
  ],
  controllers: [AppController, GroceryController],
  providers: [AppService],
})
export class AppModule {}
