"use client";

import { useState } from "react";
import SplitText from "./react-bits/SplitText";
import { certificationsData } from "@/data/certifications";

export default function Certifications() {
  const [showAll, setShowAll] = useState(false);
  if (certificationsData.length === 0) return null;
  const visibleCerts = showAll ? certificationsData : certificationsData.slice(0, 3);

  return (
    <section id="certifications" className="mb-20 scroll-mt-24" aria-label="Certifications">
      <div className="flex items-center justify-between mb-8">
        <SplitText
          text="Certifications"
          tag="h2"
          className="text-xl font-mono text-cream font-medium"
          splitType="words"
          delay={40}
          duration={0.5}
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
        />

        {certificationsData.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="font-mono text-xs text-slate hover:text-teal transition-colors shrink-0 ml-4 cursor-pointer"
          >
            {showAll ? `Show Less ${"\u2190"}` : `View All ${"\u2192"}`}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {visibleCerts.map((cert, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-6 items-start"
          >
            <div className="font-mono text-xs text-slate">{cert.date}</div>
            <div>
              <h3 className="font-mono text-sm text-cream font-medium leading-snug">
                {cert.title}
              </h3>
              <p className="text-slate text-xs mt-1">
                {cert.issuer}
                {cert.credentialId && ` ${"\u00B7"} Credential ID ${cert.credentialId}`}
              </p>

              <div className="mt-3 w-36 h-20 rounded border border-slate/15 bg-surface/30 p-2 flex flex-col justify-between font-mono text-[7px] text-slate/80 select-none shadow-md">
                <div className="flex justify-between items-center border-b border-slate/10 pb-1">
                  <span className="font-bold tracking-wider text-[6px]">
                    CREDENTIAL
                  </span>
                  <span className="text-[5px] text-teal">VERIFIED</span>
                </div>
                <div className="text-[6px] text-cream truncate my-1.5 font-sans font-medium">
                  {cert.title}
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

