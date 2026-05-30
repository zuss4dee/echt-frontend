import type { Metadata } from "next";
import { LegalDocumentLayout, LegalSection } from "@/components/marketing/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Terms of Use — Echt",
  description:
    "Terms governing access to the Echt enterprise document verification platform for UK B2B customers.",
};

export default function TermsOfUsePage() {
  return (
    <LegalDocumentLayout title="Terms of Use">
      <LegalSection title="1. Agreement">
        <p>
          These Terms of Use (&quot;Terms&quot;) govern access to and use of the Echt platform,
          APIs, and related services (collectively, the &quot;Service&quot;) provided by Echt
          (&quot;Echt&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By registering
          for, accessing, or using the Service, you agree to these Terms on behalf of the
          organisation you represent (&quot;Customer&quot;, &quot;you&quot;).
        </p>
        <p>
          If you do not agree, you must not use the Service. Enterprise orders, statements of work,
          and data processing agreements may supplement these Terms and prevail in the event of
          conflict.
        </p>
      </LegalSection>

      <LegalSection title="2. Service description">
        <p>
          Echt provides AI-assisted forensic analysis of documents submitted for tenant referencing
          and related compliance workflows, including metadata inspection, tamper detection,
          integrity scoring, and structured reporting. Outputs are decision-support tools and do not
          constitute legal, financial, or tenancy advice.
        </p>
        <p>
          We may update features, models, or interfaces from time to time. Material changes affecting
          enterprise deployments will be communicated in accordance with your commercial agreement.
        </p>
      </LegalSection>

      <LegalSection title="3. Account eligibility and security">
        <p>
          The Service is offered to businesses and professional users only. You represent that you
          have authority to bind your organisation and that all registration information is accurate.
          You are responsible for safeguarding credentials, restricting access to authorised
          personnel, and promptly notifying us of suspected unauthorised use.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable use">
        <p>You agree not to, and not to permit others to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Upload documents or data without a lawful basis and appropriate notices to data subjects.
          </li>
          <li>
            Use the document verification engine to harass, discriminate, or make unlawful tenancy
            decisions contrary to applicable housing and equality law.
          </li>
          <li>
            Reverse engineer, decompile, scrape, or attempt to extract source code, models, or
            proprietary detection logic except where permitted by law.
          </li>
          <li>
            Circumvent usage limits, security controls, or authentication mechanisms.
          </li>
          <li>
            Resell, sublicense, or provide the Service to third parties except as expressly
            permitted in writing.
          </li>
          <li>
            Introduce malware, perform penetration testing without prior written consent, or
            interfere with Service availability.
          </li>
        </ul>
        <p>
          We may suspend or terminate access for violations that pose security, legal, or reputational
          risk.
        </p>
      </LegalSection>

      <LegalSection title="5. Customer data and confidentiality">
        <p>
          You retain all rights in documents and data you submit. You grant Echt a limited licence
          to process such data solely to provide and improve the Service as permitted by your
          agreement and our Privacy Policy.
        </p>
        <p>
          Each party will protect the other&apos;s confidential information using reasonable care and
          use it only for purposes of the relationship. Confidentiality obligations survive
          termination.
        </p>
      </LegalSection>

      <LegalSection title="6. Intellectual property">
        <p>
          Echt and its licensors own all rights, title, and interest in the Service, including
          software, algorithms, forensic methodologies, user interfaces, documentation, trademarks,
          and aggregated anonymised analytics. No rights are granted except as expressly stated.
        </p>
        <p>
          Feedback may be used by Echt without restriction or compensation. You may not remove
          proprietary notices or use Echt branding without prior written approval.
        </p>
      </LegalSection>

      <LegalSection title="7. Fees and payment">
        <p>
          Paid plans, founding partner programmes, and enterprise subscriptions are governed by the
          applicable order form or checkout terms. Fees are exclusive of VAT unless stated otherwise.
          Late payment may result in suspension after reasonable notice.
        </p>
      </LegalSection>

      <LegalSection title="8. Warranties and disclaimers">
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis to the
          fullest extent permitted by law. While Echt applies rigorous forensic techniques, we do
          not warrant that every forgery, anomaly, or misrepresentation will be detected, or that
          every authentic document will receive an unqualified pass. You remain responsible for
          final referencing decisions.
        </p>
        <p>
          Except as expressly set out in a signed enterprise agreement, we disclaim all implied
          warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of liability">
        <p>
          Nothing in these Terms excludes or limits liability that cannot be excluded under the laws
          of England and Wales, including liability for death or personal injury caused by
          negligence, fraud, or fraudulent misrepresentation.
        </p>
        <p>
          Subject to the foregoing, Echt shall not be liable for any indirect, incidental,
          consequential, special, or punitive damages, or for loss of profits, revenue, goodwill,
          data, or business opportunity, even if advised of the possibility of such losses.
        </p>
        <p>
          Echt&apos;s total aggregate liability arising out of or relating to the Service in any
          twelve-month period shall not exceed the greater of (a) the fees paid by you to Echt in
          that period or (b) one hundred pounds (£100), except where a higher cap is set in a
          signed enterprise agreement.
        </p>
      </LegalSection>

      <LegalSection title="10. Indemnity">
        <p>
          You will indemnify and hold harmless Echt against claims, losses, and expenses (including
          reasonable legal fees) arising from your breach of these Terms, unlawful uploads, misuse of
          outputs, or violation of third-party rights, except to the extent caused by Echt&apos;s
          gross negligence or wilful misconduct.
        </p>
      </LegalSection>

      <LegalSection title="11. Term and termination">
        <p>
          These Terms remain in effect while you use the Service. Either party may terminate in
          accordance with the applicable commercial agreement. We may suspend or terminate access
          immediately for material breach, non-payment, or legal compulsion. Provisions that by
          nature should survive (including IP, confidentiality, liability, and governing law) will
          survive termination.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing law and jurisdiction">
        <p>
          These Terms are governed by the laws of England and Wales. The courts of England and Wales
          shall have exclusive jurisdiction over any dispute arising out of or in connection with
          these Terms, subject to any mandatory arbitration or alternative dispute resolution
          provisions in an enterprise agreement.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Echt — Legal
          <br />
          Email: legal@echt.ai
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
