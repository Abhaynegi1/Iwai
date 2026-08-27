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
import { typography } from "../theme/typography";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost";
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
        base.push(styles.textWhite);
        break;
      case "secondary":
        base.push(styles.textSecondary);
        break;
      case "outline":
      case "ghost":
        base.push(styles.textPrimaryBrand);
        break;
    }

    if (disabled) {
      base.push(styles.textDisabled);
    }

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "secondary" || variant === "outline" ? colors.primary : "#fff"}
        />
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
    borderRadius: 14,
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
    paddingVertical: 14,
    minHeight: 48,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.card,
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
  disabled: {
    opacity: 0.5,
  },
  // Text sizes
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  // Text colors
  textWhite: {
    color: "#ffffff",
  },
  textSecondary: {
    color: colors.textSecondary,
  },
  textPrimaryBrand: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.textDisabled,
  },
});
