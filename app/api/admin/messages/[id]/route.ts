import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Message ID required" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase config missing" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    if (body.action !== "archive" && body.action !== "restore") {
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase
      .from("contact_messages")
      .update({
        archived_at:
          body.action === "archive" ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) {
      console.error("[Archive Message Error]", error);
      return NextResponse.json(
        { error: "Unable to update the message." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Archive Message Unexpected Error]", error);
    return NextResponse.json(
      { error: "Unable to update the message." },
      { status: 500 },
    );
  }
}
