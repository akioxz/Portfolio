import React from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 3600;

export default async function AllCertificationsPage() {
  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-16">
        <Link 
          href="/#certifications" 
          className="text-xs font-mono uppercase tracking-widest text-slate hover:text-neutral-900 dark:hover:text-cream transition-colors mb-8 inline-block"
        >
          &#8592; BACK
        </Link>
        <h1 className="text-3xl font-mono text-neutral-900 dark:text-cream">All Certifications</h1>
      </div>

      <div className="flex flex-col gap-6">
        {certifications?.map((cert) => (
          <div
            key={cert.id}
            className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-6 items-start pb-6 border-b border-slate/10"
          >
            <div className="font-mono text-xs text-slate">{cert.date}</div>
            <div>
              <h3 className="font-mono text-sm text-cream font-medium leading-snug">
                {cert.link ? (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors group inline-flex items-center gap-1">
                    {cert.name}
                    <span className="opacity-0 -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-[10px]">&#8599;</span>
                  </a>
                ) : (
                  cert.name
                )}
              </h3>
              <p className="text-slate text-xs mt-1">
                {cert.issuer}
              </p>

              <div className="mt-3 w-36 h-20 rounded border border-slate/15 bg-surface/30 p-2 flex flex-col justify-between font-mono text-[7px] text-slate/80 select-none shadow-md">
                <div className="flex justify-between items-center border-b border-slate/10 pb-1">
                  <span className="font-bold tracking-wider text-[6px]">
                    CREDENTIAL
                  </span>
                  <span className="text-[5px] text-teal">VERIFIED</span>
                </div>
                <div className="text-[6px] text-cream truncate my-1.5 font-sans font-medium">
                  {cert.name}
                </div>
                <div className="flex justify-between items-center text-[5px] text-slate/50">
                  <span>{cert.issuer}</span>
                  <span>{cert.date.split(" ")[0]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
