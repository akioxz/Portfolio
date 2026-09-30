import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar, MobileMenu } from "@/components/Navigation";
import ThemeProvider from "@/components/ThemeProvider";
import ReactLenisWrapper from "@/components/ReactLenisWrapper";
import MagneticCursor from "@/components/MagneticCursor";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://axelvillanueva.vercel.app"),
  title: "Axel Villanueva | Full-Stack Developer",
  description:
    "4th-year BSIT student & full-stack web & mobile developer specializing in React, Next.js, React Native, and Supabase.",
  keywords: [
    "Axel Villanueva",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "React Native",
    "TypeScript",
    "Supabase",
    "Portfolio",
  ],
  authors: [{ name: "Axel Villanueva" }],
  icons: {
    icon: "/favicon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Axel Villanueva | Full-Stack Developer",
    description:
      "Full-stack software engineering, web & mobile applications with React, Next.js, React Native, and Supabase.",
    type: "website",
    locale: "en_US",
    siteName: "Axel Villanueva Portfolio",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Axel Villanueva | Full-Stack Developer",
    description:
      "Full-stack software engineering, web & mobile applications with React, Next.js, React Native, and Supabase.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Axel Villanueva",
              "url": "https://axelvillanueva.vercel.app",
              "jobTitle": "Full-Stack Web & Mobile Developer",
              "description": "4th-year BSIT student & full-stack web & mobile developer specializing in React, Next.js, React Native, and Supabase.",
              "email": "dev.akioxz@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "PH"
              },
              "knowsAbout": [
                "React",
                "Next.js",
                "React Native",
                "TypeScript",
                "Supabase",
                "PostgreSQL",
                "Tailwind CSS"
              ],
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "Information Technology (BSIT)"
              },
              "sameAs": ["https://github.com/akioxz"]
            }),
          }}
        />
      </head>
      <body className="font-sans bg-white dark:bg-ink text-neutral-900 dark:text-cream antialiased relative">
        {/* Subtle Corner Halftone Accents */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="halftone mask-tr absolute right-0 top-0 h-[65vh] w-[55vw] opacity-[0.12] dark:opacity-[0.16]" />
          <div className="halftone mask-bl absolute bottom-0 left-0 h-[55vh] w-[45vw] opacity-[0.10] dark:opacity-[0.14]" />
        </div>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <ReactLenisWrapper>
            <Sidebar />
            <MobileMenu />
            <div className="lg:pl-[260px] w-full min-h-screen flex flex-col relative z-10">
              {children}
            </div>
          </ReactLenisWrapper>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <MagneticCursor />
      </body>
    </html>
  );
}
