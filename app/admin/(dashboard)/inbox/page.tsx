import { redirect } from "next/navigation";
import { checkAdminSession } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import InboxClient, { ContactMessage } from "./InboxClient";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let messages: ContactMessage[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Admin Inbox Fetch Error]", error);
      } else if (data) {
        messages = data as ContactMessage[];
      }
    } catch (err) {
      console.error("[Admin Inbox Supabase Error]", err);
    }
  }

  return <InboxClient initialMessages={messages} />;
}
