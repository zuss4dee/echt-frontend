"use client";

import { motion } from "framer-motion";

export function BackgroundField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* blueprint grid */}
      <div className="absolute inset-0 bg-blueprint" />
      {/* sparse crosshair dots */}
      <div className="absolute inset-0 bg-crosshair opacity-60" />

      {/* edge vignette to focus center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, var(--background) 95%)",
        }}
      />

      {/* corner registration marks */}
      {[
        "left-6 top-6",
        "right-6 top-6",
        "left-6 bottom-6",
        "right-6 bottom-6",
      ].map((p) => (
        <div key={p} className={`absolute ${p} flex items-center gap-2 label-micro text-foreground/30`}>
          <span className="h-px w-4 bg-foreground/30" />
          <span className="h-2 w-2 border border-foreground/30" />
        </div>
      ))}

      {/* slow drifting latitude line */}
      <motion.div
        initial={{ top: "12%" }}
        animate={{ top: ["12%", "82%", "12%"] }}
        transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
        className="absolute inset-x-0 h-px bg-foreground/[0.06]"
      />
      <motion.div
        initial={{ left: "20%" }}
        animate={{ left: ["20%", "78%", "20%"] }}
        transition={{ duration: 34, ease: "easeInOut", repeat: Infinity }}
        className="absolute inset-y-0 w-px bg-foreground/[0.05]"
      />
    </div>
  );
}
