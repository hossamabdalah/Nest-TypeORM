import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt'; 
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity'; 
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const secret=process.env.JWT_SECRET
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token =request?.cookies?.access_token;
          return token
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret || 'SuperSecretKey',
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or token invalid');
    }

    return user;
  }
}
