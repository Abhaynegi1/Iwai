import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { DRIZZLE_DB } from "../../database/database.module";

describe("AuthService", () => {
  let service: AuthService;

  const mockDb = {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue("mock-jwt-token"),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string, defaultVal: string) => defaultVal || "mock-secret"),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DRIZZLE_DB, useValue: mockDb },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should generate tokens for user", async () => {
    const mockUser = {
      id: "user-123",
      email: "host@example.com",
      passwordHash: "hashed",
      name: "Host User",
      avatarUrl: null,
      role: "user" as const,
      googleId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const tokens = await service.generateTokens(mockUser);
    expect(tokens).toHaveProperty("accessToken", "mock-jwt-token");
    expect(tokens).toHaveProperty("refreshToken", "mock-jwt-token");
    expect(tokens.expiresIn).toBe(900);
  });

  it("should generate guest token for attendee", async () => {
    const mockAttendee = {
      id: "att-123",
      eventId: "event-123",
      userId: null,
      nickname: "Cool Guest",
      avatarUrl: null,
      role: "guest" as const,
      pinCode: null,
      lastActiveAt: new Date(),
      createdAt: new Date(),
    };

    const token = await service.generateGuestToken(mockAttendee, "event-123");
    expect(token).toBe("mock-jwt-token");
  });
});
