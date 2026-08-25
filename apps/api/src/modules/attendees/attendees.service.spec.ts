import { Test, TestingModule } from "@nestjs/testing";
import { AttendeesService } from "./attendees.service";
import { AuthService } from "../auth/auth.service";
import { DRIZZLE_DB } from "../../database/database.module";

describe("AttendeesService", () => {
  let service: AttendeesService;

  const mockDb = {
    query: {
      events: { findFirst: jest.fn() },
      attendees: { findFirst: jest.fn(), findMany: jest.fn() },
    },
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
  };

  const mockAuthService = {
    generateGuestToken: jest.fn().mockResolvedValue("mock-guest-token"),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendeesService,
        { provide: DRIZZLE_DB, useValue: mockDb },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    service = module.get<AttendeesService>(AttendeesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should allow guest to join event with nickname", async () => {
    const mockEvent = {
      id: "event-123",
      eventCode: "XYZ123",
      status: "active" as const,
      name: "Birthday Party",
      slug: "bday-xyz",
      description: null,
      coverPhotoUrl: null,
      qrCodeUrl: null,
      location: null,
      timezone: "UTC",
      startsAt: new Date(),
      endsAt: new Date(),
      maxPhotosPerGuest: 50,
      maxTotalPhotos: 250,
      isGuestUploadEnabled: true,
      isPublicGallery: true,
      storageLimitBytes: 5368709120,
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      organizationId: null,
      creatorId: "user-123",
    };

    const mockAttendee = {
      id: "att-123",
      eventId: "event-123",
      userId: null,
      nickname: "Sarah",
      avatarUrl: null,
      role: "guest" as const,
      pinCode: null,
      lastActiveAt: new Date(),
      createdAt: new Date(),
    };

    mockDb.query.events.findFirst.mockResolvedValueOnce(mockEvent);
    mockDb.query.attendees.findFirst.mockResolvedValueOnce(null);
    mockDb.returning.mockResolvedValueOnce([mockAttendee]);

    const session = await service.joinEvent({
      eventCode: "XYZ123",
      nickname: "Sarah",
    });

    expect(session.guestToken).toBe("mock-guest-token");
    expect(session.attendee.nickname).toBe("Sarah");
    expect(session.event.name).toBe("Birthday Party");
  });
});
