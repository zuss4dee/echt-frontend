import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookie Policy" },
] as const;

export function Footer() {
  return (
    <footer className="mx-auto mt-20 flex max-w-[1600px] flex-col items-start justify-between gap-4 border-t border-hairline px-4 py-8 sm:mt-32 sm:flex-row sm:items-center sm:px-8">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 bg-foreground" />
        <span className="label-micro">ECHT — © 2026</span>
      </div>
      <div className="flex flex-col items-start gap-4 sm:items-end">
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 label-micro text-muted-foreground sm:justify-end"
          aria-label="Legal"
        >
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <span className="label-micro text-muted-foreground">FORENSIC INTEGRITY · UNITED KINGDOM</span>
      </div>
    </footer>
  );
}
