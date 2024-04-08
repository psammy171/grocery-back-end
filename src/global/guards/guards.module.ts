import { Module } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { UserGuard } from './user.guard';

@Module({
  providers: [AdminGuard, UserGuard],
})
export class GuardsModule {}
