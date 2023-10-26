import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService, Tokens } from './auth.service';
import { UserDto } from '../users/dtos/user.dto';
import { AccessTokenGuard, RefreshTokenGuard } from '@backend-common/guards';
import { Serialize } from '@backend-common/interceptors';
import { IRequestUser, RequestUser } from '@backend-common/decorators';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthDto } from './dtos/auth.dto';

/**
 * Controller responsible for handling authentication-related requests.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Signup a user.
   * @param createUserDto - The data for creating the user.
   * @returns A promise that resolves to the newly created user.
   */
  @Post('signup')
  @Serialize(UserDto)
  @HttpCode(201)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { user, tokens } = await this.authService.signUp(createUserDto);
    return { ...user, tokens };
  }

  /**
   * Signin a user.
   * @param data - The authentication data.
   * @returns The authenticated user object.
   */
  @Post('signin')
  @Serialize(UserDto)
  @HttpCode(200)
  async signin(@Body() data: AuthDto) {
    const { user, tokens } = await this.authService.signIn(data);
    return { ...user, tokens };
  }

  /**
   * Logout a user.
   * @param req - The request object.
   * @returns 'success' if successful.
   */
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @HttpCode(200)
  async logout(@RequestUser() user: IRequestUser) {
    await this.authService.logout(user['sub']);
    return 'success';
  }

  /**
   * Refresh tokens.
   * @param req - The request object.
   * @returns 'success' if successful.
   */
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@RequestUser() user: IRequestUser): Promise<Tokens> {
    const userId = user['sub'];
    const refreshToken = user['refreshToken'];
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    return tokens;
  }
}
