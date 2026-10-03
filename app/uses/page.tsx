import React from "react";
import { createClient } from "@supabase/supabase-js";
import UsesClientWrapper from "./UsesClientWrapper";

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

  return <UsesClientWrapper grouped={grouped} />;
}
