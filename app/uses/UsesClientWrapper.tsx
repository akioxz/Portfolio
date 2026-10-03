"use client";

import React from "react";
import Image from "next/image";
import BackLink from "@/components/BackLink";
import { motion } from "motion/react";
import TiltWrapper from "@/components/TiltWrapper";

interface GearItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  link?: string;
  sort_order: number;
}

interface GroupedGear {
  category: string;
  label: string;
  items: GearItem[];
}

export default function UsesClientWrapper({ grouped }: { grouped: GroupedGear[] }) {
  // Stagger variants for the list
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <>
      <main className="min-h-screen pt-20 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <BackLink />
          <h1 className="text-3xl font-mono text-neutral-900 dark:text-white">
            uses
          </h1>
          <p className="mt-4 text-sm text-zinc-500 max-w-xl leading-relaxed">
            The hardware and tech I use on a daily basis to build, create, and stay productive.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col gap-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {grouped.map((group) => (
            <motion.div key={group.category} variants={itemVariants}>
              <h2 className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-500 mb-8">
                {group.label}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.items.map((item, idx) => {
                  const CardContent = (
                    <div className="group relative h-full flex flex-col bg-neutral-100 dark:bg-[#111] rounded-2xl border border-black/5 dark:border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg">
                      <div className="relative w-full pb-[75%] bg-neutral-50 dark:bg-[#0a0a0a] overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            priority={group.category === "pc" && idx < 3}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-contain p-8 group-hover:scale-105 grayscale group-hover:grayscale-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] mix-blend-multiply dark:mix-blend-normal absolute inset-0 w-full h-full"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                            <span className="font-mono text-4xl font-bold text-black/5 dark:text-white/5 select-none">
                              {item.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

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
                      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded-2xl"
                    >
                      <TiltWrapper className="h-full">
                        {CardContent}
                      </TiltWrapper>
                    </a>
                  ) : (
                    <div key={item.id} className="h-full">
                      <TiltWrapper className="h-full">
                        {CardContent}
                      </TiltWrapper>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {grouped.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-20">
              <p className="text-zinc-500 font-mono text-sm">
                Gear list coming soon.
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </>
  );
}
