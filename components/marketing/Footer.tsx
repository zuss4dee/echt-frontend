import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookie Policy" },
] as const;

export function Footer() {
  return (
    <footer className="mx-auto mt-32 flex max-w-[1600px] items-center justify-between border-t border-hairline px-8 py-8">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 bg-foreground" />
        <span className="label-micro">ECHT — © 2026</span>
      </div>
      <div className="flex flex-col items-end gap-4">
        <nav
          className="flex flex-wrap justify-end gap-x-6 gap-y-2 label-micro text-muted-foreground"
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
