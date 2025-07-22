import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const TermsOfServicePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-[var(--color-neutral-600)] mb-8">
            Last updated: January 22, 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                By accessing and using FactShield AI's website, browser extension, and services (collectively, the "Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p className="text-[var(--color-neutral-700)]">
                If you do not agree to abide by the above, please do not use this Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                FactShield AI provides AI-powered fact-checking services through our website and browser extension. Our Service analyzes content to identify potentially misleading information and provides credibility assessments.
              </p>
              <p className="text-[var(--color-neutral-700)]">
                The Service is provided "as is" and we make no warranties regarding the accuracy, completeness, or reliability of our fact-checking results.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                To access certain features of our Service, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] mb-4 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.2 Account Termination</h3>
              <p className="text-[var(--color-neutral-700)]">
                We reserve the right to terminate or suspend your account at any time for violations of these Terms or for any other reason at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful, offensive, or illegal content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Use the Service for commercial purposes without permission</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Create derivative works based on our Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of FactShield AI and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
              <p className="text-[var(--color-neutral-700)]">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without our prior written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. User Content</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                By submitting content to our Service for fact-checking, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and analyze such content solely for the purpose of providing our fact-checking services.
              </p>
              <p className="text-[var(--color-neutral-700)]">
                You represent and warrant that you have the right to submit such content and that it does not violate any third-party rights or applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Privacy</h2>
              <p className="text-[var(--color-neutral-700)]">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Disclaimers</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, FactShield AI:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] space-y-2">
                <li>Excludes all representations and warranties relating to this Service</li>
                <li>Does not guarantee the accuracy of fact-checking results</li>
                <li>Is not responsible for decisions made based on our analysis</li>
                <li>Does not warrant that the Service will be uninterrupted or error-free</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p className="text-[var(--color-neutral-700)]">
                In no event shall FactShield AI, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
              <p className="text-[var(--color-neutral-700)]">
                You agree to defend, indemnify, and hold harmless FactShield AI and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Subscription and Billing</h2>
              
              <h3 className="text-xl font-semibold mb-3">11.1 Paid Services</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                Some features of our Service may require payment. By purchasing a subscription, you agree to pay all applicable fees as described on our pricing page.
              </p>

              <h3 className="text-xl font-semibold mb-3">11.2 Billing</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                Subscription fees are billed in advance on a recurring basis. You authorize us to charge your payment method for all applicable fees.
              </p>

              <h3 className="text-xl font-semibold mb-3">11.3 Cancellation</h3>
              <p className="text-[var(--color-neutral-700)]">
                You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
              <p className="text-[var(--color-neutral-700)]">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
              <p className="text-[var(--color-neutral-700)]">
                These Terms shall be interpreted and governed by the laws of the State of California, United States, without regard to conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Changes to Terms</h2>
              <p className="text-[var(--color-neutral-700)]">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none text-[var(--color-neutral-700)] space-y-2">
                <li>Email: legal@factshield.ai</li>
                <li>Address: 123 Tech Lane, San Francisco, CA 94107</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfServicePage;