import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Put,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import * as fs from "fs";
import { LocalStorageService } from "./local-storage.service";
import { STORAGE_SERVICE } from "./storage.interface";
import type { IStorageService } from "./storage.interface";

@Controller("storage/local")
export class StorageController {
  constructor(
    @Inject(STORAGE_SERVICE) private storageService: IStorageService,
  ) {}

  @Put(":key")
  async handleLocalUpload(
    @Param("key") key: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    if (!(this.storageService instanceof LocalStorageService)) {
      res.status(400).json({ message: "Local storage driver is not active" });
      return;
    }

    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      await (this.storageService as LocalStorageService).saveLocalFile(
        decodeURIComponent(key),
        buffer,
      );
      res.status(200).send({ message: "File uploaded successfully" });
    });
  }

  @Get(":key")
  async serveLocalFile(
    @Param("key") key: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!(this.storageService instanceof LocalStorageService)) {
      throw new NotFoundException("Local storage driver is not active");
    }

    const decodedKey = decodeURIComponent(key);
    const filePath = (this.storageService as LocalStorageService).getLocalFilePath(
      decodedKey,
    );

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException("File not found");
    }

    res.sendFile(filePath);
  }
}
