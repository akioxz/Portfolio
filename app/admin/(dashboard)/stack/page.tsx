import { checkAdminSession } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import StackClient from "@/components/admin/StackClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminStackPage() {
  const isAuthenticated = await checkAdminSession();
  if (!isAuthenticated) redirect("/admin/login");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: stack } = await supabase
    .from("stack")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="p-8">
      <StackClient initialStack={stack || []} />
    </div>
  );
}
