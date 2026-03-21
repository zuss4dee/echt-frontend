export type FaqItem = { question: string; answer: string };

export const ECHT_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do you store our tenants' sensitive documents?",
    answer:
      "No. Echt uses a zero-retention flow: files are analyzed in memory and not kept on disk. We do not use your documents to train models.",
  },
  {
    question: "Does Echt replace our referencing team?",
    answer:
      "No. Echt is decision support. It highlights anomalies, metadata, and tamper signals so your analysts can review faster, not to replace human judgment.",
  },
  {
    question: "How long does a forensic scan take?",
    answer:
      "Typically under a few seconds per document, so your queue keeps moving.",
  },
];
