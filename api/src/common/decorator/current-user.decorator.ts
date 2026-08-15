import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../interface/authenticated-request';

export const CurrentUser = createParamDecorator(
  (
    data: keyof AuthenticatedRequest['user'] | undefined,
    context: ExecutionContext,
  ) => {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const user = request.user;

    return data ? user[data] : user;
  },
);
