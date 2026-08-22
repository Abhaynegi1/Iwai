import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  // Treat drizzle-orm and postgres as external (not bundled)
  external: ["drizzle-orm", "postgres"],
});
