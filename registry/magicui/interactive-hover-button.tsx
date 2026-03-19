import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type InteractiveHoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** When set, renders as `next/link` (for CTAs that navigate). */
  href?: string
}

export function InteractiveHoverButton({
  children,
  className,
  href,
  ...props
}: InteractiveHoverButtonProps) {
  const classes = cn(
    "group bg-background relative inline-flex w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold no-underline",
    className
  )

  const inner = (
    <>
      <div className="relative z-10 flex items-center justify-center gap-2">
        <div className="h-2 w-2 shrink-0 rounded-full bg-current opacity-50 transition-all duration-300 group-hover:scale-[100.8] group-hover:opacity-90" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="text-primary-foreground absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight />
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {inner}
    </button>
  )
}
