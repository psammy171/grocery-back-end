import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GuardsModule } from './global/guards/guards.module';
import { PrismaModule } from './global/prisma/prisma.module';
import { GroceryModule } from './grocery/grocery.module';
import { GroceryController } from './grocery/grocery.controller';

@Module({
  imports: [AuthModule, PrismaModule, GuardsModule, GroceryModule],
  controllers: [AppController, GroceryController],
  providers: [AppService],
})
export class AppModule {}
