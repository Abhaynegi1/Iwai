import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import type {
  AttendeeRole,
  GuestJwtPayload,
  OrganizerJwtPayload,
} from "@iwai/shared";
import {
  joinEventByCodeSchema,
  updateAttendeeProfileSchema,
} from "@iwai/validation";
import type {
  JoinEventByCodeInput,
  UpdateAttendeeProfileInput,
} from "@iwai/validation";
import { CurrentGuest } from "../../common/decorators/current-guest.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { GuestAuthGuard } from "../../common/guards/guest-auth.guard";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { AttendeesService } from "./attendees.service";

@Controller("attendees")
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post("join")
  @UsePipes(new ZodValidationPipe(joinEventByCodeSchema))
  async joinEvent(@Body() body: JoinEventByCodeInput) {
    return this.attendeesService.joinEvent(body);
  }

  @Get("events/:eventId")
  @UseGuards(GuestAuthGuard)
  async getEventAttendees(@Param("eventId") eventId: string) {
    return this.attendeesService.getAttendeesForEvent(eventId);
  }

  @Patch("me")
  @UseGuards(GuestAuthGuard)
  @UsePipes(new ZodValidationPipe(updateAttendeeProfileSchema))
  async updateMyProfile(
    @Body() body: UpdateAttendeeProfileInput,
    @CurrentGuest() guest: GuestJwtPayload,
  ) {
    return this.attendeesService.updateMyProfile(guest.sub, body);
  }

  @Patch("events/:eventId/roles/:attendeeId")
  @UseGuards(JwtAuthGuard)
  async updateAttendeeRole(
    @Param("eventId") eventId: string,
    @Param("attendeeId") attendeeId: string,
    @Body("role") role: AttendeeRole,
    @CurrentUser() user: OrganizerJwtPayload,
  ) {
    return this.attendeesService.updateAttendeeRole(
      eventId,
      user.sub,
      attendeeId,
      role,
    );
  }
}
