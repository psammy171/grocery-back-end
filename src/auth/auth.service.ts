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
      expiresIn: '86400s',
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
        cart: {
          create: {},
        },
      },
    });
    delete newUser.password;
    return newUser;
  }
}
