import { NestFactory } from "@nestjs/core";
import { GlobalExceptionFilter, TransformInterceptor } from "./common";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ─── Global prefix ───────────────────────────────────────────────────────
  app.setGlobalPrefix("api");

  // ─── Global filters & interceptors ───────────────────────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // ─── CORS ────────────────────────────────────────────────────────────────
  const corsOrigin = process.env["CORS_ORIGIN"] ?? "http://localhost:3000";
  app.enableCors({
    origin: corsOrigin.split(",").map((o) => o.trim()),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "x-guest-token",
      "x-event-id",
    ],
  });

  // ─── Listen ──────────────────────────────────────────────────────────────
  const port = parseInt(process.env["PORT"] ?? "3001", 10);
  await app.listen(port);

  console.log(`\n🚀 IWAI API running at http://localhost:${port}/api`);
  console.log(`   Health: http://localhost:${port}/api/health\n`);
}

bootstrap().catch((err: unknown) => {
  console.error("Fatal error during bootstrap:", err);
  process.exit(1);
});
