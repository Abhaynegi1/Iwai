import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Sparkles } from "lucide-react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";
import { Button } from "./Button";
import { Input } from "./Input";

export interface NicknamePromptModalProps {
  visible: boolean;
  initialNickname?: string;
  onSave: (nickname: string) => void;
}

export const NicknamePromptModal: React.FC<NicknamePromptModalProps> = ({
  visible,
  initialNickname = "",
  onSave,
}) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState("");

  const handleContinue = () => {
    const clean = nickname.trim();
    if (!clean) {
      setError("Please enter a nickname or name to continue");
      return;
    }
    setError("");
    onSave(clean);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.card}>
          {/* Top Brand Sparkle Badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.iconCircle}>
              <Sparkles size={22} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.title}>Welcome to Iwai</Text>
          <Text style={styles.subtitle}>
            What should everyone at the celebration call you?
          </Text>

          <Input
            placeholder="e.g. Abhay, Maya, Kabir"
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              if (error) setError("");
            }}
            error={error}
            maxLength={40}
            autoFocus
            containerStyle={styles.inputContainer}
          />

          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(18, 60, 53, 0.65)", // Forest backdrop blur feel
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radius.container,
    padding: 26,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    alignItems: "center",
  },
  badgeContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    ...typography.subtext,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  submitBtn: {
    width: "100%",
  },
});
