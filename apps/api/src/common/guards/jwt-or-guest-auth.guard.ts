import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { GuestJwtPayload, OrganizerJwtPayload } from "@iwai/shared";

@Injectable()
export class JwtOrGuestAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      request.headers["x-guest-token"] ||
      (request.headers.authorization?.startsWith("Bearer ")
        ? request.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      throw new UnauthorizedException("Authentication token is required");
    }

    try {
      const secret = this.configService.get<string>(
        "JWT_SECRET",
        "iwai-dev-jwt-super-secret-key-32chars-min",
      );

      const payload = await this.jwtService.verifyAsync<
        (OrganizerJwtPayload & { eventId?: never }) | GuestJwtPayload
      >(token, { secret });

      if ("eventId" in payload && payload.eventId) {
        request.guest = payload as GuestJwtPayload;
        request.authType = "guest";
        return true;
      } else if (payload.sub && "email" in payload) {
        request.user = payload as OrganizerJwtPayload;
        request.authType = "organizer";
        return true;
      }

      throw new UnauthorizedException("Unrecognized token payload structure");
    } catch {
      throw new UnauthorizedException("Invalid or expired authentication token");
    }
  }
}
