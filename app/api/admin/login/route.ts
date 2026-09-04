import { NextResponse } from "next/server";
import { validateAdminPassword, getAdminCookieHeader } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import {
  createCsrfToken,
  csrfCookieOptions,
  hasValidCsrfToken,
  CSRF_COOKIE_NAME,
} from "@/lib/csrf";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS_PER_WINDOW = 5;
const fallbackLoginAttempts = new Map<string, number[]>();

function isFallbackRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (fallbackLoginAttempts.get(key) || []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );

  if (timestamps.length >= MAX_LOGIN_ATTEMPTS_PER_WINDOW) {
    return true;
  }

  timestamps.push(now);
  fallbackLoginAttempts.set(key, timestamps);
  return false;
}

async function isLoginRateLimited(
  clientIp: string,
  supabaseUrl?: string,
  supabaseServiceKey?: string,
): Promise<boolean> {
  const ipHash = crypto
    .createHash("sha256")
    .update(`admin-login:${clientIp}`)
    .digest("hex");

  // Prefer service-role key for server-side rate limiting (required for reliable writes)
  if (supabaseUrl && supabaseServiceKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const windowStart = new Date(
        Date.now() - RATE_LIMIT_WINDOW_MS,
      ).toISOString();
      const cleanupCutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      // Async cleanup (non-blocking)
      supabase
        .from("contact_rate_limits")
        .delete()
        .lt("created_at", cleanupCutoff)
        .then(({ error }) => {
          if (error) console.warn("[Admin Rate Limit Cleanup Warning]", error);
        });

      // Atomically count and increment: upsert ensures single operation
      const { data: countData, error: countError } = await supabase
        .from("contact_rate_limits")
        .select("id")
        .eq("ip_hash", ipHash)
        .gte("created_at", windowStart);

      if (countError) {
        console.warn("[Admin Rate Limiter] Count query failed:", countError);
        return isFallbackRateLimited(ipHash);
      }

      if (!countData) {
        console.warn("[Admin Rate Limiter] Count query returned null");
        return isFallbackRateLimited(ipHash);
      }

      // Check threshold before inserting
      if (countData.length >= MAX_LOGIN_ATTEMPTS_PER_WINDOW) {
        return true;
      }

      // Attempt to record this attempt; any failure falls back to in-memory limiter
      const { error: insertError } = await supabase
        .from("contact_rate_limits")
        .insert([{ ip_hash: ipHash }]);

      if (insertError) {
        console.warn(
          "[Admin Rate Limiter] Failed to record attempt; using fallback:",
          insertError,
        );
        return isFallbackRateLimited(ipHash);
      }

      return false;
    } catch (error) {
      console.warn("[Admin Rate Limiter] Supabase operation failed:", error);
      return isFallbackRateLimited(ipHash);
    }
  }

  // No service-role key: fall back to in-memory limiter
  console.warn(
    "[Admin Rate Limiter] No service-role key configured; using in-memory limiter only",
  );
  return isFallbackRateLimited(ipHash);
}

export async function GET() {
  const csrfToken = createCsrfToken();
  const response = NextResponse.json({ csrfToken });
  response.cookies.set(CSRF_COOKIE_NAME, csrfToken, csrfCookieOptions());
  return response;
}

export async function POST(request: Request) {
  try {
    if (!hasValidCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = (
      forwardedFor?.split(",")[0] ||
      realIp ||
      "127.0.0.1"
    ).trim();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (await isLoginRateLimited(clientIp, supabaseUrl, supabaseServiceKey)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 },
      );
    }

    const isValid = validateAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 },
      );
    }

    const cookieInfo = await getAdminCookieHeader();
    const response = NextResponse.json({ success: true });

    response.cookies.set(cookieInfo.name, cookieInfo.value, cookieInfo.options);

    return response;
  } catch (error) {
    console.error("[Admin Login API Error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
