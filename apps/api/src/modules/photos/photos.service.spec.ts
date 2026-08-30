import { Test, TestingModule } from "@nestjs/testing";
import { PhotosService } from "./photos.service";
import { DRIZZLE_DB } from "../../database/database.module";
import { STORAGE_SERVICE } from "../storage/storage.interface";
import { PhotoProcessorService } from "./photo-processor.service";

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
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      }),
    }),
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
    getObject: jest.fn().mockResolvedValue(Buffer.from("dummy-image-data")),
    putObject: jest.fn().mockResolvedValue(undefined),
  };

  const mockPhotoProcessor = {
    processPhoto: jest.fn().mockResolvedValue({
      thumbnailKey: "events/event-123/photos/photo-123-thumb.webp",
      previewKey: "events/event-123/photos/photo-123-preview.webp",
      width: 1920,
      height: 1080,
      fileSizeBytes: 2048000,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        { provide: DRIZZLE_DB, useValue: mockDb },
        { provide: STORAGE_SERVICE, useValue: mockStorageService },
        { provide: PhotoProcessorService, useValue: mockPhotoProcessor },
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

  it("should confirm upload, process thumbnail, and return image URLs", async () => {
    const mockPhoto = {
      id: "photo-123",
      eventId: "event-123",
      attendeeId: "att-123",
      storageKey: "events/event-123/photos/photo-123.jpg",
      originalFilename: "photo.jpg",
      mimeType: "image/jpeg",
      fileSizeBytes: 2048000,
      status: "pending_upload",
      isFavorite: false,
      uploadedAt: new Date(),
    };

    mockDb.query.photos.findFirst.mockResolvedValueOnce(mockPhoto);
    (mockDb.update as jest.Mock).mockReturnValueOnce({
      set: jest.fn().mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([
            {
              ...mockPhoto,
              status: "ready",
              thumbnailKey: "events/event-123/photos/photo-123-thumb.webp",
              previewKey: "events/event-123/photos/photo-123-preview.webp",
              width: 1920,
              height: 1080,
            },
          ]),
        }),
      }),
    });

    const result = await service.confirmUpload("photo-123", "att-123", {
      photoId: "photo-123",
      storageKey: "events/event-123/photos/photo-123.jpg",
    });

    expect(result.status).toBe("ready");
    expect(result).toHaveProperty("thumbnailUrl");
    expect(result).toHaveProperty("previewUrl");
    expect(result).toHaveProperty("publicUrl");
  });
});
