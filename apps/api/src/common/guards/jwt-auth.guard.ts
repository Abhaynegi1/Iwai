import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { OrganizerJwtPayload } from "@iwai/shared";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Authentication token is required");
    }

    const token = authHeader.split(" ")[1];

    try {
      const secret = this.configService.get<string>(
        "JWT_SECRET",
        "iwai-dev-jwt-super-secret-key-32chars-min",
      );
      const payload = await this.jwtService.verifyAsync<OrganizerJwtPayload>(
        token,
        { secret },
      );
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired authentication token");
    }
  }
}
