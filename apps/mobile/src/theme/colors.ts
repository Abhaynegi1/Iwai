/**
 * Iwai Design System - Color Tokens
 *
 * Visual distribution:
 * 70% Warm White / Ivory (#F7F7F5, #FFFDF8)
 * 20% Deep Forest (#123C35)
 * 7%  Emerald (#1E7A67)
 * 3%  Mint / Apricot (#43D399, #FFB86C)
 */
export const colors = {
  // Primary & Secondary Brand
  primary: "#123C35", // Deep Forest
  primaryHover: "#0D2E28",
  primaryLight: "rgba(18, 60, 53, 0.08)",
  primaryLighter: "rgba(18, 60, 53, 0.04)",

  secondary: "#1E7A67", // Emerald
  secondaryHover: "#186354",
  secondaryLight: "rgba(30, 122, 103, 0.12)",

  // Accents
  accentMint: "#43D399", // Mint
  accentMintLight: "rgba(67, 211, 153, 0.18)",
  accentApricot: "#FFB86C", // Apricot
  accentApricotLight: "rgba(255, 184, 108, 0.18)",
  accentPink: "#E05353",
  accentPinkLight: "rgba(224, 83, 83, 0.12)",

  // Backgrounds & Surfaces
  background: "#F7F7F5", // Warm White
  backgroundSecondary: "#EFEFEA",
  surface: "#FFFDF8", // Ivory
  surfaceWarm: "#F4F3EE",
  surfaceElevated: "#FFFFFF",
  card: "#FFFDF8",
  cardHover: "#F9F6EE",
  modalOverlay: "rgba(15, 23, 32, 0.65)",

  // Dark Theme / Join Hero / Night Mode
  darkBackground: "#123C35",
  darkSurface: "#0E302A",
  darkCard: "rgba(255, 253, 248, 0.08)",
  darkBorder: "rgba(255, 253, 248, 0.14)",

  // Typography / Foregrounds
  textPrimary: "#0F1720", // Ink
  textSecondary: "#68736F", // Slate
  textMuted: "#9BA3A0",
  textDisabled: "#B8BFBC",
  textInverse: "#FFFDF8", // Ivory text for dark backgrounds

  // Borders & Dividers
  border: "#E5E7E2",
  borderLight: "rgba(15, 23, 32, 0.06)",
  borderActive: "#123C35",
  borderDark: "rgba(255, 255, 255, 0.18)",

  // Feedback
  error: "#E05353",
  success: "#1E7A67",
  warning: "#FFB86C",
  info: "#1E7A67",
} as const;

export type Colors = typeof colors;
