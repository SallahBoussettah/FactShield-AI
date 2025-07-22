import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const CookiePolicyPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          <p className="text-[var(--color-neutral-600)] mb-8">
            Last updated: January 22, 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
              <p className="text-[var(--color-neutral-700)]">
                FactShield AI uses cookies and similar tracking technologies to enhance your experience on our website and browser extension.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                We use cookies for several purposes:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] space-y-2">
                <li>To provide essential website functionality</li>
                <li>To remember your preferences and settings</li>
                <li>To analyze website traffic and usage patterns</li>
                <li>To improve our services and user experience</li>
                <li>To provide personalized content and recommendations</li>
                <li>To measure the effectiveness of our marketing campaigns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Essential Cookies</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and authentication. The website cannot function properly without these cookies.
              </p>
              <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg mb-4">
                <p className="text-sm text-[var(--color-neutral-600)]">
                  <strong>Examples:</strong> Session cookies, authentication tokens, security cookies
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3">3.2 Functional Cookies</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
              </p>
              <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg mb-4">
                <p className="text-sm text-[var(--color-neutral-600)]">
                  <strong>Examples:</strong> Language preferences, theme settings, user interface customizations
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3">3.3 Analytics Cookies</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.
              </p>
              <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg mb-4">
                <p className="text-sm text-[var(--color-neutral-600)]">
                  <strong>Examples:</strong> Google Analytics, page view tracking, user behavior analysis
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3">3.4 Marketing Cookies</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                These cookies are used to track visitors across websites to display relevant and engaging advertisements. They may also be used to limit the number of times you see an advertisement.
              </p>
              <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg mb-4">
                <p className="text-sm text-[var(--color-neutral-600)]">
                  <strong>Examples:</strong> Advertising cookies, social media tracking, conversion tracking
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                We may use third-party services that set cookies on your device. These include:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">4.1 Google Analytics</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                We use Google Analytics to analyze website traffic and user behavior. Google Analytics uses cookies to collect information about your use of our website.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">4.2 Social Media Platforms</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                Our website may include social media features that may set cookies to enable proper functionality and track usage.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">4.3 Payment Processors</h3>
              <p className="text-[var(--color-neutral-700)]">
                When you make payments through our website, our payment processors may set cookies to facilitate secure transactions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Cookie Duration</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                Cookies can be either session cookies or persistent cookies:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">5.1 Session Cookies</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                These cookies are temporary and are deleted when you close your browser. They are used to maintain your session while you navigate our website.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">5.2 Persistent Cookies</h3>
              <p className="text-[var(--color-neutral-700)]">
                These cookies remain on your device for a set period or until you delete them. They are used to remember your preferences and provide a personalized experience across visits.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Managing Your Cookie Preferences</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                You have several options for managing cookies:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">6.1 Browser Settings</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] mb-4 space-y-2">
                <li>Block all cookies</li>
                <li>Block third-party cookies</li>
                <li>Delete existing cookies</li>
                <li>Set preferences for specific websites</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">6.2 Cookie Consent Banner</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                When you first visit our website, you'll see a cookie consent banner where you can choose which types of cookies to accept.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">6.3 Opt-Out Links</h3>
              <p className="text-[var(--color-neutral-700)] mb-4">
                For certain third-party cookies, you can opt out directly:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] space-y-2">
                <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-[var(--color-primary)] hover:underline">Google Analytics Opt-out</a></li>
                <li>Advertising cookies: <a href="http://www.aboutads.info/choices/" className="text-[var(--color-primary)] hover:underline">Digital Advertising Alliance</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Impact of Disabling Cookies</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                If you choose to disable cookies, some features of our website may not function properly:
              </p>
              <ul className="list-disc list-inside text-[var(--color-neutral-700)] space-y-2">
                <li>You may need to log in repeatedly</li>
                <li>Your preferences may not be saved</li>
                <li>Some personalized features may not work</li>
                <li>Website performance may be affected</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Browser-Specific Instructions</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                Here's how to manage cookies in popular browsers:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Chrome</h4>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    Settings → Privacy and security → Cookies and other site data
                  </p>
                </div>
                
                <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Firefox</h4>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    Options → Privacy & Security → Cookies and Site Data
                  </p>
                </div>
                
                <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Safari</h4>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    Preferences → Privacy → Manage Website Data
                  </p>
                </div>
                
                <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Edge</h4>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    Settings → Cookies and site permissions → Cookies and site data
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Updates to This Policy</h2>
              <p className="text-[var(--color-neutral-700)]">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-[var(--color-neutral-700)] mb-4">
                If you have any questions about our use of cookies, please contact us:
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

export default CookiePolicyPage;