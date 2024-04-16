import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminGuard } from 'src/global/guards/admin.guard';
import { UserGuard } from 'src/global/guards/user.guard';
import { MakeAdminDto } from './dtos/make-admin.dto';
import { SuperAdminGuard } from 'src/global/guards/super-admin.guard';

@UseGuards(AdminGuard)
@UseGuards(UserGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  allUsers() {
    return this.userService.allUsers();
  }

  @UseGuards(SuperAdminGuard)
  @Post('/make-admin')
  makeAdmin(@Body() body: MakeAdminDto) {
    return this.userService.makeUserAdmin(body.email);
  }

  @UseGuards(SuperAdminGuard)
  @Post('/remove-admin')
  removeAdmin(@Body() body: MakeAdminDto) {
    return this.userService.removeAsAdmin(body.email);
  }
}
