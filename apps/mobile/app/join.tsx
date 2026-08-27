import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ArrowLeft, Camera, QrCode, Sparkles } from "lucide-react-native";
import { Button } from "../src/components/Button";
import { Input } from "../src/components/Input";
import { useGuestSession } from "../src/context/GuestSessionContext";
import { colors } from "../src/theme/colors";
import { typography } from "../src/theme/typography";

export default function JoinEventScreen() {
  const router = useRouter();
  const { joinEvent } = useGuestSession();

  const [eventCode, setEventCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isScanningQR, setIsScanningQR] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const handleJoin = async (targetCode = eventCode, targetNick = nickname) => {
    const cleanCode = targetCode.trim().toUpperCase();
    const cleanNick = targetNick.trim();

    if (!cleanCode || cleanCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-character event code.");
      return;
    }

    if (!cleanNick) {
      setErrorMessage("Please enter a display nickname.");
      return;
    }

    setErrorMessage("");
    setIsJoining(true);

    try {
      await joinEvent({
        eventCode: cleanCode,
        nickname: cleanNick,
      });

      router.replace("/");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to join event. Please check code.";
      setErrorMessage(msg);
    } finally {
      setIsJoining(false);
    }
  };

  const handleStartQRScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please grant camera access in your device settings to scan QR codes.",
        );
        return;
      }
    }
    setIsScanningQR(true);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setIsScanningQR(false);

    // Extract event code from URL if it's a URL (e.g. iwai.app/join/ABC123 or https://.../join/ABC123)
    let extractedCode = data.trim().toUpperCase();
    const match = data.match(/\/join\/([A-Za-z0-9]{6})/i);
    if (match && match[1]) {
      extractedCode = match[1].toUpperCase();
    }

    if (extractedCode.length === 6) {
      setEventCode(extractedCode);
      if (nickname.trim()) {
        handleJoin(extractedCode, nickname);
      } else {
        Alert.alert(
          "Event Code Found!",
          `Code: ${extractedCode}. Please enter your nickname to complete joining.`,
        );
      }
    } else {
      Alert.alert("Invalid QR Code", "The scanned QR code is not a valid IWAI event link.");
    }
  };

  if (isScanningQR) {
    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        />

        {/* Overlay frame */}
        <View style={styles.scannerOverlay}>
          <TouchableOpacity
            style={styles.closeScanBtn}
            onPress={() => setIsScanningQR(false)}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.scanTargetFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <Text style={styles.scanHintText}>Point camera at the Event QR Code</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Event</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Sparkles size={16} color={colors.accentGreen} />
            <Text style={styles.badgeText}>Instant Guest Access</Text>
          </View>
        </View>

        <Text style={styles.title}>Enter Event Details</Text>
        <Text style={styles.subtitle}>
          {"No account or password needed. Simply enter the 6-character code or scan the organizer's QR code."}
        </Text>

        {/* QR Scan Button */}
        <TouchableOpacity
          style={styles.qrCard}
          onPress={handleStartQRScan}
          activeOpacity={0.8}
        >
          <View style={styles.qrIconWrapper}>
            <QrCode size={28} color={colors.primary} />
          </View>
          <View style={styles.qrTextWrapper}>
            <Text style={styles.qrCardTitle}>Scan Event QR Code</Text>
            <Text style={styles.qrCardSubtitle}>Scan with camera for instant join</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR ENTER MANUALLY</Text>
          <View style={styles.divider} />
        </View>

        {/* Form Inputs */}
        <Input
          label="6-Character Event Code"
          placeholder="e.g. WED202"
          value={eventCode}
          onChangeText={(text) => setEventCode(text.toUpperCase())}
          autoCapitalize="characters"
          maxLength={6}
          leftIcon={<Sparkles size={18} color={colors.textSecondary} />}
        />

        <Input
          label="Your Nickname"
          placeholder="e.g. Alex M."
          value={nickname}
          onChangeText={setNickname}
          maxLength={40}
          leftIcon={<Camera size={18} color={colors.textSecondary} />}
        />

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Submit Button */}
        <Button
          title={isJoining ? "Joining..." : "Join Event & View Gallery"}
          onPress={() => handleJoin()}
          loading={isJoining}
          size="lg"
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 54,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  badgeContainer: {
    alignItems: "flex-start",
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentGreenLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    ...typography.caption,
    color: colors.accentGreen,
    fontWeight: "700",
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  qrCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderActive,
    marginBottom: 20,
  },
  qrIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  qrTextWrapper: {
    flex: 1,
  },
  qrCardTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  qrCardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: 12,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: colors.accentPinkLight,
    borderWidth: 1,
    borderColor: colors.accentPink,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorBoxText: {
    ...typography.subtext,
    color: colors.accentPink,
    fontWeight: "500",
  },
  submitBtn: {
    marginTop: 8,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 60,
  },
  closeScanBtn: {
    alignSelf: "flex-start",
    marginLeft: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanTargetFrame: {
    width: 260,
    height: 260,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scanHintText: {
    ...typography.bodyBold,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
});
