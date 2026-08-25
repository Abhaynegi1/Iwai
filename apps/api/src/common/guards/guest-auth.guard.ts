import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { GuestJwtPayload } from "@iwai/shared";

@Injectable()
export class GuestAuthGuard implements CanActivate {
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
      throw new UnauthorizedException("Guest event token is required");
    }

    try {
      const secret = this.configService.get<string>(
        "JWT_SECRET",
        "iwai-dev-jwt-super-secret-key-32chars-min",
      );
      const payload = await this.jwtService.verifyAsync<GuestJwtPayload>(
        token,
        { secret },
      );

      // Check that token has the guest payload structure
      if (!payload.sub || !payload.eventId) {
        throw new UnauthorizedException("Invalid guest token structure");
      }

      request.guest = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired guest event token");
    }
  }
}
