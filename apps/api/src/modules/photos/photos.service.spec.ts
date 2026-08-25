import { Test, TestingModule } from "@nestjs/testing";
import { PhotosService } from "./photos.service";
import { DRIZZLE_DB } from "../../database/database.module";
import { STORAGE_SERVICE } from "../storage/storage.interface";

describe("PhotosService", () => {
  let service: PhotosService;

  const mockDb = {
    query: {
      events: { findFirst: jest.fn() },
      photos: { findFirst: jest.fn(), findMany: jest.fn() },
      photoLikes: { findFirst: jest.fn() },
    },
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnValue([{ count: 0 }]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  const mockStorageService = {
    getPresignedUploadUrl: jest
      .fn()
      .mockResolvedValue("https://storage.example.com/presigned-put"),
    getPublicUrl: jest
      .fn()
      .mockReturnValue("https://cdn.example.com/photos/abc.jpg"),
    deleteObject: jest.fn().mockResolvedValue(undefined),
    objectExists: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        { provide: DRIZZLE_DB, useValue: mockDb },
        { provide: STORAGE_SERVICE, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should generate pre-signed upload URL within quota", async () => {
    const mockEvent = {
      id: "event-123",
      status: "active" as const,
      isGuestUploadEnabled: true,
      maxPhotosPerGuest: 50,
      maxTotalPhotos: 250,
    };

    mockDb.query.events.findFirst.mockResolvedValueOnce(mockEvent);

    const result = await service.requestUploadUrl(
      "event-123",
      "att-123",
      "guest",
      {
        filename: "sunset.jpg",
        mimeType: "image/jpeg",
        fileSizeBytes: 2048000,
      },
    );

    expect(result).toHaveProperty("photoId");
    expect(result.uploadUrl).toBe("https://storage.example.com/presigned-put");
    expect(result.storageKey).toContain("events/event-123/photos/");
  });
});
