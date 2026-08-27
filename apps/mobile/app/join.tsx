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
import { ArrowLeft, QrCode } from "lucide-react-native";
import { Button } from "../src/components/Button";
import { EventCodeInput } from "../src/components/EventCodeInput";
import { Input } from "../src/components/Input";
import { useGuestSession } from "../src/context/GuestSessionContext";
import { colors } from "../src/theme/colors";
import { radius } from "../src/theme/radius";
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
      setErrorMessage("Please enter a 6-character event code.");
      return;
    }

    if (!cleanNick) {
      setErrorMessage("Please enter your display nickname.");
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
        err instanceof Error ? err.message : "Failed to join event. Please check the code.";
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
          `Code: ${extractedCode}. Please enter your nickname to continue.`,
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

        {/* Scanner Overlay */}
        <View style={styles.scannerOverlay}>
          <TouchableOpacity
            style={styles.closeScanBtn}
            onPress={() => setIsScanningQR(false)}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={colors.surface} />
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
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={colors.surface} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Join Event</Text>
          <Text style={styles.subtitle}>
            Scan the QR code to join the event
          </Text>
        </View>

        {/* QR Code Affordance Box */}
        <TouchableOpacity
          style={styles.qrCard}
          onPress={handleStartQRScan}
          activeOpacity={0.88}
        >
          <View style={styles.qrScanFrame}>
            <View style={[styles.cornerMint, styles.topLeftMint]} />
            <View style={[styles.cornerMint, styles.topRightMint]} />
            <View style={[styles.cornerMint, styles.bottomLeftMint]} />
            <View style={[styles.cornerMint, styles.bottomRightMint]} />
            <QrCode size={110} color={colors.surface} strokeWidth={1.5} />
          </View>
          <Text style={styles.tapToScanText}>Tap to open camera scanner</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or enter event code</Text>
          <View style={styles.divider} />
        </View>

        {/* Segmented 6-box Event Code input */}
        <EventCodeInput
          value={eventCode}
          onChangeText={setEventCode}
          length={6}
          dark
        />

        {/* Nickname input */}
        <Input
          label="Your Nickname"
          placeholder="e.g. Abhay Negi"
          value={nickname}
          onChangeText={setNickname}
          maxLength={40}
          dark
          containerStyle={{ marginTop: 8 }}
        />

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Continue Button */}
        <Button
          title={isJoining ? "Joining..." : "Continue"}
          onPress={() => handleJoin()}
          loading={isJoining}
          size="lg"
          variant="secondary"
          style={styles.continueBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground, // Deep Forest #123C35
  },
  scrollContent: {
    padding: 24,
    paddingTop: 54,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    ...typography.h1,
    color: colors.surface, // Ivory
    fontSize: 28,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.body,
    color: "rgba(255, 253, 248, 0.7)",
    textAlign: "center",
  },
  qrCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: radius.container,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 28,
    marginBottom: 20,
  },
  qrScanFrame: {
    width: 150,
    height: 150,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  cornerMint: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: colors.accentMint,
  },
  topLeftMint: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRightMint: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeftMint: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRightMint: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  tapToScanText: {
    ...typography.caption,
    color: "rgba(255, 253, 248, 0.8)",
    marginTop: 14,
    fontWeight: "500",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  dividerText: {
    ...typography.caption,
    color: "rgba(255, 253, 248, 0.7)",
    paddingHorizontal: 12,
    fontWeight: "500",
  },
  errorBox: {
    backgroundColor: colors.accentPinkLight,
    borderWidth: 1,
    borderColor: colors.accentPink,
    padding: 12,
    borderRadius: radius.control,
    marginVertical: 10,
  },
  errorBoxText: {
    ...typography.caption,
    color: colors.accentPink,
    fontWeight: "600",
  },
  continueBtn: {
    marginTop: 14,
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
    borderColor: colors.accentMint,
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
