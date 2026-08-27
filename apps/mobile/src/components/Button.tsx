import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type {
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost" | "dark";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
}) => {
  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const base: ViewStyle[] = [styles.base, styles[size]];

    switch (variant) {
      case "primary":
        base.push(styles.primary);
        break;
      case "secondary":
        base.push(styles.secondary);
        break;
      case "danger":
        base.push(styles.danger);
        break;
      case "outline":
        base.push(styles.outline);
        break;
      case "ghost":
        base.push(styles.ghost);
        break;
      case "dark":
        base.push(styles.dark);
        break;
    }

    if (disabled || loading) {
      base.push(styles.disabled);
    }

    return base;
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const base: TextStyle[] = [typography.button, styles[`text_${size}` as keyof typeof styles]];

    switch (variant) {
      case "primary":
      case "danger":
      case "dark":
        base.push(styles.textLight);
        break;
      case "secondary":
      case "outline":
      case "ghost":
        base.push(styles.textDark);
        break;
    }

    if (disabled) {
      base.push(styles.textDisabled);
    }

    return base;
  };

  const getSpinnerColor = () => {
    if (variant === "secondary" || variant === "outline" || variant === "ghost") {
      return colors.primary;
    }
    return colors.surface;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getSpinnerColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === "left" && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === "right" && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  // Sizes
  sm: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 52,
  },
  // Variants
  primary: {
    backgroundColor: colors.primary, // Deep Forest #123C35
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface, // Ivory #FFFDF8
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.accentPink,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  dark: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  disabled: {
    opacity: 0.5,
  },
  // Text sizes
  text_sm: {
    fontSize: 13,
  },
  text_md: {
    fontSize: 15,
  },
  text_lg: {
    fontSize: 16,
  },
  // Text colors
  textLight: {
    color: colors.surface, // Ivory text
  },
  textDark: {
    color: colors.textPrimary, // Ink text
  },
  textDisabled: {
    color: colors.textDisabled,
  },
});
