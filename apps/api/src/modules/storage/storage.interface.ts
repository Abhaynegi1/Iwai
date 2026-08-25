export const STORAGE_SERVICE = "STORAGE_SERVICE";

export interface IStorageService {
  /**
   * Generate a pre-signed PUT URL for direct client upload
   */
  getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresInSeconds?: number,
  ): Promise<string>;

  /**
   * Get the public URL for serving the object
   */
  getPublicUrl(key: string): string;

  /**
   * Delete an object from storage
   */
  deleteObject(key: string): Promise<void>;

  /**
   * Check if an object exists in storage
   */
  objectExists(key: string): Promise<boolean>;
}
