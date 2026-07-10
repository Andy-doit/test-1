import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Passport JWT strategy.
 * Extracts Bearer token from Authorization header, validates it using
 * the access secret from ConfigService, and attaches the decoded
 * payload to request.user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret') as string,
    });
  }

  /**
   * Called after JWT is verified. The returned object is attached to request.user.
   * No extra DB lookup — authorization is handled by guards.
   */
  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
