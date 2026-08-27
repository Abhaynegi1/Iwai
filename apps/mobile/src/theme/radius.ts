export const radius = {
  xs: 6,
  control: 8, // Small controls
  button: 10, // Buttons
  card: 14, // Cards & image containers
  container: 18, // Large containers & sheets
  full: 9999, // Pill / Circle
} as const;

export type Radius = typeof radius;
