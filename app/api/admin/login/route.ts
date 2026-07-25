import { NextResponse } from "next/server";
import { validateAdminPassword, getAdminCookieHeader } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    const isValid = validateAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 }
      );
    }

    const cookieInfo = getAdminCookieHeader();
    const response = NextResponse.json({ success: true });

    response.cookies.set(cookieInfo.name, cookieInfo.value, cookieInfo.options);

    return response;
  } catch (error) {
    console.error("[Admin Login API Error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
