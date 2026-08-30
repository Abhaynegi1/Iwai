import { Test, TestingModule } from "@nestjs/testing";
import sharp from "sharp";
import { PhotoProcessorService } from "./photo-processor.service";
import { STORAGE_SERVICE } from "../storage/storage.interface";

describe("PhotoProcessorService", () => {
  let service: PhotoProcessorService;

  const mockStorageService = {
    getObject: jest.fn(),
    putObject: jest.fn().mockResolvedValue(undefined),
    getPublicUrl: jest.fn(),
    deleteObject: jest.fn(),
    objectExists: jest.fn(),
    getPresignedUploadUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoProcessorService,
        { provide: STORAGE_SERVICE, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<PhotoProcessorService>(PhotoProcessorService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should resize image, generate webp thumbnail and preview, and save to storage", async () => {
    // Generate a valid 200x200 PNG test image buffer
    const testImageBuffer = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 3,
        background: { r: 255, g: 100, b: 50 },
      },
    })
      .png()
      .toBuffer();

    mockStorageService.getObject.mockResolvedValueOnce(testImageBuffer);

    const result = await service.processPhoto(
      "events/ev-1/photos/ph-1.png",
      "ev-1",
      "ph-1",
    );

    expect(result.thumbnailKey).toBe("events/ev-1/photos/ph-1-thumb.webp");
    expect(result.previewKey).toBe("events/ev-1/photos/ph-1-preview.webp");
    expect(result.width).toBe(200);
    expect(result.height).toBe(200);

    // Verify storageService.putObject was called twice (thumbnail and preview)
    expect(mockStorageService.putObject).toHaveBeenCalledTimes(2);
    expect(mockStorageService.putObject).toHaveBeenCalledWith(
      "events/ev-1/photos/ph-1-thumb.webp",
      expect.any(Buffer),
      "image/webp",
    );
    expect(mockStorageService.putObject).toHaveBeenCalledWith(
      "events/ev-1/photos/ph-1-preview.webp",
      expect.any(Buffer),
      "image/webp",
    );
  });
});
