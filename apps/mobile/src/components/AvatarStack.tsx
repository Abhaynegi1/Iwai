import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { Avatar } from "./Avatar";

export interface AvatarStackProps {
  attendees?: Array<{ id: string; nickname: string; avatarUrl?: string | null }>;
  totalCount?: number;
  maxVisible?: number;
  avatarSize?: number;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  attendees = [],
  totalCount,
  maxVisible = 3,
  avatarSize = 24,
}) => {
  const visibleAttendees = attendees.slice(0, maxVisible);
  const remainingCount = totalCount !== undefined
    ? Math.max(0, totalCount - visibleAttendees.length)
    : Math.max(0, attendees.length - maxVisible);

  return (
    <View style={styles.container}>
      {visibleAttendees.map((att, idx) => (
        <View
          key={att.id || idx}
          style={[
            styles.avatarWrapper,
            idx > 0 && { marginLeft: -avatarSize * 0.35 },
          ]}
        >
          <Avatar
            name={att.nickname}
            uri={att.avatarUrl}
            size={avatarSize}
          />
        </View>
      ))}

      {remainingCount > 0 && (
        <Text style={styles.countText}>+{remainingCount}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    zIndex: 1,
  },
  countText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: "600",
  },
});
