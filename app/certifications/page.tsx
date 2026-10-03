import React from "react";
import { createClient } from "@supabase/supabase-js";
import Certifications from "@/components/Certifications";
import BackLink from "@/components/BackLink";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 3600;

export default async function CertificationsPage() {
  const { data: certificationsData } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-24 pt-32">
      <BackLink />
      <Certifications certifications={certificationsData || []} />
    </main>
  );
}
