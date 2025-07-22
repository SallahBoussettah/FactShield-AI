import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-[var(--color-neutral-600)] mb-8">
            Last updated: January 22, 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                FactShield AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, browser extension, and services (collectively, the "Service").
              </p>
              <p className="text-[var(--color-neutral-700)]">
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] mb-4 space-y-2">
                <li>Register for an account</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for support</li>
                <li>Participate in surveys or feedback</li>
              </ul>
              <p className="text-[var(--color-neutral-700)] mb-4">
                This information may include your name, email address, and any other information you choose to provide.
              </p>

              <h3 className="text-xl font-semibold mb-3">2.2 Usage Information</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                We automatically collect certain information when you use our Service, including:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] mb-4 space-y-2">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.3 Content Analysis Data</h3>
              <p className="text-[var(--color-neutral-700)]">
                When you use our fact-checking services, we may process the content you submit for analysis. This content is processed to provide fact-checking results and is not stored permanently unless necessary for service improvement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] space-y-2">
                <li>Provide, operate, and maintain our Service</li>
                <li>Improve and personalize your experience</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative information and updates</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns and improve our Service</li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] space-y-2">
                <li>With your explicit consent</li>
                <li>To service providers who assist us in operating our Service</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-[var(--color-neutral-700)]">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
              <p className="text-[var(--color-neutral-700)]">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-[var(--color-neutral-700)]">
                We use cookies and similar tracking technologies to enhance your experience on our Service. For more information about our use of cookies, please see our Cookie Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Third-Party Links</h2>
              <p className="text-[var(--color-neutral-700)]">
                Our Service may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
              <p className="text-[var(--color-neutral-700)]">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
              <p className="text-[var(--color-neutral-700)]">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-[var(--color-neutral-700)]">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none text-[var(--color-neutral-700)] space-y-2">
                <li>Email: privacy@factshield.ai</li>
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

export default PrivacyPolicyPage;