import Link from "next/link";
import { EchtWordmark } from "@/components/EchtLogo";

const faqItems = [
  {
    question: "Do you store our tenants' sensitive documents?",
    answer:
      "No. Echt operates on a zero-retention architecture. Documents are analyzed in memory and instantly purged. We do not train our models on your data.",
  },
  {
    question: "Does Echt replace our referencing team?",
    answer:
      "No. Echt is a forensic augmentation tool. It surfaces anomalies, hidden metadata, and ELA heatmaps so your human analysts can make faster, safer decisions with mathematical certainty.",
  },
  {
    question: "How long does a forensic scan take?",
    answer:
      "Under 3 seconds per document. Your workflow remains uninterrupted.",
  },
] as const;

export default function FaqPage() {
  return (
    <main className="min-h-dvh bg-white text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/landing" className="transition-opacity hover:opacity-80">
            <EchtWordmark className="h-8 w-auto text-zinc-900" />
          </Link>
          <Link
            href="/landing"
            className="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
          >
            Back to marketing site
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mb-14 max-w-xl text-zinc-600 leading-relaxed">
          Straight answers about retention, how Echt fits your team, and scan
          times.
        </p>

        <div className="space-y-0">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="border-b border-zinc-200 py-10 first:pt-0 last:border-b-0"
            >
              <h2 className="mb-3 text-xl font-semibold text-zinc-900">
                {item.question}
              </h2>
              <p className="text-zinc-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
