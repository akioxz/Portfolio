import React from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import BackLink from "@/components/BackLink";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 3600;

export const metadata = {
  title: "Uses - Axel Villanueva",
  description: "The hardware and tech I use on a daily basis to build, create, and stay productive.",
};

interface GearItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  link?: string;
  sort_order: number;
}

const categoryLabels: Record<string, string> = {
  pc: "PC Build",
  display: "Display",
  keyboards: "Keyboards",
  mouse: "Mouse",
  audio: "Audio",
  other: "Other",
};

const categoryOrder = ["pc", "display", "keyboards", "mouse", "audio", "other"];

export default async function UsesPage() {
  const { data: gear } = await supabase
    .from("gear")
    .select("*")
    .order("sort_order", { ascending: true });

  const gearItems = (gear as GearItem[]) || [];

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat] || cat,
      items: gearItems.filter((g) => g.category === cat),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <main className="min-h-screen pt-20 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-10">
        <BackLink />
        <h1 className="text-3xl font-mono text-neutral-900 dark:text-white">
          uses
        </h1>
        <p className="mt-4 text-sm text-zinc-500 max-w-xl leading-relaxed">
          The hardware and tech I use on a daily basis to build, create, and stay productive.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {grouped.map((group) => (
          <div key={group.category}>
            <h2 className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-500 mb-8">
              {group.label}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.items.map((item, idx) => {
                const CardContent = (
                  <div className="group relative h-full flex flex-col bg-neutral-100 dark:bg-[#111] rounded-2xl border border-black/5 dark:border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg">
                    {/* Image Area */}
                    <div className="relative w-full pb-[75%] bg-neutral-50 dark:bg-[#0a0a0a] overflow-hidden">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          priority={group.category === "pc" && idx < 3}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] mix-blend-multiply dark:mix-blend-normal absolute inset-0 w-full h-full"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                          <span className="font-mono text-4xl font-bold text-black/5 dark:text-white/5 select-none">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col grow">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-mono text-[13px] text-neutral-900 dark:text-white leading-tight">
                          {item.name}
                        </h3>
                        {item.link && (
                          <span className="opacity-0 group-hover:opacity-50 transition-opacity text-[10px] mt-0.5 shrink-0">
                            &#8599;
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-zinc-500 text-xs font-sans mt-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );

                return item.link ? (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    {CardContent}
                  </a>
                ) : (
                  <div key={item.id} className="h-full">{CardContent}</div>
                );
              })}
            </div>
          </div>
        ))}

        {gearItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-mono text-sm">
              Gear list coming soon.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
