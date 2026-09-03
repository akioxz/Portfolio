import { jwtVerify } from "jose";

export const SESSION_ISSUER = "akio-portfolio-admin";
export const SESSION_AUDIENCE = "akio-portfolio-admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

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

export async function verifyAdminSessionToken(
  sessionToken: string,
): Promise<boolean> {
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

export function getAdminSessionSecret(): Uint8Array | null {
  return getSessionSecret();
}
