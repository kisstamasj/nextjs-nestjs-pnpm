import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true

      
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    /**
     * Configures global validation using `ValidationPipe` and `APP_PIPE` provider.
     */
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        exceptionFactory: (errors) => {
          const result = errors.map((error) => ({
            property: error.property,
            message: error.constraints[Object.keys(error.constraints)[0]],
          }));
          return new BadRequestException(result);
        },
      }),
    },
  ],
})
export class AppModule {}
