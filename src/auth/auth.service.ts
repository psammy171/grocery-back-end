import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { SignupDto } from './dtos/signup.dto';
import { RoleEnum } from '@prisma/client';

const saltRounds = 12;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(email: string, password: string) {
    const dbUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        roles: true,
      },
    });
    if (!dbUser) throw new UnauthorizedException();
    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordCorrect) throw new UnauthorizedException();
    delete dbUser.password;
    dbUser['accessToken'] = jwt.sign(dbUser, process.env.JWT_SECRET, {
      // expires after 1 hour
      expiresIn: '3600s',
    });
    dbUser['refreshToken'] = jwt.sign(dbUser, process.env.JWT_SECRET, {
      // expires after 7 days
      expiresIn: '604800s',
    });
    return dbUser;
  }

  async signup(user: SignupDto) {
    const dbUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (dbUser) throw new BadRequestException();
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        roles: {
          create: [
            {
              role: RoleEnum.USER,
            },
          ],
        },
      },
    });
    delete newUser.password;
    return newUser;
  }

  async currentUser(id: string) {
    // const orderCount = await this.prisma.userOrder.count({
    //   where: {
    //     userId: id,
    //   },
    // });
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        addresses: true,
      },
    });
    return user;
  }

  async refreshToken(email: string) {
    const dbUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        roles: true,
      },
    });
    if (!dbUser) throw new UnauthorizedException();
    const newToken = jwt.sign(dbUser, process.env.JWT_SECRET, {
      // expires after 1 hour
      expiresIn: '3600s',
    });
    return {
      accessToken: newToken,
    };
  }
}
