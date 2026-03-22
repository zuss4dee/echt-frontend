import Link from "next/link";
import {
  getWhopForumUrl,
  getWhopProductUpdatesUrl,
  getWhopSupportChatUrl,
} from "@/lib/whop-experience-urls";

export const metadata = {
  title: "Contact | Echt",
  description: "Reach Echt on Whop: support chat, community, and product updates.",
};

const linkClass =
  "font-medium text-purple-700 underline underline-offset-2 transition hover:text-purple-900";

export default function ContactPage() {
  const supportChatUrl = getWhopSupportChatUrl();
  const forumUrl = getWhopForumUrl();
  const productUpdatesUrl = getWhopProductUpdatesUrl();
  const hasWhopLinks = Boolean(supportChatUrl || forumUrl || productUpdatesUrl);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-lg">
        <h1 className="text-2xl font-semibold tracking-tight">Contact &amp; community</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          Sales, support, and product conversations run on{" "}
          <span className="font-medium text-zinc-800">Whop</span>. Pick the channel you need. Each
          opens in a new tab.
        </p>

        {hasWhopLinks ? (
          <ul className="mt-8 space-y-4 text-left text-sm">
            {supportChatUrl ? (
              <li className="flex flex-col gap-1 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Primary (support)
                </span>
                <a
                  href={supportChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Open support chat
                </a>
              </li>
            ) : null}
            {forumUrl ? (
              <li className="flex flex-col gap-1 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Community
                </span>
                <a href={forumUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Members&apos; forum
                </a>
              </li>
            ) : null}
            {productUpdatesUrl ? (
              <li className="flex flex-col gap-1 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Product
                </span>
                <a
                  href={productUpdatesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Product updates &amp; roadmap
                </a>
              </li>
            ) : null}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-zinc-600">
            Whop experience URLs are not configured. Add{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_WHOP_*</code> in
            your environment (see <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">docs/WHOP.md</code>
            ).
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
