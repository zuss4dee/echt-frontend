"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { ECHT_FAQ_ITEMS } from "@/lib/faq-content";

type FaqModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FaqModal({ open, onOpenChange }: FaqModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-zinc-900">
            Frequently asked questions
          </h2>
          <button
            type="button"
            onClick={close}
            className="shrink-0 rounded-lg p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Straight answers about retention, how Echt fits your team, and scan times.
        </p>

        <div className="mt-6 space-y-6 border-t border-zinc-100 pt-6">
          {ECHT_FAQ_ITEMS.map((item) => (
            <section key={item.question}>
              <h3 className="text-sm font-semibold text-zinc-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.answer}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
