import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";

export interface EventCodeInputProps {
  value: string;
  onChangeText: (code: string) => void;
  length?: number;
  dark?: boolean;
}

export const EventCodeInput: React.FC<EventCodeInputProps> = ({
  value,
  onChangeText,
  length = 6,
  dark = false,
}) => {
  const inputRef = useRef<TextInput>(null);

  const cleanValue = value.toUpperCase().slice(0, length);
  const chars = cleanValue.split("");

  const handleBoxPress = () => {
    inputRef.current?.focus();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleBoxPress}
      style={styles.container}
    >
      {/* Hidden real input */}
      <TextInput
        ref={inputRef}
        value={cleanValue}
        onChangeText={(text) => onChangeText(text.toUpperCase())}
        maxLength={length}
        autoCapitalize="characters"
        autoCorrect={false}
        style={styles.hiddenInput}
      />

      {/* Segmented Visual Boxes */}
      <View style={styles.boxesRow}>
        {Array.from({ length }).map((_, idx) => {
          const char = chars[idx] || "";
          const isFocused = idx === cleanValue.length;

          return (
            <View
              key={idx}
              style={[
                styles.box,
                dark ? styles.boxDark : styles.boxLight,
                isFocused && (dark ? styles.boxFocusedDark : styles.boxFocusedLight),
                Boolean(char) && (dark ? styles.boxFilledDark : styles.boxFilledLight),
              ]}
            >
              <Text
                style={[
                  styles.charText,
                  dark ? styles.charTextDark : styles.charTextLight,
                ]}
              >
                {char}
              </Text>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
  boxesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  box: {
    width: 44,
    height: 52,
    borderRadius: radius.button,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  boxLight: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  boxDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  boxFocusedLight: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  boxFocusedDark: {
    borderColor: colors.accentMint,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  boxFilledLight: {
    borderColor: colors.secondary,
  },
  boxFilledDark: {
    borderColor: colors.accentMint,
  },
  charText: {
    ...typography.h3,
    fontWeight: "700",
  },
  charTextLight: {
    color: colors.textPrimary,
  },
  charTextDark: {
    color: colors.surface,
  },
});
