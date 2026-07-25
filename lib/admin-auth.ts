import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";

function getExpectedToken(): string {
  const password = process.env.ADMIN_PASSWORD || "admin123";
  return crypto.createHash("sha256").update(`portfolio_admin_${password}`).digest("hex");
}

export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn("[Admin Auth] ADMIN_PASSWORD environment variable is not set.");
    return false;
  }
  return password === adminPassword;
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) return false;

  const expectedToken = getExpectedToken();
  return sessionToken === expectedToken;
}

export function getAdminCookieHeader(): { name: string; value: string; options: any } {
  const expectedToken = getExpectedToken();
  return {
    name: COOKIE_NAME,
    value: expectedToken,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}
