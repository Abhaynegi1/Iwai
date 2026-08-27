import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Camera,
  FolderHeart,
  Home,
  Upload,
  User,
} from "lucide-react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export type NavTab = "home" | "events" | "uploads" | "profile";

export interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onCameraPress: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onCameraPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {/* Home */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabChange("home")}
          activeOpacity={0.7}
        >
          <Home
            size={22}
            color={activeTab === "home" ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "home" && styles.tabLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Events */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabChange("events")}
          activeOpacity={0.7}
        >
          <FolderHeart
            size={22}
            color={activeTab === "events" ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "events" && styles.tabLabelActive,
            ]}
          >
            Events
          </Text>
        </TouchableOpacity>

        {/* Center Camera Shutter */}
        <TouchableOpacity
          style={styles.centerShutterBtn}
          onPress={onCameraPress}
          activeOpacity={0.88}
        >
          <View style={styles.shutterInner}>
            <Camera size={24} color={colors.surface} />
          </View>
        </TouchableOpacity>

        {/* Uploads */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabChange("uploads")}
          activeOpacity={0.7}
        >
          <Upload
            size={22}
            color={activeTab === "uploads" ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "uploads" && styles.tabLabelActive,
            ]}
          >
            Uploads
          </Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabChange("profile")}
          activeOpacity={0.7}
        >
          <User
            size={22}
            color={activeTab === "profile" ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "profile" && styles.tabLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 24,
    paddingTop: 8,
    shadowColor: "#0F1720",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 12,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    minWidth: 54,
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  centerShutterBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary, // Deep Forest
    alignItems: "center",
    justifyContent: "center",
    marginTop: -16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shutterInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
});
