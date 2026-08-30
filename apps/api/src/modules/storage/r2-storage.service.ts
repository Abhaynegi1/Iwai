import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { IStorageService } from "./storage.interface";

@Injectable()
export class R2StorageService implements IStorageService {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor(private config: ConfigService) {
    const accountId = this.config.get<string>("R2_ACCOUNT_ID")!;
    const accessKeyId = this.config.get<string>("R2_ACCESS_KEY_ID")!;
    const secretAccessKey = this.config.get<string>("R2_SECRET_ACCESS_KEY")!;
    this.bucketName = this.config.get<string>("R2_BUCKET_NAME", "iwai-photos");
    this.publicUrl = this.config.get<string>(
      "R2_PUBLIC_URL",
      `https://${this.bucketName}.${accountId}.r2.cloudflarestorage.com`,
    );

    this.s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.logger.log(`R2Storage initialized for bucket: ${this.bucketName}`);
  }

  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresInSeconds = 1800,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
  }

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }

  async objectExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.s3Client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  async getObject(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const response = await this.s3Client.send(command);
    if (!response.Body) {
      throw new Error(`Storage object response has no body: ${key}`);
    }
    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
  }

  async putObject(
    key: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    await this.s3Client.send(command);
  }
}

