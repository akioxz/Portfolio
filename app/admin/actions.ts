"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { checkAdminSession } from "@/lib/admin-auth";

// Helper to get admin supabase client bypassing RLS
async function getAdminSupabase() {
  const isAuthenticated = await checkAdminSession();
  if (!isAuthenticated) throw new Error("Unauthorized");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseKey);
}

// === PROJECTS ACTIONS ===

export async function createProject(formData: FormData) {
  const supabase = await getAdminSupabase();
  
  const tagsString = formData.get("tags") as string;
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];
  
  const project = {
    name: formData.get("name") as string,
    eyebrow: formData.get("eyebrow") as string,
    status: formData.get("status") as string || null,
    description: formData.get("description") as string,
    tags,
    image: formData.get("image") as string || null,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };

  const { error } = await supabase.from("projects").insert(project);
  if (error) throw new Error(error.message);
  
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await getAdminSupabase();
  
  const tagsString = formData.get("tags") as string;
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];
  
  const project = {
    name: formData.get("name") as string,
    eyebrow: formData.get("eyebrow") as string,
    status: formData.get("status") as string || null,
    description: formData.get("description") as string,
    tags,
    image: formData.get("image") as string || null,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };

  const { error } = await supabase.from("projects").update(project).eq("id", id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

// === EXPERIENCE ACTIONS ===

export async function createExperience(formData: FormData) {
  const supabase = await getAdminSupabase();
  
  const tagsString = formData.get("tags") as string;
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];
  
  const exp = {
    year: formData.get("year") as string,
    role: formData.get("role") as string,
    project: formData.get("project") as string,
    subtitle: formData.get("subtitle") as string,
    description: formData.get("description") as string,
    tags,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };

  const { error } = await supabase.from("experience").insert(exp);
  if (error) throw new Error(error.message);
  
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await getAdminSupabase();
  
  const tagsString = formData.get("tags") as string;
  const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];
  
  const exp = {
    year: formData.get("year") as string,
    role: formData.get("role") as string,
    project: formData.get("project") as string,
    subtitle: formData.get("subtitle") as string,
    description: formData.get("description") as string,
    tags,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };

  const { error } = await supabase.from("experience").update(exp).eq("id", id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function deleteExperience(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/");
  revalidatePath("/admin/experience");
}
export async function createCertification(data: any) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('certifications').insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/certifications');
}

export async function updateCertification(id: string, data: any) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('certifications').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/certifications');
}

export async function deleteCertification(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('certifications').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/certifications');
}

export async function createStack(data: any) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('stack').insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/stack');
}

export async function updateStack(id: string, data: any) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('stack').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/stack');
}

export async function deleteStack(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('stack').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/stack');
}
