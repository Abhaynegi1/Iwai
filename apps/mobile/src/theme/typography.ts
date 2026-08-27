import type { TextStyle } from "react-native";

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.8,
    lineHeight: 38,
  } as TextStyle,
  h2: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
    lineHeight: 30,
  } as TextStyle,
  h3: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.3,
    lineHeight: 26,
  } as TextStyle,
  h4: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
    lineHeight: 22,
  } as TextStyle,
  body: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
  } as TextStyle,
  bodyBold: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  } as TextStyle,
  subtext: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  } as TextStyle,
  button: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  } as TextStyle,
} as const;

export type Typography = typeof typography;
