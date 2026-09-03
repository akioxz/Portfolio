import { cookies } from "next/headers";
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const SESSION_ISSUER = "akio-portfolio-admin";
const SESSION_AUDIENCE = "akio-portfolio-admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret(): Uint8Array | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    console.warn(
      "[Admin Auth] ADMIN_SESSION_SECRET environment variable is not set.",
    );
    return null;
  }
  return new TextEncoder().encode(secret);
}

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

  const secret = getSessionSecret();
  if (!secret) return false;

  try {
    await jwtVerify(sessionToken, secret, {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    return true;
  } catch {
    return false;
  }
}

export async function getAdminCookieHeader(): Promise<{
  name: string;
  value: string;
  options: any;
}> {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error(
      "[Admin Auth] Cannot issue a session: ADMIN_SESSION_SECRET environment variable is not set.",
    );
  }

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setJti(crypto.randomUUID())
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
