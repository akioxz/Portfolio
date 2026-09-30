import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";

import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import StatsStrip from "@/components/StatsStrip";
import LogoSplash from "@/components/LogoSplash";

import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import Certifications from "@/components/Certifications";
import BeyondTheCode from "@/components/BeyondTheCode";
import Footer from "@/components/Footer";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const [
    { data: projectsData },
    { data: experienceData },
    { data: stackData },
    { data: certificationsData },
  ] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("experience").select("*").order("sort_order", { ascending: true }),
    supabase.from("stack").select("*").order("sort_order", { ascending: true }),
    supabase.from("certifications").select("*").order("sort_order", { ascending: true }),
  ]);

  return (
    <>
      <LogoSplash />

      <main className="mx-auto w-full max-w-7xl flex flex-col gap-10 sm:gap-12 px-4 sm:px-6 pb-10 sm:pb-24 pt-16 sm:pt-20">
        <Hero />
        <Experience experience={experienceData || []} />
        <StatsStrip />

        <Projects projects={projectsData || []} />
        <Stack stack={stackData || []} />
        <Certifications certifications={certificationsData || []} />
        <BeyondTheCode />
        <Footer />
      </main>
    </>
  );
}
