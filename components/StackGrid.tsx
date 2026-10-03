"use client";

import SplitText from "./react-bits/SplitText";

interface StackItem {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export default function StackGrid({ stack = [] }: { stack?: StackItem[] }) {
  if (stack.length === 0) return null;

  // Group items by category dynamically
  const groupedStack = stack.reduce((acc, item) => {
    const cat = item.category.toUpperCase();
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, StackItem[]>);

  // Define standard sort order for known categories
  const categoryOrder = [
    "FRONTEND",
    "BACKEND",
    "DEVOPS & CLOUD",
    "AI & MACHINE LEARNING",
    "SECURITY & IDENTITY",
    "CMS & NO-CODE",
    "DEVELOPER TOOLS",
    "TOOLS" // Fallback
  ];

  const sortedCategories = Object.keys(groupedStack).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <section id="stack" className="scroll-mt-24" aria-label="Technology Stack">
      
      <SplitText
        text="tech stack"
        tag="h2"
        className="text-2xl sm:text-[1.75rem] tracking-tight font-mono text-neutral-900 dark:text-cream mb-6"
        splitType="words"
        delay={40}
        duration={0.5}
        from={{ opacity: 0, y: 16 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.2}
      />

      <p className="font-sans text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 mb-12 leading-relaxed max-w-2xl text-pretty">
        The tools, frameworks, and platforms I reach for — across the front end, back end, infrastructure, and AI.
      </p>

      <div className="flex flex-col gap-10">
        {sortedCategories.map((category) => (
          <div key={category} className="flex flex-col gap-4">
            <h3 className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-slate/70 dark:text-neutral-500">
              {category}
            </h3>
            
            <div className="flex flex-wrap gap-2.5">
              {groupedStack[category].map((item) => (
                <span
                  key={item.name}
                  className="font-mono text-[11px] sm:text-[12px] text-neutral-700 dark:text-neutral-300 border border-slate/15 dark:border-white/[0.08] px-3.5 py-1.5 rounded-lg hover:border-slate/30 dark:hover:border-white/[0.15] hover:text-neutral-900 dark:hover:text-cream transition-colors cursor-default"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
