import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import {
  organizations,
  organizationMembers,
  subscriptions,
  users,
} from "@iwai/database";
import type {
  Attendee,
  Database,
  User,
} from "@iwai/database";
import type {
  AuthTokens,
  GuestJwtPayload,
  OrganizerJwtPayload,
  UserEntity,
} from "@iwai/shared";
import type {
  LoginInput,
  RegisterInput,
} from "@iwai/validation";
import { DRIZZLE_DB } from "../../database/database.module";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE_DB) private db: Database,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(
    input: RegisterInput,
  ): Promise<{ user: UserEntity; tokens: AuthTokens }> {
    const existing = await this.db.query.users.findFirst({
      where: eq(users.email, input.email.toLowerCase()),
    });

    if (existing) {
      throw new ConflictException("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const slugBase = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 30);
    const orgSlug = `${slugBase}-${Math.random().toString(36).substring(2, 7)}`;

    // Create user, default org, org membership, and subscription
    const [newUser] = await this.db
      .insert(users)
      .values({
        email: input.email.toLowerCase(),
        passwordHash,
        name: input.name,
        role: "user",
      })
      .returning();

    const [newOrg] = await this.db
      .insert(organizations)
      .values({
        name: `${input.name}'s Organization`,
        slug: orgSlug,
        ownerId: newUser.id,
      })
      .returning();

    await this.db.insert(organizationMembers).values({
      organizationId: newOrg.id,
      userId: newUser.id,
      role: "owner",
    });

    await this.db.insert(subscriptions).values({
      organizationId: newOrg.id,
      planTier: "free",
      status: "active",
      maxEvents: 1,
    });

    const tokens = await this.generateTokens(newUser);
    return {
      user: this.toUserEntity(newUser),
      tokens,
    };
  }

  async login(
    input: LoginInput,
  ): Promise<{ user: UserEntity; tokens: AuthTokens }> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, input.email.toLowerCase()),
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const tokens = await this.generateTokens(user);
    return {
      user: this.toUserEntity(user),
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const refreshSecret = this.config.get<string>(
        "JWT_REFRESH_SECRET",
        "iwai-dev-jwt-refresh-secret-key-32chars",
      );
      const payload = await this.jwtService.verifyAsync<OrganizerJwtPayload>(
        refreshToken,
        { secret: refreshSecret },
      );

      const user = await this.db.query.users.findFirst({
        where: eq(users.id, payload.sub),
      });

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  async getCurrentUser(userId: string): Promise<UserEntity> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return this.toUserEntity(user);
  }

  async updateCurrentUser(
    userId: string,
    data: { name?: string; avatarUrl?: string },
  ): Promise<UserEntity> {
    const updateData: Partial<{ name: string; avatarUrl: string | null }> = {};
    if (data.name !== undefined && data.name.trim().length > 0) {
      updateData.name = data.name.trim();
    }
    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl ? data.avatarUrl.trim() : null;
    }

    if (Object.keys(updateData).length > 0) {
      await this.db
        .update(users)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }

    return this.getCurrentUser(userId);
  }

  async generateTokens(user: User): Promise<AuthTokens> {
    const accessSecret = this.config.get<string>(
      "JWT_SECRET",
      "iwai-dev-jwt-super-secret-key-32chars-min",
    );
    const accessExpiresIn = this.config.get<string>("JWT_EXPIRES_IN", "15m");
    const refreshSecret = this.config.get<string>(
      "JWT_REFRESH_SECRET",
      "iwai-dev-jwt-refresh-secret-key-32chars",
    );
    const refreshExpiresIn = this.config.get<string>(
      "JWT_REFRESH_EXPIRES_IN",
      "7d",
    );

    const payload: OrganizerJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: accessExpiresIn as unknown as number,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as unknown as number,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 mins in seconds
    };
  }

  async generateGuestToken(
    attendee: Attendee,
    eventId: string,
  ): Promise<string> {
    const secret = this.config.get<string>(
      "JWT_SECRET",
      "iwai-dev-jwt-super-secret-key-32chars-min",
    );
    const payload: GuestJwtPayload = {
      sub: attendee.id,
      eventId,
      role: attendee.role,
      nickname: attendee.nickname,
    };

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: "7d" as unknown as number,
    });
  }

  /**
   * Resolves the authenticated organizer from either:
   * 1. A signed JWT token (native organizer JWT)
   * 2. A Neon Auth / Better Auth session token (Google OAuth or email session)
   */
  async resolveUserFromToken(token: string): Promise<OrganizerJwtPayload> {
    const secret = this.config.get<string>(
      "JWT_SECRET",
      "iwai-dev-jwt-super-secret-key-32chars-min",
    );

    // 1. First attempt: standard JWT verification
    try {
      const payload = await this.jwtService.verifyAsync<OrganizerJwtPayload>(
        token,
        { secret },
      );
      if (payload && payload.sub && payload.email) {
        return payload;
      }
    } catch {
      // Token is not a signed JWT; check for Neon Auth session
    }

    // 2. Second attempt: query Neon Auth session from postgres
    try {
      const result = await this.db.execute(sql`
        SELECT s.token, s."expiresAt" as expires_at, u.id as neon_user_id, u.email, u.name, u.image
        FROM neon_auth.session s
        JOIN neon_auth.user u ON s."userId" = u.id
        WHERE s.token = ${token} AND s."expiresAt" > NOW()
        LIMIT 1;
      `);

      type NeonSessionRow = {
        token: string;
        expires_at: Date;
        neon_user_id: string;
        email: string;
        name: string | null;
        image: string | null;
      };

      const rows = (result as unknown) as NeonSessionRow[];
      if (rows && rows.length > 0) {
        const sessionRow = rows[0];
        const email = String(sessionRow.email).toLowerCase();
        const name = sessionRow.name || email.split("@")[0];
        const avatarUrl = sessionRow.image || null;

        // Find or auto-provision in public.users
        let user = await this.db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user) {
          const slugBase = name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 30);
          const orgSlug = `${slugBase || "org"}-${Math.random().toString(36).substring(2, 7)}`;

          const [createdUser] = await this.db
            .insert(users)
            .values({
              email,
              name,
              avatarUrl,
              role: "user",
            })
            .returning();

          user = createdUser;

          const [newOrg] = await this.db
            .insert(organizations)
            .values({
              name: `${name}'s Organization`,
              slug: orgSlug,
              ownerId: user.id,
            })
            .returning();

          await this.db.insert(organizationMembers).values({
            organizationId: newOrg.id,
            userId: user.id,
            role: "owner",
          });

          await this.db.insert(subscriptions).values({
            organizationId: newOrg.id,
            planTier: "free",
            status: "active",
            maxEvents: 1,
          });
        }

        return {
          sub: user.id,
          email: user.email,
          role: user.role,
        };
      }
    } catch (err: unknown) {
      console.warn("Failed to resolve session from neon_auth tables:", err);
    }

    throw new UnauthorizedException("Invalid or expired authentication token");
  }

  private toUserEntity(user: User): UserEntity {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
