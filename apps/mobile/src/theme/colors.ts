export const colors = {
  // Backgrounds
  background: "#0f0d23",
  backgroundSecondary: "#171438",
  card: "rgba(255, 255, 255, 0.06)",
  cardHover: "rgba(255, 255, 255, 0.10)",
  cardSolid: "#1f1b4b",
  modalOverlay: "rgba(0, 0, 0, 0.85)",

  // Brand / Primaries
  primary: "#5a5af7",
  primaryHover: "#4949e0",
  primaryLight: "rgba(90, 90, 247, 0.15)",

  // Accents
  accentGreen: "#34d399",
  accentGreenLight: "rgba(52, 211, 153, 0.15)",
  accentPink: "#f43f5e",
  accentPinkLight: "rgba(244, 63, 94, 0.15)",
  accentAmber: "#f59e0b",
  accentAmberLight: "rgba(245, 158, 11, 0.15)",

  // Typography / Foregrounds
  textPrimary: "#ffffff",
  textSecondary: "#a5b4fc",
  textMuted: "#6366f1",
  textDisabled: "#4b5563",

  // Borders & Dividers
  border: "rgba(255, 255, 255, 0.12)",
  borderLight: "rgba(255, 255, 255, 0.06)",
  borderActive: "#5a5af7",

  // Feedback
  error: "#ef4444",
  success: "#10b981",
  warning: "#f59e0b",
  info: "#3b82f6",
} as const;

export type Colors = typeof colors;
