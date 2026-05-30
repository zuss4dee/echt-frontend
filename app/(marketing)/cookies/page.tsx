import type { Metadata } from "next";
import { LegalDocumentLayout, LegalSection } from "@/components/marketing/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Cookie Policy — Echt",
  description: "How Echt uses cookies and similar technologies on our website and platform.",
};

export default function CookiePolicyPage() {
  return (
    <LegalDocumentLayout title="Cookie Policy">
      <LegalSection title="1. Introduction">
        <p>
          This Cookie Policy explains how Echt (&quot;Echt&quot;, &quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) uses cookies and similar technologies on our marketing website and
          authenticated platform (collectively, the &quot;Service&quot;). It should be read alongside
          our Privacy Policy.
        </p>
        <p>
          Echt is established in the United Kingdom and processes cookie-related data in accordance
          with UK GDPR, the Privacy and Electronic Communications Regulations (&quot;PECR&quot;), and
          applicable guidance from the Information Commissioner&apos;s Office.
        </p>
      </LegalSection>

      <LegalSection title="2. What are cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a website. They help
          websites function, remember preferences, and understand how visitors interact with pages.
          We may also use similar technologies such as local storage and session storage where
          technically necessary.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use cookies">
        <p>We group cookies used on the Service into the following categories:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-neutral-300">Strictly necessary</strong> — required for
            security, authentication, load balancing, and core platform operation. These cannot be
            switched off in our systems.
          </li>
          <li>
            <strong className="text-neutral-300">Functional</strong> — remember choices such as
            session state and interface preferences within the application.
          </li>
          <li>
            <strong className="text-neutral-300">Analytics</strong> — help us understand aggregate
            usage, performance, and errors so we can improve reliability. Where used on the marketing
            site, analytics cookies are deployed in a privacy-conscious manner.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Cookies we use">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-neutral-400">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-300">
                <th className="py-3 pr-4 font-medium">Name / provider</th>
                <th className="py-3 pr-4 font-medium">Purpose</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              <tr>
                <td className="py-3 pr-4 align-top">Supabase auth session</td>
                <td className="py-3 pr-4 align-top">
                  Maintains secure sign-in state for authenticated users
                </td>
                <td className="py-3 pr-4 align-top">Strictly necessary</td>
                <td className="py-3 align-top">Session / configured expiry</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 align-top">Application session tokens</td>
                <td className="py-3 pr-4 align-top">
                  Enables document upload, analysis workflows, and CSRF protection
                </td>
                <td className="py-3 pr-4 align-top">Strictly necessary</td>
                <td className="py-3 align-top">Session</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 align-top">Vercel Analytics</td>
                <td className="py-3 pr-4 align-top">
                  Aggregated page views and Web Vitals on the marketing site
                </td>
                <td className="py-3 pr-4 align-top">Analytics</td>
                <td className="py-3 align-top">Up to 24 months (provider dependent)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Cookie names and durations may change as we update infrastructure. Material changes will be
          reflected in this Policy.
        </p>
      </LegalSection>

      <LegalSection title="5. Legal basis">
        <p>
          Strictly necessary cookies are used based on our legitimate interests in operating a secure
          B2B platform and, where applicable, to perform our contract with you. Analytics cookies on
          the marketing site are used based on legitimate interests in measuring and improving our
          website, balanced against your privacy rights.
        </p>
      </LegalSection>

      <LegalSection title="6. Managing cookies">
        <p>
          You can control cookies through your browser settings, including blocking or deleting
          cookies. Blocking strictly necessary cookies may prevent you from signing in or using core
          features of the platform.
        </p>
        <p>
          Most browsers allow you to review stored cookies, clear them, or enable &quot;Do Not
          Track&quot; signals. Refer to your browser&apos;s help documentation for instructions.
        </p>
      </LegalSection>

      <LegalSection title="7. Third-party cookies">
        <p>
          Some cookies are set by service providers that support hosting, authentication, and
          analytics. These providers process data under contractual terms requiring appropriate
          safeguards. We do not permit advertising or behavioural profiling cookies on the enterprise
          analysis platform.
        </p>
      </LegalSection>

      <LegalSection title="8. Updates and contact">
        <p>
          We may update this Cookie Policy from time to time. The &quot;Last updated&quot; date at
          the top of this page indicates when it was last revised.
        </p>
        <p>
          Questions about our use of cookies may be sent to:
          <br />
          Echt — Privacy
          <br />
          Email: privacy@echt.ai
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
