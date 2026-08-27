import type { TextStyle } from "react-native";

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.3,
  } as TextStyle,
  h3: {
    fontSize: 20,
    fontWeight: "600",
  } as TextStyle,
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
  } as TextStyle,
  bodyBold: {
    fontSize: 16,
    fontWeight: "600",
  } as TextStyle,
  subtext: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: "500",
  } as TextStyle,
  button: {
    fontSize: 16,
    fontWeight: "600",
  } as TextStyle,
} as const;
