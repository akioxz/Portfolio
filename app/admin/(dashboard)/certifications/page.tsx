import { checkAdminSession } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import CertificationsClient from "@/components/admin/CertificationsClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const isAuthenticated = await checkAdminSession();
  if (!isAuthenticated) redirect("/admin/login");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

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
