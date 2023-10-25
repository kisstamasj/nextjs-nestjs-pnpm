import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

/*
  A NestJS interceptor that serializes the response data before it is sent out.
  
  Example Usage:
  @Serialize(UserDto)
  @Get('/users')
  getUsers() {
    return this.userService.getUsers();
  }
  
  Attributes:
  - `dto`: The DTO class used to serialize the response data.
  
  Methods:
  - intercept(context: ExecutionContext, handler: CallHandler): Observable<any>`: Intercepts the response data before it is sent out and transforms it into an instance of the DTO class.
  */
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request handled by the request handler

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        const userdata = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
        return userdata;
      }),
    );
  }
}
