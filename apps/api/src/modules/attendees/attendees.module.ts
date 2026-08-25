import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AttendeesController } from "./attendees.controller";
import { AttendeesService } from "./attendees.service";

@Module({
  imports: [AuthModule],
  controllers: [AttendeesController],
  providers: [AttendeesService],
  exports: [AttendeesService],
})
export class AttendeesModule {}
