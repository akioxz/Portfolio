import { checkAdminSession } from "@/lib/admin-auth";
import { getAdminSupabase } from "@/lib/supabase";
import StackClient from "@/components/admin/StackClient";

export const dynamic = "force-dynamic";

export default async function AdminStackPage() {
  await checkAdminSession();

  const supabase = await getAdminSupabase();
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
