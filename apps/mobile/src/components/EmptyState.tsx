import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Camera } from "lucide-react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { Button } from "./Button";

export interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No events yet",
  subtitle = "Your memories are waiting.",
  description = "Create your first event or join one with a code to start collecting moments together.",
  actionTitle = "+ Create Event",
  onAction,
  icon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        {icon || <Camera size={32} color={colors.primary} />}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          style={styles.actionBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginVertical: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    ...typography.bodyBold,
    color: colors.secondary,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    maxWidth: 280,
  },
  actionBtn: {
    paddingHorizontal: 28,
  },
});
