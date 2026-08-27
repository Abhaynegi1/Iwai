import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AlertCircle, CheckCircle2, RefreshCw, X } from "lucide-react-native";
import { useUploadQueue } from "../context/UploadQueueContext";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export const UploadBanner: React.FC = () => {
  const { queue, retryUpload, dismissItem, clearCompleted } =
    useUploadQueue();

  if (queue.length === 0) {
    return null;
  }

  const activeUpload = queue.find((item) =>
    ["queued", "compressing", "requesting_url", "uploading", "confirming"].includes(
      item.status,
    ),
  );

  const failedUpload = queue.find((item) => item.status === "failed");
  const completedCount = queue.filter((item) => item.status === "completed").length;

  if (failedUpload) {
    return (
      <View style={[styles.banner, styles.bannerFailed]}>
        <AlertCircle size={20} color={colors.accentPink} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.titleFailed}>Upload failed</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {failedUpload.errorMessage || "Tap retry to attempt upload again."}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => retryUpload(failedUpload.id)}
          activeOpacity={0.7}
        >
          <RefreshCw size={16} color="#fff" />
          <Text style={styles.actionBtnText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => dismissItem(failedUpload.id)}
          activeOpacity={0.7}
        >
          <X size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    );
  }

  if (activeUpload) {
    const getStatusText = () => {
      switch (activeUpload.status) {
        case "compressing":
          return "Optimizing photo...";
        case "requesting_url":
          return "Preparing upload...";
        case "uploading":
          return "Uploading to gallery...";
        case "confirming":
          return "Finishing up...";
        default:
          return "Queued for upload...";
      }
    };

    return (
      <View style={[styles.banner, styles.bannerActive]}>
        <ActivityIndicator size="small" color={colors.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{getStatusText()}</Text>
          <Text style={styles.subtitle}>
            {queue.length > 1 ? `${queue.length} items in queue` : "Please keep app open"}
          </Text>
        </View>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>{activeUpload.progress}%</Text>
        </View>
      </View>
    );
  }

  if (completedCount > 0) {
    return (
      <View style={[styles.banner, styles.bannerSuccess]}>
        <CheckCircle2 size={20} color={colors.accentGreen} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.titleSuccess}>
            {completedCount === 1 ? "1 photo added to gallery!" : `${completedCount} photos added!`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={clearCompleted}
          activeOpacity={0.7}
        >
          <X size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bannerActive: {
    backgroundColor: "#1e1b4b",
    borderWidth: 1,
    borderColor: colors.borderActive,
  },
  bannerFailed: {
    backgroundColor: "rgba(244, 63, 94, 0.15)",
    borderWidth: 1,
    borderColor: colors.accentPink,
  },
  bannerSuccess: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    borderWidth: 1,
    borderColor: colors.accentGreen,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.subtext,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  titleFailed: {
    ...typography.subtext,
    color: colors.accentPink,
    fontWeight: "600",
  },
  titleSuccess: {
    ...typography.subtext,
    color: colors.accentGreen,
    fontWeight: "600",
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  progressPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accentPink,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    marginRight: 6,
  },
  actionBtnText: {
    ...typography.caption,
    color: "#fff",
    fontWeight: "700",
  },
  closeBtn: {
    padding: 6,
  },
});
