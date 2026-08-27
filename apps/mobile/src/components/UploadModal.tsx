import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Upload, X } from "lucide-react-native";
import { useUploadQueue } from "../context/UploadQueueContext";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";
import { Button } from "./Button";

export interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  eventName?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  visible,
  onClose,
  eventName = "Shared Event",
}) => {
  const { enqueuePhoto } = useUploadQueue();
  const [selectedUris, setSelectedUris] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickPhotos = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.88,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUris = result.assets.map((a) => a.uri);
        setSelectedUris((prev) => [...prev, ...newUris]);
      }
    } catch (err) {
      console.error("Failed to pick photos:", err);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadAll = async () => {
    if (selectedUris.length === 0) return;
    setIsUploading(true);

    try {
      for (const uri of selectedUris) {
        await enqueuePhoto(uri);
      }
      setSelectedUris([]);
      onClose();
    } catch (err) {
      console.error("Failed to queue uploads:", err);
      Alert.alert("Upload Error", "Could not queue all photos.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Upload Photos</Text>
              <Text style={styles.headerSubtitle}>{eventName}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Dropzone */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.dropzone}
            onPress={handlePickPhotos}
          >
            <View style={styles.dropzoneIconCircle}>
              <Upload size={24} color={colors.secondary} />
            </View>
            <Text style={styles.dropzoneTitle}>Tap to upload</Text>
            <Text style={styles.dropzoneSubtitle}>Choose photos from your gallery</Text>
          </TouchableOpacity>

          {/* Selected photos preview */}
          {selectedUris.length > 0 ? (
            <View style={styles.previewSection}>
              <View style={styles.previewHeader}>
                <Text style={styles.selectedCount}>
                  {selectedUris.length} {selectedUris.length === 1 ? "photo" : "photos"} selected
                </Text>
                <TouchableOpacity onPress={handlePickPhotos} activeOpacity={0.7}>
                  <Text style={styles.addMoreText}>+ Add More</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.thumbGrid}>
                {selectedUris.map((uri, idx) => (
                  <View key={idx} style={styles.thumbWrapper}>
                    <Image source={{ uri }} style={styles.thumbImage} resizeMode="cover" />
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => handleRemovePhoto(idx)}
                      activeOpacity={0.8}
                    >
                      <X size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Button
                title={isUploading ? "Queueing Uploads..." : `Upload ${selectedUris.length} ${selectedUris.length === 1 ? "Photo" : "Photos"}`}
                onPress={handleUploadAll}
                loading={isUploading}
                size="lg"
                style={styles.uploadBtn}
              />
            </View>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.subtext,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dropzone: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  dropzoneIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  dropzoneTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dropzoneSubtitle: {
    ...typography.subtext,
    color: colors.textSecondary,
  },
  previewSection: {
    marginTop: 8,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  selectedCount: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  addMoreText: {
    ...typography.subtext,
    color: colors.secondary,
    fontWeight: "600",
  },
  thumbGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  thumbWrapper: {
    width: 72,
    height: 72,
    borderRadius: radius.control,
    overflow: "hidden",
    position: "relative",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(15, 23, 32, 0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtn: {
    width: "100%",
  },
});
