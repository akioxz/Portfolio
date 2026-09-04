import { NextResponse } from "next/server";
import { hasValidCsrfToken } from "@/lib/csrf";

export async function POST(request: Request) {
  if (!hasValidCsrfToken(request)) {
    return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_session");
  return response;
}
