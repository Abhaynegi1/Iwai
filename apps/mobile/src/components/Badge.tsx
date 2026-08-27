import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";

export interface BadgeProps {
  label: string;
  variant?: "forest" | "emerald" | "mint" | "apricot" | "neutral" | "dark";
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "neutral",
  dot = false,
  style,
}) => {
  const getVariantContainerStyle = (): ViewStyle => {
    switch (variant) {
      case "forest":
        return { backgroundColor: colors.primaryLight };
      case "emerald":
        return { backgroundColor: colors.secondaryLight };
      case "mint":
        return { backgroundColor: colors.accentMintLight };
      case "apricot":
        return { backgroundColor: colors.accentApricotLight };
      case "dark":
        return { backgroundColor: "rgba(255, 255, 255, 0.14)" };
      default:
        return { backgroundColor: "rgba(15, 23, 32, 0.05)" };
    }
  };

  const getDotColor = (): string => {
    switch (variant) {
      case "forest":
        return colors.primary;
      case "emerald":
        return colors.secondary;
      case "mint":
        return colors.accentMint;
      case "apricot":
        return colors.accentApricot;
      case "dark":
        return colors.accentMint;
      default:
        return colors.textSecondary;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case "forest":
        return { color: colors.primary };
      case "emerald":
        return { color: colors.secondary };
      case "mint":
        return { color: colors.secondary };
      case "apricot":
        return { color: "#B86A00" };
      case "dark":
        return { color: colors.surface };
      default:
        return { color: colors.textSecondary };
    }
  };

  return (
    <View style={[styles.base, getVariantContainerStyle(), style]}>
      {dot && <View style={[styles.dot, { backgroundColor: getDotColor() }]} />}
      <Text style={[styles.text, getTextStyle()]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    ...typography.caption,
    fontWeight: "600",
  },
});
