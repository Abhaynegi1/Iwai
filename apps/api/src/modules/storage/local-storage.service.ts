import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import type { IStorageService } from "./storage.interface";

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly storageDir: string;
  private readonly baseUrl: string;

  constructor(private config: ConfigService) {
    this.storageDir = path.resolve(process.cwd(), ".storage");
    const port = this.config.get<number>("PORT", 3001);
    this.baseUrl = this.config.get<string>(
      "API_URL",
      `http://localhost:${port}`,
    );

    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    this.logger.log(`LocalStorage initialized at ${this.storageDir}`);
  }

  async getPresignedUploadUrl(
    key: string,
    _contentType: string,
    _expiresInSeconds = 1800,
  ): Promise<string> {
    // Return direct local API upload endpoint
    return `${this.baseUrl}/api/storage/local/${encodeURIComponent(key)}`;
  }

  getPublicUrl(key: string): string {
    return `${this.baseUrl}/api/storage/local/${encodeURIComponent(key)}`;
  }

  async deleteObject(key: string): Promise<void> {
    const filePath = path.join(this.storageDir, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async objectExists(key: string): Promise<boolean> {
    const filePath = path.join(this.storageDir, key);
    return fs.existsSync(filePath);
  }

  async getObject(key: string): Promise<Buffer> {
    const filePath = path.join(this.storageDir, key);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Storage object not found: ${key}`);
    }
    return fs.promises.readFile(filePath);
  }

  async putObject(key: string, buffer: Buffer, _contentType: string): Promise<void> {
    await this.saveLocalFile(key, buffer);
  }


  /**
   * Internal method for writing local file buffer
   */
  async saveLocalFile(key: string, buffer: Buffer): Promise<void> {
    const filePath = path.join(this.storageDir, key);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await fs.promises.writeFile(filePath, buffer);
  }

  getLocalFilePath(key: string): string {
    return path.join(this.storageDir, key);
  }
}
