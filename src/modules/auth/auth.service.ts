import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './dto/IUser';
import { PrismaService } from '@/core/prisma/prisma.service';
import { UtilsService } from '@/core/utils/utils.service';
import { HTTP_MESSAGES } from '@/consts/http-messages';
import { REFRESH_TOKEN_EXPIRATION_TIME } from '@/consts/token';
import { REFRESH_SECRET } from '@/consts/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: AuthDto) {
    const existUser = await this.repository.findByEmail(body.email);

    if (existUser) throw new BadRequestException(HTTP_MESSAGES.USER_EXISTS);

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        password: await this.utils.generateBcrypt(body.password),
      },
    });

    delete user.password;

    const payload = { id: user.id };

    return {
      user,
      token: this.generateTokens(payload),
    };
  }
  async login(body: AuthDto) {
    const user = await this.repository.findByEmail(body.email);
    if (!user) throw new BadRequestException(HTTP_MESSAGES.USER_NOT_FOUND);

    const isCorrectPassword = await this.utils.compareHash(
      body.password,
      user.password,
    );
    if (!isCorrectPassword)
      throw new UnauthorizedException(HTTP_MESSAGES.WRONG_PASSWORD);

    delete user.password;

    const payload = { id: user.id };

    return {
      user,
      token: this.generateTokens(payload),
    };
  }

  private generateTokens(payload: IUser) {
    const access = this.jwtService.sign(payload);
    const refresh = this.jwtService.sign(payload, {
      secret: REFRESH_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return { access, refresh };
  }
}
