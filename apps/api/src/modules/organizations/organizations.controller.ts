import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import type { OrganizerJwtPayload } from "@iwai/shared";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { OrganizationsService } from "./organizations.service";

@Controller("organizations")
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Get("my")
  async getMyOrganizations(@CurrentUser() user: OrganizerJwtPayload) {
    return this.orgService.getMyOrganizations(user.sub);
  }

  @Get(":id")
  async getOrganization(
    @Param("id") id: string,
    @CurrentUser() user: OrganizerJwtPayload,
  ) {
    return this.orgService.getOrganizationById(id, user.sub);
  }

  @Patch(":id")
  async updateOrganization(
    @Param("id") id: string,
    @Body() body: { name?: string; avatarUrl?: string },
    @CurrentUser() user: OrganizerJwtPayload,
  ) {
    return this.orgService.updateOrganization(id, user.sub, body);
  }
}
