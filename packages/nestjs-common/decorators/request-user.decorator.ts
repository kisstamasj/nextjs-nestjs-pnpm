import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IRequestUser } from "./request-user.type";

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IRequestUser;
  }
);
