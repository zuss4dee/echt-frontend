"use client";

import { useState } from "react";

export default function ForensicSlider() {
  const [position, setPosition] = useState(50); // percentage

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,1)]">
      <div className="mb-4 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Forensic Compare
          </span>
        </div>
        <p className="text-[10px] text-slate-500">
          Drag the handle to reveal Echt&apos;s forensic ELA view.
        </p>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950">
        {/* Base: original payslip */}
        <div className="absolute inset-0 grid grid-cols-[1.1fr_0.9fr] gap-0">
          <div className="relative flex items-center justify-center border-r border-slate-800/70 bg-slate-950/80">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.25),transparent_60%)]" />
            <div className="relative w-[78%] max-w-sm rounded-xl border border-slate-700/80 bg-slate-900/95 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
              <div className="mb-2 flex items-center justify-between text-[9px] text-slate-500">
                <span>Original payslip.pdf</span>
                <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-300">
                  Clean view
                </span>
              </div>
              <div className="space-y-1.5 text-[9px] text-slate-300">
                <div className="flex items-center justify-between rounded-md bg-slate-900 px-2 py-1">
                  <span>Employer</span>
                  <span className="font-mono text-[10px] text-slate-200">Northbridge Estates</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-900 px-2 py-1">
                  <span>Net pay</span>
                  <span className="font-mono text-[10px] text-slate-200">£3,250.41</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-900 px-2 py-1">
                  <span>Period</span>
                  <span className="font-mono text-[10px] text-slate-200">01–31 Jan 2024</span>
                </div>
                <div className="mt-1 rounded-md bg-slate-900/80 px-2 py-1.5 text-[9px] text-slate-400">
                  Everything looks neatly aligned and visually consistent — exactly what most human
                  reviewers expect from a modern payslip.
                </div>
              </div>
            </div>
          </div>

          {/* Right: forensic ELA view (background placeholder) */}
          <div className="relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-rose-900/50 to-amber-500/40">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(248,250,252,0.65),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.95),transparent_55%)] mix-blend-screen" />
            <div className="relative w-[78%] max-w-sm rounded-xl border border-rose-500/40 bg-black/70 p-3 shadow-[0_26px_70px_rgba(127,29,29,0.9)]">
              <div className="mb-2 flex items-center justify-between text-[9px] text-rose-100">
                <span>Echt Forensic View</span>
                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[9px] text-rose-100">
                  3 manipulations detected
                </span>
              </div>
              <div className="relative h-32 overflow-hidden rounded-lg border border-rose-400/40 bg-gradient-to-br from-slate-950 via-rose-600/60 to-amber-300/60">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(248,250,252,0.85),transparent_40%),radial-gradient(circle_at_80%_50%,rgba(15,23,42,0.95),transparent_55%),radial-gradient(circle_at_20%_85%,rgba(248,250,252,0.8),transparent_45%)] mix-blend-screen opacity-95" />
                <div className="absolute left-3 top-3 space-y-1 text-[9px] text-rose-50">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    Signature block re-sampled
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                    Net pay row brightness anomaly
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
                    Layer compression mismatch
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[9px] leading-relaxed text-rose-100/90">
                ELA highlights regions where pixel compression and noise signatures diverge sharply from
                the rest of the page — classic signs of copy–paste payslip edits.
              </p>
            </div>
          </div>
        </div>

        {/* Wipe overlay for interactive slider */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
          }}
        >
          <div className="absolute inset-0 grid grid-cols-[1.1fr_0.9fr] gap-0">
            {/* Reuse the forensic side on top as the "revealed" view */}
            <div className="relative flex items-center justify-center border-r border-slate-800/70 bg-gradient-to-br from-slate-950 via-rose-900/60 to-amber-500/40">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(248,250,252,0.65),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.95),transparent_55%)] mix-blend-screen" />
              <div className="relative w-[78%] max-w-sm rounded-xl border border-rose-500/40 bg-black/70 p-3 shadow-[0_26px_70px_rgba(127,29,29,0.9)]">
                <div className="mb-2 flex items-center justify-between text-[9px] text-rose-100">
                  <span>Echt Forensic View</span>
                  <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[9px] text-rose-100">
                    3 manipulations detected
                  </span>
                </div>
                <div className="relative h-32 overflow-hidden rounded-lg border border-rose-400/40 bg-gradient-to-br from-slate-950 via-rose-600/60 to-amber-300/60">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(248,250,252,0.85),transparent_40%),radial-gradient(circle_at_80%_50%,rgba(15,23,42,0.95),transparent_55%),radial-gradient(circle_at_20%_85%,rgba(248,250,252,0.8),transparent_45%)] mix-blend-screen opacity-95" />
                  <div className="absolute left-3 top-3 space-y-1 text-[9px] text-rose-50">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                      Signature block re-sampled
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                      Net pay row brightness anomaly
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
                      Layer compression mismatch
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-950 via-rose-900/50 to-amber-500/40" />
          </div>
        </div>

        {/* Slider handle */}
        <div className="absolute inset-0 flex items-stretch">
          <div
            className="relative h-full"
            style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          >
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-200/80 to-transparent" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -mt-4 -translate-x-1/2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-400/80 bg-slate-900/90 text-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.9)]">
                <span className="text-[9px] font-medium">⇆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actual input for dragging */}
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="pointer-events-auto absolute inset-x-6 bottom-4 h-1.5 cursor-pointer appearance-none rounded-full bg-slate-800/80 accent-rose-400"
        />
      </div>

      <p className="mt-4 text-center text-[11px] text-slate-400">
        <span className="font-semibold text-slate-200">Human Eye:</span> Looks Genuine{" "}
        <span className="mx-2 text-slate-600">|</span>
        <span className="font-semibold text-emerald-300">Echt AI:</span> 3 Manipulations Detected
      </p>
    </div>
  );
}

