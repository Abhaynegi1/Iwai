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
import { radius } from "../src/theme/radius";
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
        <View style={styles.permissionIconCircle}>
          <CameraIcon size={36} color={colors.primary} />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSubtitle}>
          Iwai needs permission to use your camera so you can capture and share memories directly with everyone.
        </Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
          activeOpacity={0.85}
        >
          <Text style={styles.permissionBtnText}>Grant Camera Access</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.permissionSecondaryBtn}
          onPress={handlePickFromGallery}
          activeOpacity={0.8}
        >
          <ImageIcon size={18} color={colors.textPrimary} />
          <Text style={styles.permissionSecondaryBtnText}>Choose from Gallery</Text>
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
              <RotateCcw size={20} color="#FFFDF8" />
            </TouchableOpacity>
            <View style={styles.previewBadge}>
              <Sparkles size={13} color={colors.accentMint} />
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
                <RotateCcw size={16} color="#FFFDF8" />
                <Text style={styles.retakeBtnText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareBtn}
                onPress={handleSharePhoto}
                disabled={isEnqueuing}
                activeOpacity={0.85}
              >
                {isEnqueuing ? (
                  <ActivityIndicator size="small" color="#FFFDF8" />
                ) : (
                  <>
                    <Check size={18} color="#FFFDF8" />
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
          <ArrowLeft size={22} color="#FFFDF8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roundControlBtn, flash === "on" && styles.flashBtnActive]}
          onPress={handleToggleFlash}
          activeOpacity={0.7}
        >
          {flash === "on" ? (
            <Zap size={20} color={colors.accentApricot} />
          ) : (
            <ZapOff size={20} color="#FFFDF8" />
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Shutter Controls */}
      <View style={styles.cameraBottomBar}>
        {/* Gallery roll picker */}
        <TouchableOpacity
          style={styles.bottomSideBtn}
          onPress={handlePickFromGallery}
          activeOpacity={0.7}
        >
          <ImageIcon size={24} color="#FFFDF8" />
        </TouchableOpacity>

        {/* Center Shutter Button */}
        <TouchableOpacity
          style={styles.shutterOuterRing}
          onPress={handleTakePhoto}
          disabled={isTakingPhoto}
          activeOpacity={0.85}
        >
          <View style={styles.shutterInnerCircle} />
        </TouchableOpacity>

        {/* Flip camera */}
        <TouchableOpacity
          style={styles.bottomSideBtn}
          onPress={handleFlipCamera}
          activeOpacity={0.7}
        >
          <FlipHorizontal size={24} color="#FFFDF8" />
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
  permissionIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  permissionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  permissionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: radius.button,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  permissionBtnText: {
    ...typography.button,
    color: colors.surface,
  },
  permissionSecondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: radius.button,
    width: "100%",
  },
  permissionSecondaryBtnText: {
    ...typography.button,
    color: colors.textPrimary,
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(15, 23, 32, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  flashBtnActive: {
    backgroundColor: "rgba(255, 184, 108, 0.3)",
    borderWidth: 1,
    borderColor: colors.accentApricot,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(15, 23, 32, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#FFFDF8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  shutterInnerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FFFDF8",
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
    backgroundColor: "rgba(15, 23, 32, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  previewBadgeText: {
    ...typography.caption,
    color: colors.accentMint,
    fontWeight: "700",
  },
  previewBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15, 23, 32, 0.88)",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  captionInputWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 14,
  },
  captionInput: {
    color: "#FFFDF8",
    fontSize: 15,
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
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 14,
    borderRadius: radius.button,
  },
  retakeBtnText: {
    ...typography.button,
    color: "#FFFDF8",
  },
  shareBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.button,
  },
  shareBtnText: {
    ...typography.button,
    color: "#FFFDF8",
  },
});
