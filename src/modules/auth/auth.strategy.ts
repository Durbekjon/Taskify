import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './dto/jwt.payload';
import { PrismaService } from '@/core/prisma/prisma.service';
import { JWT_SECRET } from '@/consts/jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: payload.id,
    };
  }
}
