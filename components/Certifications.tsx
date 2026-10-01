"use client";

import { useState } from "react";
import Link from "next/link";
import SplitText from "./react-bits/SplitText";
import Magnetic from "./Magnetic";

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export default function Certifications({ certifications = [] }: { certifications?: CertificationItem[] }) {
  if (certifications.length === 0) return null;
  const visibleCerts = certifications.slice(0, 3);

  return (
    <section id="certifications" className="scroll-mt-24" aria-label="Certifications">
      <div className="flex items-center justify-between mb-8">
        <p className="font-pixel text-xs text-slate mb-2 uppercase tracking-wider">04 — certifications</p>
        <SplitText
          text="Certifications"
          tag="h2"
          className="text-2xl sm:text-[1.75rem] tracking-tight font-mono text-neutral-900 dark:text-cream"
          splitType="words"
          delay={40}
          duration={0.5}
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
        />

        {certifications.length > 3 && (
          <Magnetic>
            <Link
              href="/certifications"
              className="group flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate hover:text-neutral-900 dark:hover:text-cream transition-colors"
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
    </section>
  );
}

