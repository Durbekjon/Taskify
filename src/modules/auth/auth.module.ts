import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth.strategy';
import { PrismaService } from '@/core/prisma/prisma.service';
import { UtilsService } from '@/core/utils/utils.service';
import { ACCESS_TOKEN_EXPIRATION_TIME } from '@/consts/token';
import { JWT_SECRET } from '@/consts/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PrismaService,
    UtilsService,
    JwtStrategy,
  ],
})
export class AuthModule {}
