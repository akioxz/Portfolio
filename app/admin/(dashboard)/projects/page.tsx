import { redirect } from "next/navigation";
import { checkAdminSession } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import ProjectsClient from "@/components/admin/ProjectsClient";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let projects: any[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data) {
        projects = data;
      }
    } catch (err) {}
  }

  return (
    <div className="p-4 sm:p-8 font-sans max-w-5xl mx-auto">
      <ProjectsClient initialProjects={projects} />
    </div>
  );
}
