import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import type {
  CameraType,
  FlashMode,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  Camera as CameraIcon,
  Check,
  FlipHorizontal,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Zap,
  ZapOff,
} from "lucide-react-native";
import { useUploadQueue } from "../src/context/UploadQueueContext";
import { colors } from "../src/theme/colors";
import { typography } from "../src/theme/typography";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CameraScreen() {
  const router = useRouter();
  const { enqueuePhoto } = useUploadQueue();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  // Capture preview state
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isEnqueuing, setIsEnqueuing] = useState(false);

  const handleFlipCamera = () => {
    setFacing((current: CameraType) => (current === "back" ? "front" : "back"));
  };

  const handleToggleFlash = () => {
    setFlash((current: FlashMode) => (current === "off" ? "on" : "off"));
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isTakingPhoto) return;
    setIsTakingPhoto(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
      });

      if (photo?.uri) {
        setPreviewUri(photo.uri);
      }
    } catch (err) {
      console.error("Failed to take picture:", err);
      Alert.alert("Camera Error", "Could not capture photo. Please try again.");
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setPreviewUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Failed to pick image from gallery:", err);
      Alert.alert("Gallery Error", "Could not select image from gallery.");
    }
  };

  const handleSharePhoto = async () => {
    if (!previewUri || isEnqueuing) return;
    setIsEnqueuing(true);

    try {
      await enqueuePhoto(previewUri, caption.trim() || undefined);
      router.back();
    } catch (err) {
      console.error("Failed to enqueue photo:", err);
      Alert.alert("Upload Error", "Could not queue photo for upload.");
    } finally {
      setIsEnqueuing(false);
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
    setCaption("");
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <CameraIcon size={48} color={colors.primary} style={{ marginBottom: 16 }} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSubtitle}>
          IWAI needs permission to use your camera so you can snap and share photos directly into the shared event gallery.
        </Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.permissionBtnText}>Grant Camera Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.permissionSecondaryBtn}
          onPress={handlePickFromGallery}
          activeOpacity={0.8}
        >
          <ImageIcon size={18} color="#fff" />
          <Text style={styles.permissionSecondaryBtnText}>Choose from Gallery instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Preview Mode
  if (previewUri) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: previewUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />

          {/* Top Bar */}
          <View style={styles.previewTopBar}>
            <TouchableOpacity
              style={styles.roundControlBtn}
              onPress={handleRetake}
              activeOpacity={0.7}
            >
              <RotateCcw size={22} color="#fff" />
            </TouchableOpacity>
            <View style={styles.previewBadge}>
              <Sparkles size={14} color={colors.accentGreen} />
              <Text style={styles.previewBadgeText}>Ready to Share</Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          {/* Bottom Action Sheet */}
          <View style={styles.previewBottomBar}>
            <View style={styles.captionInputWrapper}>
              <TextInput
                style={styles.captionInput}
                placeholder="Add an optional caption..."
                placeholderTextColor={colors.textSecondary}
                value={caption}
                onChangeText={setCaption}
                maxLength={200}
              />
            </View>

            <View style={styles.previewButtonRow}>
              <TouchableOpacity
                style={styles.retakeBtn}
                onPress={handleRetake}
                activeOpacity={0.8}
              >
                <RotateCcw size={18} color="#fff" />
                <Text style={styles.retakeBtnText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareBtn}
                onPress={handleSharePhoto}
                disabled={isEnqueuing}
                activeOpacity={0.8}
              >
                {isEnqueuing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Check size={18} color="#fff" />
                    <Text style={styles.shareBtnText}>Share to Gallery</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Live Camera Viewfinder
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        flash={flash}
      />

      {/* Top Controls Overlay */}
      <View style={styles.cameraTopBar}>
        <TouchableOpacity
          style={styles.roundControlBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roundControlBtn, flash === "on" && styles.flashBtnActive]}
          onPress={handleToggleFlash}
          activeOpacity={0.7}
        >
          {flash === "on" ? (
            <Zap size={22} color={colors.accentAmber} />
          ) : (
            <ZapOff size={22} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Shutter Controls */}
      <View style={styles.cameraBottomBar}>
        {/* Gallery roll picker button */}
        <TouchableOpacity
          style={styles.bottomSideBtn}
          onPress={handlePickFromGallery}
          activeOpacity={0.7}
        >
          <ImageIcon size={26} color="#fff" />
        </TouchableOpacity>

        {/* Shutter Button */}
        <TouchableOpacity
          style={styles.shutterOuterRing}
          onPress={handleTakePhoto}
          disabled={isTakingPhoto}
          activeOpacity={0.85}
        >
          <View style={styles.shutterInnerCircle} />
        </TouchableOpacity>

        {/* Flip camera button */}
        <TouchableOpacity
          style={styles.bottomSideBtn}
          onPress={handleFlipCamera}
          activeOpacity={0.7}
        >
          <FlipHorizontal size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  permissionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  permissionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  permissionBtnText: {
    ...typography.button,
    color: "#fff",
  },
  permissionSecondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    width: "100%",
  },
  permissionSecondaryBtnText: {
    ...typography.button,
    color: "#fff",
  },
  cameraTopBar: {
    position: "absolute",
    top: 54,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  roundControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  flashBtnActive: {
    backgroundColor: "rgba(245, 158, 11, 0.25)",
    borderWidth: 1,
    borderColor: colors.accentAmber,
  },
  cameraBottomBar: {
    position: "absolute",
    bottom: 44,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
    zIndex: 10,
  },
  bottomSideBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterOuterRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  shutterInnerCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#ffffff",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  previewTopBar: {
    paddingTop: 54,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  previewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  previewBadgeText: {
    ...typography.caption,
    color: colors.accentGreen,
    fontWeight: "700",
  },
  previewBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15, 13, 35, 0.88)",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  captionInputWrapper: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  captionInput: {
    color: "#fff",
    fontSize: 16,
  },
  previewButtonRow: {
    flexDirection: "row",
    gap: 12,
  },
  retakeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 14,
    borderRadius: 14,
  },
  retakeBtnText: {
    ...typography.button,
    color: "#fff",
  },
  shareBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
  },
  shareBtnText: {
    ...typography.button,
    color: "#fff",
  },
});
