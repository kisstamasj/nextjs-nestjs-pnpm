import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

interface JwtPayload {
  sub: string;
  email: string;
}

/**
 * A Passport strategy for authenticating requests using JSON Web Tokens (JWTs).
 * Extends the PassportStrategy class and implements the logic for validating and extracting the JWT from the request.
 */
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  /**
   * Validates the JWT payload and returns the user information extracted from the payload.
   * @param payload - The JWT payload.
   * @returns The user information extracted from the payload.
   */
  async validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email };
  }
}
