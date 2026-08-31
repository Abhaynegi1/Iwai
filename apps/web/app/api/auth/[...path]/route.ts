import type { NextRequest } from "next/server";
import { createNeonAuth } from "@neondatabase/auth/next/server";


let cachedHandler: ReturnType<ReturnType<typeof createNeonAuth>["handler"]> | null = null;

function getAuthHandler() {
  if (cachedHandler) return cachedHandler;

  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

  if (!baseUrl || !cookieSecret) {
    throw new Error(
      "Missing required Neon Auth environment variables: NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET must be configured in .env",
    );
  }

  const auth = createNeonAuth({
    baseUrl,
    cookies: {
      secret: cookieSecret,
    },
  });

  cachedHandler = auth.handler();
  return cachedHandler;
}

export async function GET(request: NextRequest, context: unknown) {
  const handler = getAuthHandler();
  return handler.GET(request as unknown as Request, context as never);
}

export async function POST(request: NextRequest, context: unknown) {
  const handler = getAuthHandler();
  return handler.POST(request as unknown as Request, context as never);
}
