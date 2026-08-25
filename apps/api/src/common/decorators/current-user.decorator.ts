import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { OrganizerJwtPayload } from "@iwai/shared";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): OrganizerJwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
