"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ScrambleTitle from "./ScrambleTitle";
import Magnetic from "./Magnetic";

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export default function Certifications({ certifications = [] }: { certifications?: CertificationItem[] }) {
  const pathname = usePathname();
  if (certifications.length === 0) return null;
  const isDedicatedPage = pathname === "/certifications";
  const visibleCerts = isDedicatedPage ? certifications : certifications.slice(0, 3);

  return (
    <section id="certifications" className="scroll-mt-24" aria-label="Certifications">
      <div className="flex items-center justify-between mb-8">
        <ScrambleTitle
          text="Certifications"
          as="h2"
          className="text-2xl sm:text-[1.75rem] tracking-tight font-mono text-neutral-900 dark:text-cream"
        />

        {certifications.length > 3 && pathname !== "/certifications" && (
          <Magnetic>
            <Link
              href="/certifications"
              className="group flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-cream transition-colors"
              data-magnetic
            >
              ALL CERTS 
              <span className="transform transition-transform group-hover:translate-x-1">&#8594;</span>
            </Link>
          </Magnetic>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {visibleCerts.map((cert) => (
          <div
            key={cert.id}
            className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-6 items-start"
          >
            <div className="font-mono text-xs text-neutral-600 dark:text-neutral-400">{cert.date}</div>
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
              <p className="text-neutral-600 dark:text-neutral-400 text-xs mt-1">
                {cert.issuer}
              </p>

              <div className="mt-3 w-36 h-20 rounded border border-slate/15 bg-surface/30 p-2 flex flex-col justify-between font-mono text-[7px] text-neutral-600 dark:text-neutral-400 select-none shadow-md">
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
    </section>
  );
}
