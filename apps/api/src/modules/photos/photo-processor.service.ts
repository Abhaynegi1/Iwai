import { Inject, Injectable, Logger } from "@nestjs/common";
import sharp from "sharp";
import { STORAGE_SERVICE } from "../storage/storage.interface";
import type { IStorageService } from "../storage/storage.interface";

export interface ProcessedPhotoResult {
  thumbnailKey: string;
  previewKey: string;
  width: number;
  height: number;
  fileSizeBytes: number;
}

@Injectable()
export class PhotoProcessorService {
  private readonly logger = new Logger(PhotoProcessorService.name);

  constructor(
    @Inject(STORAGE_SERVICE) private storageService: IStorageService,
  ) {}

  /**
   * Processes an uploaded photo:
   * 1. Fetches the original buffer from storage
   * 2. Extracts true image metadata (width, height)
   * 3. Generates responsive WebP thumbnail (max 400px width)
   * 4. Generates optimized WebP preview (max 1600px width)
   * 5. Saves generated assets directly to storage
   */
  async processPhoto(
    storageKey: string,
    eventId: string,
    photoId: string,
  ): Promise<ProcessedPhotoResult> {
    this.logger.log(`Processing photo ${photoId} from storage key: ${storageKey}`);

    const buffer = await this.storageService.getObject(storageKey);
    const image = sharp(buffer, { failOn: "none" });
    const metadata = await image.metadata();

    const width = metadata.width || 800;
    const height = metadata.height || 600;

    // 1. Generate Thumbnail (max 400px, WebP, quality 80)
    const thumbnailKey = `events/${eventId}/photos/${photoId}-thumb.webp`;
    const thumbnailBuffer = await sharp(buffer, { failOn: "none" })
      .rotate() // auto-orient based on EXIF
      .resize({
        width: 400,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    await this.storageService.putObject(
      thumbnailKey,
      thumbnailBuffer,
      "image/webp",
    );

    // 2. Generate Optimized Preview (max 1600px, WebP, quality 85)
    const previewKey = `events/${eventId}/photos/${photoId}-preview.webp`;
    const previewBuffer = await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize({
        width: 1600,
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    await this.storageService.putObject(
      previewKey,
      previewBuffer,
      "image/webp",
    );

    this.logger.log(
      `Photo ${photoId} processed successfully: ${width}x${height}, thumb: ${thumbnailKey}, preview: ${previewKey}`,
    );

    return {
      thumbnailKey,
      previewKey,
      width,
      height,
      fileSizeBytes: buffer.length,
    };
  }
}
