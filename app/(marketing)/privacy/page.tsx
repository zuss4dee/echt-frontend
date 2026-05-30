import type { Metadata } from "next";
import { LegalDocumentLayout, LegalSection } from "@/components/marketing/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Echt",
  description:
    "How Echt processes personal data and tenant documents on behalf of UK letting agencies under UK GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout title="Privacy Policy">
      <LegalSection title="1. Introduction">
        <p>
          This Privacy Policy explains how Echt (&quot;Echt&quot;, &quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) collects, uses, stores, and protects personal data when you access our
          AI document fraud detection platform and related services (the &quot;Service&quot;).
        </p>
        <p>
          Echt provides business-to-business (&quot;B2B&quot;) software to letting agencies, property
          managers, and other enterprise customers in the United Kingdom. We are committed to
          compliance with the UK General Data Protection Regulation (&quot;UK GDPR&quot;), the Data
          Protection Act 2018, and applicable privacy laws.
        </p>
      </LegalSection>

      <LegalSection title="2. Roles and responsibilities">
        <p>
          In most cases, your organisation (the &quot;Customer&quot;) is the data controller for
          personal data contained in tenant referencing documents and related case files. Echt acts
          as a data processor when we analyse documents, generate forensic outputs, and store
          results on your instructions.
        </p>
        <p>
          Where Echt collects account, billing, or support information directly from authorised
          users at a Customer organisation, Echt may act as an independent controller for that
          administrative data. A Data Processing Agreement (&quot;DPA&quot;) is available to
          enterprise Customers on request and forms part of our contractual relationship where
          applicable.
        </p>
      </LegalSection>

      <LegalSection title="3. Categories of data we process">
        <p>Depending on how you use the Service, we may process:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-neutral-300">Account and contact data</strong> — names, work
            email addresses, job titles, authentication credentials, and audit logs relating to
            authorised users.
          </li>
          <li>
            <strong className="text-neutral-300">Tenant and applicant documents</strong> — payslips,
            bank statements, identity documents, references, and other files uploaded for
            verification. These may contain special category data and financial information.
          </li>
          <li>
            <strong className="text-neutral-300">Derived forensic outputs</strong> — metadata
            extractions, integrity scores, tamper indicators, verdicts, and structured analysis
            reports generated from uploaded files.
          </li>
          <li>
            <strong className="text-neutral-300">Technical and security data</strong> — IP
            addresses, device identifiers, session tokens, error logs, and usage telemetry necessary
            to operate, secure, and improve the Service.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Purposes and lawful bases">
        <p>We process personal data for the following purposes:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            To perform our contract with the Customer and deliver document verification services
            (lawful basis: performance of a contract; Article 6(1)(b) UK GDPR).
          </li>
          <li>
            To detect document fraud, forgery, and manipulation on behalf of the Customer (lawful
            basis: legitimate interests of the Customer and, where applicable, explicit instructions
            under contract).
          </li>
          <li>
            To maintain platform security, prevent abuse, and meet legal obligations (lawful basis:
            legitimate interests and legal obligation).
          </li>
          <li>
            Where special category data is processed within uploaded documents, processing is
            carried out strictly on the documented instructions of the Customer as controller, for
            substantial public interest in preventing fraud in housing and tenancy decisions, or
            other lawful basis identified in the DPA.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Processing tenant documents on your behalf">
        <p>
          When you upload documents relating to prospective or existing tenants, Echt processes
          those files solely to provide forensic analysis and related outputs you request. We do not
          use tenant document content to train public-facing AI models unless explicitly agreed in
          writing with the Customer.
        </p>
        <p>
          Customers are responsible for providing appropriate privacy notices to data subjects,
          establishing a lawful basis for referencing checks, and ensuring uploads are limited to
          what is necessary for tenancy decisions. Echt implements technical and organisational
          measures designed to protect sensitive documents, including encryption in transit, access
          controls, and configurable retention options where offered.
        </p>
      </LegalSection>

      <LegalSection title="6. Retention">
        <p>
          We retain personal data only for as long as necessary to fulfil the purposes described in
          this Policy, our agreement with the Customer, or applicable law. Document retention
          periods may be configured by the Customer or defined in the DPA. Upon termination of
          services, we will delete or return Customer data in accordance with contractual terms,
          subject to limited backup retention and legal hold requirements.
        </p>
      </LegalSection>

      <LegalSection title="7. Sharing and sub-processors">
        <p>
          We do not sell personal data. We may share data with infrastructure providers, security
          vendors, and professional advisers who process data on our behalf under written
          agreements requiring UK GDPR–equivalent protections. A list of material sub-processors is
          available to Customers on request.
        </p>
        <p>
          We may disclose information where required by law, court order, or to protect the rights,
          property, or safety of Echt, our Customers, or others.
        </p>
      </LegalSection>

      <LegalSection title="8. International transfers">
        <p>
          Echt is established in the United Kingdom. If personal data is transferred outside the UK,
          we implement appropriate safeguards such as the UK International Data Transfer Agreement
          or other mechanisms approved under UK data protection law.
        </p>
      </LegalSection>

      <LegalSection title="9. Security">
        <p>
          We maintain administrative, technical, and physical safeguards appropriate to the nature of
          the data processed, including role-based access, monitoring, and secure development
          practices. No method of transmission or storage is completely secure; Customers should
          also implement internal controls over user access and document handling.
        </p>
      </LegalSection>

      <LegalSection title="10. Your rights">
        <p>
          Where Echt acts as processor, data subjects should direct requests to exercise UK GDPR
          rights (access, rectification, erasure, restriction, objection, and data portability, as
          applicable) to the Customer organisation that collected their information.
        </p>
        <p>
          Where Echt is controller of account or support data, you may contact us using the details
          below. You also have the right to lodge a complaint with the Information Commissioner&apos;s
          Office (ICO) at{" "}
          <a
            href="https://ico.org.uk"
            className="text-neutral-300 underline underline-offset-4 hover:text-white"
          >
            ico.org.uk
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          For privacy enquiries, Data Processing Agreements, or sub-processor information, contact:
        </p>
        <p>
          Echt — Privacy
          <br />
          Email: privacy@echt.ai
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
