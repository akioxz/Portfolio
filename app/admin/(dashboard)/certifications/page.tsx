import { checkAdminSession } from "@/lib/admin-auth";
import { getAdminSupabase } from "@/lib/supabase";
import CertificationsClient from "@/components/admin/CertificationsClient";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  await checkAdminSession();

  const supabase = await getAdminSupabase();
  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="p-8">
      <CertificationsClient initialCertifications={certifications || []} />
    </div>
  );
}
