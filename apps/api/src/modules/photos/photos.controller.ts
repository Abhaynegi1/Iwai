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
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import type { GuestJwtPayload } from "@iwai/shared";
import {
  confirmUploadSchema,
  photoFilterSchema,
  requestUploadUrlSchema,
  updatePhotoSchema,
} from "@iwai/validation";
import type {
  ConfirmUploadInput,
  PhotoFilterInput,
  RequestUploadUrlInput,
  UpdatePhotoInput,
} from "@iwai/validation";
import { CurrentGuest } from "../../common/decorators/current-guest.decorator";
import { GuestAuthGuard } from "../../common/guards/guest-auth.guard";
import { JwtOrGuestAuthGuard } from "../../common/guards/jwt-or-guest-auth.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { PhotosService } from "./photos.service";

@Controller()
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post("events/:eventId/photos/upload-url")
  @UseGuards(GuestAuthGuard)
  @UsePipes(new ZodValidationPipe(requestUploadUrlSchema))
  async requestUploadUrl(
    @Param("eventId") eventId: string,
    @Body() body: RequestUploadUrlInput,
    @CurrentGuest() guest: GuestJwtPayload,
  ) {
    return this.photosService.requestUploadUrl(
      eventId,
      guest.sub,
      guest.role,
      body,
    );
  }

  @Post("events/:eventId/photos/confirm")
  @UseGuards(GuestAuthGuard)
  @UsePipes(new ZodValidationPipe(confirmUploadSchema))
  async confirmUpload(
    @Body() body: ConfirmUploadInput,
    @CurrentGuest() guest: GuestJwtPayload,
  ) {
    return this.photosService.confirmUpload(body.photoId, guest.sub, body);
  }

  @Get("events/:eventId/photos")
  @UseGuards(JwtOrGuestAuthGuard)
  @UsePipes(new ZodValidationPipe(photoFilterSchema))
  async getEventPhotos(
    @Param("eventId") eventId: string,
    @Query() query: PhotoFilterInput,
  ) {
    return this.photosService.getEventPhotos(eventId, query);
  }

  @Get("photos/:photoId")
  @UseGuards(JwtOrGuestAuthGuard)
  async getPhotoById(@Param("photoId") photoId: string) {
    return this.photosService.getPhotoById(photoId);
  }

  @Patch("photos/:photoId")
  @UseGuards(GuestAuthGuard)
  @UsePipes(new ZodValidationPipe(updatePhotoSchema))
  async updatePhoto(
    @Param("photoId") photoId: string,
    @Body() body: UpdatePhotoInput,
    @CurrentGuest() guest: GuestJwtPayload,
  ) {
    const isHost = ["host", "co_host"].includes(guest.role);
    return this.photosService.updatePhoto(photoId, guest.sub, isHost, body);
  }

  @Post("photos/:photoId/like")
  @UseGuards(GuestAuthGuard)
  async toggleLike(
    @Param("photoId") photoId: string,
    @CurrentGuest() guest: GuestJwtPayload,
  ) {
    return this.photosService.toggleLike(photoId, guest.sub);
  }

  @Delete("photos/:photoId")
  @UseGuards(JwtOrGuestAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePhoto(
    @Param("photoId") photoId: string,
    @Req() req: any,
  ) {
    if (req.authType === "organizer") {
      return this.photosService.deletePhoto(
        photoId,
        undefined,
        false,
        req.user.sub,
      );
    }
    const isHost = ["host", "co_host"].includes(req.guest?.role);
    return this.photosService.deletePhoto(photoId, req.guest?.sub, isHost);
  }
}
