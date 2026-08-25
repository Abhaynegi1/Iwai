import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import type { OrganizerJwtPayload } from "@iwai/shared";
import {
  createEventSchema,
  updateEventSchema,
} from "@iwai/validation";
import type {
  CreateEventInput,
  UpdateEventInput,
} from "@iwai/validation";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createEventSchema))
  async createEvent(
    @Body() body: CreateEventInput,
    @CurrentUser() user: OrganizerJwtPayload,
  ) {
    return this.eventsService.createEvent(user.sub, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyEvents(
    @CurrentUser() user: OrganizerJwtPayload,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return this.eventsService.getMyEvents(
      user.sub,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get("code/:code")
  async getEventByCode(@Param("code") code: string) {
    return this.eventsService.getEventByCode(code);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getEventById(
    @Param("id") id: string,
    @CurrentUser() user: OrganizerJwtPayload,
  ) {
    return this.eventsService.getEventById(id, user.sub);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateEventSchema))
  async updateEvent(
    @Param("id") id: string,
    @Body() body: UpdateEventInput,
    @CurrentUser() user: OrganizerJwtPayload,
  ) {
    return this.eventsService.updateEvent(id, user.sub, body);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvent(
    @Param("id") id: string,
    @CurrentUser() user: OrganizerJwtPayload,
  ) {
    return this.eventsService.deleteEvent(id, user.sub);
  }
}
