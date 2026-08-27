import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import * as FileSystem from "expo-file-system/legacy";
import type { PhotoEntity } from "@iwai/shared";
import { apiClient } from "../services/api";
import { optimizeImageForUpload } from "../services/imageOptimizer";
import { useGuestSession } from "./GuestSessionContext";

export type UploadStatus =
  | "queued"
  | "compressing"
  | "requesting_url"
  | "uploading"
  | "confirming"
  | "completed"
  | "failed";

export interface QueueItem {
  id: string;
  localUri: string;
  caption?: string;
  status: UploadStatus;
  progress: number; // 0 to 100
  errorMessage?: string;
  createdPhoto?: PhotoEntity;
  createdAt: number;
}

export interface UploadQueueContextType {
  queue: QueueItem[];
  isUploading: boolean;
  enqueuePhoto: (localUri: string, caption?: string) => Promise<string>;
  retryUpload: (queueId: string) => Promise<void>;
  dismissItem: (queueId: string) => void;
  clearCompleted: () => void;
}

const UploadQueueContext = createContext<UploadQueueContextType | null>(null);

export const UploadQueueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useGuestSession();
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const updateItem = useCallback((id: string, updates: Partial<QueueItem>) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }, []);

  const processUpload = useCallback(
    async (item: QueueItem) => {
      if (!session?.event?.id) {
        updateItem(item.id, {
          status: "failed",
          errorMessage: "No active event session found.",
        });
        return;
      }

      const eventId = session.event.id;

      try {
        // Step 1: Compress & optimize image
        updateItem(item.id, { status: "compressing", progress: 15 });
        const optimized = await optimizeImageForUpload(item.localUri);

        // Step 2: Request signed upload URL from API
        updateItem(item.id, { status: "requesting_url", progress: 35 });
        const urlResponse = await apiClient.photos.requestUploadUrl(eventId, {
          filename: optimized.filename,
          mimeType: optimized.mimeType,
          fileSizeBytes: optimized.fileSizeBytes,
          takenAt: new Date(item.createdAt).toISOString(),
        });

        const { photoId, uploadUrl, storageKey } = urlResponse.data;

        // Step 3: Binary PUT upload to storage
        updateItem(item.id, { status: "uploading", progress: 60 });

        const fullUploadUrl = uploadUrl.startsWith("http")
          ? uploadUrl
          : `${apiClient.getBaseUrl()}${uploadUrl.startsWith("/") ? "" : "/"}${uploadUrl}`;

        const uploadResult = await FileSystem.uploadAsync(
          fullUploadUrl,
          optimized.uri,
          {
            httpMethod: "PUT",
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            headers: {
              "Content-Type": "image/jpeg",
            },
          },
        );

        if (uploadResult.status < 200 || uploadResult.status >= 300) {
          throw new Error(
            `Storage upload failed with HTTP status ${uploadResult.status}`,
          );
        }

        // Step 4: Confirm upload to backend
        updateItem(item.id, { status: "confirming", progress: 90 });
        const confirmResponse = await apiClient.photos.confirmUpload(eventId, {
          photoId,
          storageKey,
          width: optimized.width,
          height: optimized.height,
          caption: item.caption,
        });

        updateItem(item.id, {
          status: "completed",
          progress: 100,
          createdPhoto: confirmResponse.data,
        });
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Upload failed due to network or server issue.";
        console.error("Upload failed for item", item.id, err);
        updateItem(item.id, {
          status: "failed",
          errorMessage: errorMsg,
        });
      }
    },
    [session, updateItem],
  );

  const enqueuePhoto = useCallback(
    async (localUri: string, caption?: string): Promise<string> => {
      const newItem: QueueItem = {
        id: `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        localUri,
        caption,
        status: "queued",
        progress: 0,
        createdAt: Date.now(),
      };

      setQueue((prev) => [newItem, ...prev]);

      // Trigger background upload
      setTimeout(() => {
        processUpload(newItem);
      }, 50);

      return newItem.id;
    },
    [processUpload],
  );

  const retryUpload = useCallback(
    async (queueId: string) => {
      const item = queue.find((q) => q.id === queueId);
      if (!item) return;

      updateItem(queueId, { status: "queued", errorMessage: undefined, progress: 0 });
      processUpload(item);
    },
    [queue, updateItem, processUpload],
  );

  const dismissItem = useCallback((queueId: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== queueId));
  }, []);

  const clearCompleted = useCallback(() => {
    setQueue((prev) => prev.filter((item) => item.status !== "completed"));
  }, []);

  const isUploading = queue.some((item) =>
    ["queued", "compressing", "requesting_url", "uploading", "confirming"].includes(
      item.status,
    ),
  );

  return (
    <UploadQueueContext.Provider
      value={{
        queue,
        isUploading,
        enqueuePhoto,
        retryUpload,
        dismissItem,
        clearCompleted,
      }}
    >
      {children}
    </UploadQueueContext.Provider>
  );
};

export function useUploadQueue(): UploadQueueContextType {
  const context = useContext(UploadQueueContext);
  if (!context) {
    throw new Error("useUploadQueue must be used within an UploadQueueProvider");
  }
  return context;
}
