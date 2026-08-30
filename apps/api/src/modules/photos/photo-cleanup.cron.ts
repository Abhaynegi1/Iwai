import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { and, eq, lt } from "drizzle-orm";
import { events, photos } from "@iwai/database";
import type { Database } from "@iwai/database";
import { DRIZZLE_DB } from "../../database/database.module";
import { STORAGE_SERVICE } from "../storage/storage.interface";
import type { IStorageService } from "../storage/storage.interface";

@Injectable()
export class PhotoCleanupCron {
  private readonly logger = new Logger(PhotoCleanupCron.name);

  constructor(
    @Inject(DRIZZLE_DB) private db: Database,
    @Inject(STORAGE_SERVICE) private storageService: IStorageService,
  ) {}

  /**
   * Runs every hour to clean up abandoned uploads that never got confirmed.
   * Any photo stuck in 'pending_upload' for > 2 hours is considered abandoned.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupAbandonedUploads(): Promise<void> {
    this.logger.log("Running scheduled cleanup for abandoned pending uploads...");

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const abandonedPhotos = await this.db.query.photos.findMany({
      where: and(
        eq(photos.status, "pending_upload"),
        lt(photos.uploadedAt, twoHoursAgo),
      ),
    });

    if (abandonedPhotos.length === 0) {
      this.logger.log("No abandoned uploads found.");
      return;
    }

    this.logger.log(`Found ${abandonedPhotos.length} abandoned upload(s) to clean up.`);

    for (const photo of abandonedPhotos) {
      try {
        // Delete original file from storage if it was uploaded
        const exists = await this.storageService.objectExists(photo.storageKey);
        if (exists) {
          await this.storageService.deleteObject(photo.storageKey);
        }

        // Delete any partial thumbnail/preview if created
        if (photo.thumbnailKey) {
          await this.storageService.deleteObject(photo.thumbnailKey);
        }
        if (photo.previewKey) {
          await this.storageService.deleteObject(photo.previewKey);
        }

        // Delete photo row from database
        await this.db.delete(photos).where(eq(photos.id, photo.id));
      } catch (err: unknown) {
        this.logger.error(
          `Failed to clean up abandoned photo ${photo.id}: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(`Cleaned up ${abandonedPhotos.length} abandoned photo(s).`);
  }

  /**
   * Runs daily at midnight to update expired events.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkEventExpirations(): Promise<void> {
    this.logger.log("Checking for expired events...");
    const now = new Date();

    const result = await this.db
      .update(events)
      .set({ status: "expired", updatedAt: now })
      .where(
        and(
          eq(events.status, "active"),
          lt(events.expiresAt, now),
        ),
      )
      .returning();

    if (result.length > 0) {
      this.logger.log(`Marked ${result.length} event(s) as expired.`);
    }
  }
}
