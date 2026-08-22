import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

type HealthStatus = "ok" | "degraded" | "down";

type HealthResponse = {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
};

/**
 * GET /api/v1/health
 *
 * Simple health check endpoint for:
 *   - Load balancer health probes
 *   - CI smoke tests
 *   - Uptime monitoring
 *
 * Returns 200 when the API process is running.
 * Future: extend to check database connectivity, cache, etc.
 */
@Controller("health")
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  check(): HealthResponse {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env["npm_package_version"] ?? "0.0.0",
      environment: process.env["NODE_ENV"] ?? "development",
    };
  }
}
