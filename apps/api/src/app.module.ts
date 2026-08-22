import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthModule } from "./modules/health/health.module";

/**
 * Root application module.
 *
 * Future modules to register here:
 *   - ConfigModule    (app configuration / env validation)
 *   - DatabaseModule  (Drizzle ORM connection)
 *   - AuthModule
 *   - UsersModule
 *   - OrganizationsModule
 *   - EventsModule
 *   - AttendeesModule
 *   - PhotosModule
 *   - UploadsModule
 *   - GalleriesModule
 *   - SubscriptionsModule
 *   - PaymentsModule
 *   - NotificationsModule
 *   - AdminModule
 */
@Module({
  imports: [HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
