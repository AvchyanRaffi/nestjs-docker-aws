import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '../../shared/services/config.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ConfigService,
    public readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'Thisispublickeyfornestdockeraws',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { id: string }) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const user = await this.userService.findOne({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException();
    }

    // const isTokenExists = await this._memoryCacheService.tokenExists(
    //   token,
    //   payload.role,
    // );
    //
    // if (!isTokenExists) {
    //   throw new UnauthorizedException();
    // }

    return user;
  }
}
