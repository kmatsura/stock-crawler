import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    // ① 型引数で string を指定
    const secret = config.get<string>('JWT_SECRET')!;
    // ② オプション構築
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    };
    super(opts);
  }

  validate(payload: { sub: string; email: string }) {
    return { uid: payload.sub, email: payload.email };
  }
}
