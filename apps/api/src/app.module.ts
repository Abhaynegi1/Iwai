import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { AttendeesModule } from "./modules/attendees/attendees.module";
import { AuthModule } from "./modules/auth/auth.module";
import { EventsModule } from "./modules/events/events.module";
import { HealthModule } from "./modules/health/health.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { PhotosModule } from "./modules/photos/photos.module";
import { StorageModule } from "./modules/storage/storage.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../../.env", ".env"],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    StorageModule,
    AuthModule,
    OrganizationsModule,
    EventsModule,
    AttendeesModule,
    PhotosModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
