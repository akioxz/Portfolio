"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import LogoSplash from "@/components/LogoSplash";

import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import Certifications from "@/components/Certifications";
import BeyondTheCode from "@/components/BeyondTheCode";
import Footer from "@/components/Footer";

const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <LogoSplash onComplete={() => setSplashDone(true)} />}

      <Header />

      <main className="mx-auto w-full max-w-7xl flex flex-col gap-10 sm:gap-12 px-4 sm:px-6 pb-10 sm:pb-24 pt-16 sm:pt-20">
        <Hero />
        <StatsStrip />

        <Projects />
        <Stack />
        <Certifications />
        <BeyondTheCode />
        <Footer />
      </main>

      <Chatbot />
    </>
  );
}


