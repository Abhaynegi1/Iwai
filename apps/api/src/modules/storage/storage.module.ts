import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalStorageService } from "./local-storage.service";
import { R2StorageService } from "./r2-storage.service";
import { StorageController } from "./storage.controller";
import { STORAGE_SERVICE } from "./storage.interface";
import type { IStorageService } from "./storage.interface";

@Global()
@Module({
  controllers: [StorageController],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useFactory: (config: ConfigService): IStorageService => {
        const hasR2 =
          Boolean(config.get("R2_ACCOUNT_ID")) &&
          Boolean(config.get("R2_ACCESS_KEY_ID")) &&
          Boolean(config.get("R2_SECRET_ACCESS_KEY"));

        if (hasR2) {
          return new R2StorageService(config);
        }

        return new LocalStorageService(config);
      },
      inject: [ConfigService],
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
