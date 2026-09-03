import { cookies } from "next/headers";
import { SignJWT } from "jose";
import {
  getAdminSessionSecret,
  SESSION_AUDIENCE,
  SESSION_ISSUER,
  SESSION_MAX_AGE,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

const COOKIE_NAME = "admin_session";

export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn(
      "[Admin Auth] ADMIN_PASSWORD environment variable is not set.",
    );
    return false;
  }
  return password === adminPassword;
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) return false;

  return verifyAdminSessionToken(sessionToken);
}

export async function getAdminCookieHeader(): Promise<{
  name: string;
  value: string;
  options: any;
}> {
  const secret = getAdminSessionSecret();
  if (!secret) {
    throw new Error(
      "[Admin Auth] Cannot issue a session: ADMIN_SESSION_SECRET environment variable is not set.",
    );
  }

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setJti(globalThis.crypto.randomUUID())
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret);

  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    },
  };
}
