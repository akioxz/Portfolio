import React from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 3600;

export default async function AllProjectsPage() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-16">
        <Link 
          href="/#projects" 
          className="text-xs font-mono uppercase tracking-widest text-slate hover:text-neutral-900 dark:hover:text-cream transition-colors mb-8 inline-block"
        >
          ? BACK
        </Link>
        <h1 className="text-3xl font-mono text-neutral-900 dark:text-cream">All Projects</h1>
      </div>

      <div className="flex flex-col">
        {projects?.map((project) => (
          <a
            key={project.id}
            href={project.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col md:flex-row items-start md:items-center justify-between py-8 border-b border-slate/10 hover:bg-neutral-50/50 dark:hover:bg-surface/30 transition-colors -mx-6 px-6"
          >
            <div className="flex items-center gap-2 mb-4 md:mb-0 w-full md:w-1/3 shrink-0">
              <h2 className="text-lg font-mono text-neutral-900 dark:text-cream group-hover:text-teal transition-colors">
                {project.name}
              </h2>
              <span className="font-mono text-xs text-slate opacity-0 -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 group-hover:text-teal">
                ↗
              </span>
            </div>

            {/* Right side: Eyebrow + 1-line description */}
            <div className="flex flex-col w-full md:w-2/3">
              <span className="font-mono text-[9px] font-semibold tracking-[0.2em] uppercase text-slate mb-1">
                {project.eyebrow}
              </span>
              <p className="text-slate text-sm font-sans line-clamp-2 text-pretty">
                {project.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
