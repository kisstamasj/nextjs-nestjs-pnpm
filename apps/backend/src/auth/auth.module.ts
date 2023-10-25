import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies';
import { RefreshTokenStrategy } from './strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * The `AuthModule` class is responsible for configuring the authentication module in the NestJS application.
 * It defines the controllers, providers, and imports required for authentication.
 */
@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
  imports: [UsersModule, PassportModule, JwtModule.register({})],
})
export class AuthModule {}
