import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

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
      <body className="font-sans bg-ink text-cream antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
