import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import type { jwtPayload } from '../jwtPayload';
import { EnvironmentVariables } from 'src/env.validation';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', { infer: true }),
      signOptions: { expiresIn: '500s' },
    });
  }

  async validate(payload: any) {
    const user: jwtPayload = {
      sub: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
    return user;
  }
}
