import { Test, TestingModule } from "@nestjs/testing";
import { EventsService } from "./events.service";
import { DRIZZLE_DB } from "../../database/database.module";

describe("EventsService", () => {
  let service: EventsService;

  const mockDb = {
    query: {
      users: { findFirst: jest.fn() },
      organizationMembers: { findFirst: jest.fn() },
      events: { findFirst: jest.fn(), findMany: jest.fn() },
      attendees: { findMany: jest.fn() },
    },
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnValue([{ count: 5 }]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: DRIZZLE_DB, useValue: mockDb },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should lookup event by code", async () => {
    const mockEvent = {
      id: "event-123",
      organizationId: null,
      creatorId: "user-123",
      name: "Wedding Reception",
      slug: "wedding-reception-abc12",
      description: "Our special day",
      coverPhotoUrl: "https://example.com/cover.jpg",
      eventCode: "ABCDEF",
      qrCodeUrl: null,
      location: "San Francisco",
      timezone: "UTC",
      startsAt: new Date("2026-09-01T10:00:00Z"),
      endsAt: new Date("2026-09-01T22:00:00Z"),
      status: "active" as const,
      maxPhotosPerGuest: 50,
      maxTotalPhotos: 250,
      isGuestUploadEnabled: true,
      isPublicGallery: true,
      storageLimitBytes: 5368709120,
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDb.query.events.findFirst.mockResolvedValueOnce(mockEvent);

    const result = await service.getEventByCode("ABCDEF");
    expect(result.id).toBe("event-123");
    expect(result.name).toBe("Wedding Reception");
    expect(result.status).toBe("active");
  });
});
