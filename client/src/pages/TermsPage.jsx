import React from 'react';
import { ShieldCheck, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#111111] py-16 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#8E722A] hover:text-[#111111] uppercase tracking-wider no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>

        {/* Page Header */}
        <div className="border-b border-[#0A0A0A]/10 pb-6 space-y-2">
          <span className="font-mono text-xs font-bold text-[#8E722A] uppercase tracking-widest block">
            LEGAL & GOVERNANCE
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#111111] tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm font-mono text-[#66615A]">
            Effective Date: September 27, 2026 • Version 1.0
          </p>
        </div>

        {/* Production Legal Notice Disclaimer Banner */}
        <div className="p-4 bg-[#FAF8F3] border-l-4 border-l-[#8E722A] border border-[#0A0A0A]/10 rounded-sm text-xs font-mono text-[#66615A] space-y-1">
          <div className="flex items-center gap-2 font-bold text-[#111111] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#8E722A]" />
            <span>Important Production Notice</span>
          </div>
          <p>
            This document outlines the operational standard terms for ASN Media's digital agency and administrative management platform. This notice is provided for informational and structure demonstration purposes and should be formally reviewed by qualified business or legal counsel prior to formal execution.
          </p>
        </div>

        {/* Main Content Body */}
        <div className="prose prose-stone max-w-none text-sm text-[#221C11] leading-relaxed space-y-8 font-body">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              1. Introduction
            </h2>
            <p>
              Welcome to ASN Media (“Agency”, “we”, “us”, or “our”). These Terms & Conditions govern your access to and use of the ASN Media website, client portal, administrative dashboard, and associated marketing, branding, video production, and social media retainer services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              2. Definitions
            </h2>
            <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-[#444]">
              <li><strong>“Client”</strong>: Any business entity, brand, or individual engaging ASN Media for services.</li>
              <li><strong>“Services”</strong>: Social media management, video production, brand strategy, content creation, and review monitoring.</li>
              <li><strong>“Platform”</strong>: The website, admin panel, and client portal accessible under the ASN Media web domain.</li>
              <li><strong>“Deliverables”</strong>: Media assets, video master files, campaign copybooks, and strategy playbooks created for the Client.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              3. Use of the Platform
            </h2>
            <p>
              By accessing our Platform or entering into a Service Agreement, you represent and warrant that you possess the legal authority to bind your organization to these Terms and comply with all applicable local and international laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              4. Accounts & Access
            </h2>
            <p>
              Access to administrative and portal dashboards requires valid credentials. You are responsible for maintaining the confidentiality of your login credentials and for all actions conducted under your user profile. ASN Media reserves the right to suspend unauthorized or compromised accounts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              5. Client Information & Media Assets
            </h2>
            <p>
              Clients retain full ownership of pre-existing intellectual property, logos, and raw brand assets uploaded to the Platform. Clients grant ASN Media a limited license to utilize such materials solely for executing the agreed-upon project deliverables.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              6. Services & Projects Scope
            </h2>
            <p>
              All service deliverables, scope boundaries, revision cycles, and milestone schedules shall be set forth in an executed Statement of Work (SOW) or Monthly Retainer Package agreement. Scope expansion beyond agreed parameters will require formal change approval.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              7. Payments & Billing
            </h2>
            <p>
              Retainer fees and project invoices are due in accordance with the payment terms specified in the invoice. Late payments may be subject to service hold or grace period reminders. All fees are quoted in INR (₹) unless specified otherwise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              8. Intellectual Property
            </h2>
            <p>
              Upon full settlement of invoice balances, ASN Media transfers final usage rights for custom campaign deliverables to the Client. ASN Media retains the right to display non-confidential project highlights within agency portfolio showcases.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              9. Confidentiality
            </h2>
            <p>
              Both parties agree to hold proprietary marketing strategies, financial figures, audience metrics, and non-public data in strict confidence and prevent unauthorized third-party disclosure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              10. Third-Party Services
            </h2>
            <p>
              Our Platform may integrate with third-party tools, including Google Business APIs, social media network APIs, and hosting infrastructures. ASN Media is not liable for service interruptions originating from third-party platform policy modifications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              11. Data & Privacy
            </h2>
            <p>
              We process personal contact data and agency workflow metadata in compliance with our Privacy Policy. Data transmission is secured using industry-standard encryption practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              12. Prohibited Activities
            </h2>
            <p>
              Users are strictly prohibited from reverse-engineering dashboard analytics scripts, initiating denial-of-service attacks, uploading malicious code, or utilizing Platform tools for unlawful propaganda.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              13. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, ASN Media shall not be liable for indirect, incidental, or consequential damages arising from campaign performance metrics or third-party platform algorithm alterations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              14. Termination
            </h2>
            <p>
              Either party may terminate monthly retainer agreements by providing 30 days written notice. Outstanding fees accrued prior to effective termination remain payable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              15. Changes to Terms
            </h2>
            <p>
              ASN Media reserves the right to amend these Terms from time to time. Updated versions will be published on the Platform with a revised effective timestamp.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              16. Governing Law
            </h2>
            <p>
              These Terms are governed by and construed in accordance with applicable state and federal commercial jurisdiction frameworks, without regard to conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#111111] border-b border-[#0A0A0A]/08 pb-1">
              17. Contact Information
            </h2>
            <p>
              For legal inquiries or contractual clarifications, please contact our administrative desk at{' '}
              <a href="mailto:contact@asnmedia.in" className="text-[#8E722A] underline font-mono">
                contact@asnmedia.in
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
