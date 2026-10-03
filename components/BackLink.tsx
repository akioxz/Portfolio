import Link from "next/link";

export default function BackLink({ href = "/", label = "BACK" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6 inline-block"
    >
      &#8592; {label}
    </Link>
  );
}
