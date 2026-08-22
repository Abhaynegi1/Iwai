import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ─── Global prefix ───────────────────────────────────────────────────────
  app.setGlobalPrefix("api");

  // ─── URI versioning ──────────────────────────────────────────────────────
  // Routes will be at /api/v1/...
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  // ─── Global validation pipe ──────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── CORS ────────────────────────────────────────────────────────────────
  const corsOrigin = process.env["CORS_ORIGIN"] ?? "http://localhost:3000";
  app.enableCors({
    origin: corsOrigin.split(",").map((o) => o.trim()),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  // ─── Listen ──────────────────────────────────────────────────────────────
  const port = parseInt(process.env["PORT"] ?? "3001", 10);
  await app.listen(port);

  console.log(`\n🚀 IWAI API running at http://localhost:${port}/api/v1`);
  console.log(`   Health: http://localhost:${port}/api/v1/health\n`);
}

bootstrap().catch((err: unknown) => {
  console.error("Fatal error during bootstrap:", err);
  process.exit(1);
});
