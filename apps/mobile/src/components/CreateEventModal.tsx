import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Calendar, Camera, X } from "lucide-react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";
import { Button } from "./Button";
import { Input } from "./Input";

export interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onEventCreated: (event: { name: string; date: string; coverUri?: string | null }) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  visible,
  onClose,
  onEventCreated,
}) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("24 Aug 2026");
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickCover = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setCoverUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Failed to pick cover photo:", err);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Event Name Required", "Please give your event a name.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onEventCreated({
        name: name.trim(),
        date: date.trim() || "Today",
        coverUri,
      });
      setIsSubmitting(false);
      setName("");
      setCoverUri(null);
      onClose();
    }, 600);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Event</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="What's the event called?"
              placeholder="e.g. Rhea & Arjun Wedding"
              value={name}
              onChangeText={setName}
            />

            <Input
              label="When is it?"
              placeholder="e.g. 24 Aug 2026"
              value={date}
              onChangeText={setDate}
              leftIcon={<Calendar size={18} color={colors.textSecondary} />}
            />

            {/* Cover photo dropzone */}
            <Text style={styles.fieldLabel}>Add a cover photo</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.coverDropzone}
              onPress={handlePickCover}
            >
              {coverUri ? (
                <Image
                  source={{ uri: coverUri }}
                  style={styles.coverPreview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.dropzoneContent}>
                  <View style={styles.dropzoneIconCircle}>
                    <Camera size={22} color={colors.primary} />
                  </View>
                  <Text style={styles.dropzoneText}>+ Add Photo</Text>
                  <Text style={styles.dropzoneSubtext}>
                    Choose an atmospheric photo for the header
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <Button
              title="Create Event"
              onPress={handleCreate}
              loading={isSubmitting}
              size="lg"
              style={styles.submitBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    gap: 8,
  },
  fieldLabel: {
    ...typography.subtext,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  coverDropzone: {
    height: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  coverPreview: {
    width: "100%",
    height: "100%",
  },
  dropzoneContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  dropzoneIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  dropzoneText: {
    ...typography.bodyBold,
    color: colors.primary,
    marginBottom: 2,
  },
  dropzoneSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  submitBtn: {
    marginTop: 8,
  },
});
