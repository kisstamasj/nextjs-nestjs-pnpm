import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Password } from '@nestjs-common/utils';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dtos/auth.dto';
import { CreateUserDto } from '@backend/users/dtos/create-user.dto';
import { User } from '@backend/users/entities/user.entity';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * The `AuthService` class is responsible for validating user credentials by checking if the provided email and password match a user in the database.
 * It uses the `UserService` class to retrieve the user by email and the `Password` class to compare the stored hashed password with the supplied plain text password.
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of `AuthService`.
   * @param userService An instance of the `UserService` class used to interact with the user data in the database.
   * @param jwtService An instance of the `JwtService` class used to generate JWT tokens.
   * @param configService An instance of the `ConfigService` class used to retrieve configuration values.
   */
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Creates a new user, saves it to the database, and generates access and refresh tokens.
   * @param createUserDto The data required to create a new user.
   * @returns A promise that resolves to an object containing the newly created user and the generated tokens.
   * @throws `BadRequestException` if the user already exists.
   */
  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; tokens: Tokens }> {
    // Check if user exists
    const userExists = await this.userService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const newUser = await this.userService.create(createUserDto);
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return { user: newUser, tokens };
  }

  /**
   * Validates user credentials, generates access and refresh tokens if the credentials are correct.
   * @param data The user credentials to validate.
   * @returns A promise that resolves to an object containing the user and the generated tokens.
   * @throws `BadRequestException` if the email or password are incorrect.
   */
  async signIn(data: AuthDto): Promise<{ user: User; tokens: Tokens }> {
    // Check if user exists
    const user = await this.userService.findByEmail(data.email);
    if (!user)
      throw new BadRequestException('The email or password are incorrect');
    const passwordMatches = await Password.compare(
      user.password,
      data.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('The email or password are incorrect');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  /**
   * Updates the refresh token of a user to null.
   * @param userId The ID of the user to logout.
   * @returns A promise that resolves when the user's refresh token is updated.
   */
  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null });
  }

  /**
   * Hashes the provided refresh token and updates the refresh token of a user.
   * @param userId The ID of the user to update the refresh token for.
   * @param refreshToken The refresh token to update.
   * @returns A promise that resolves when the user's refresh token is updated.
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await Password.toHash(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  /**
   * Generates access and refresh tokens for a user.
   * @param userId The ID of the user to generate tokens for.
   * @param email The email of the user to generate tokens for.
   * @returns A promise that resolves to an object containing the access and refresh tokens.
   */
  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRES_IN',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRES_IN',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Validates the provided refresh token, generates new access and refresh tokens if the refresh token is valid.
   * @param userId The ID of the user to refresh tokens for.
   * @param refreshToken The refresh token to validate and refresh.
   * @returns A promise that resolves to an object containing the new access and refresh tokens.
   * @throws `ForbiddenException` if the access is denied.
   */
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await Password.compare(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
