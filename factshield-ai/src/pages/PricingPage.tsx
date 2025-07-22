import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-[var(--color-neutral-600)] mb-8">
              Choose the plan that's right for you and start fighting misinformation today.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className={`mr-3 ${isAnnual ? 'font-semibold' : 'text-[var(--color-neutral-600)]'}`}>
                Annual Billing
                {isAnnual && <span className="ml-2 text-xs py-0.5 px-2 bg-[var(--color-secondary)] text-white rounded-full font-bold">Save 20%</span>}
              </span>
              <button 
                onClick={toggleBilling}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--color-neutral-400)]"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition shadow-md ${!isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`ml-3 ${!isAnnual ? 'font-semibold' : 'text-[var(--color-neutral-600)]'}`}>
                Monthly Billing
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[var(--color-neutral-200)]">
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <p className="text-[var(--color-neutral-600)] mb-6">Basic protection for casual browsing</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-[var(--color-neutral-500)]">/month</span>
                </div>
                <Button 
                  className="w-full mb-6 bg-[var(--color-primary)] text-white hover:bg-[color-mix(in_srgb,var(--color-primary),black_10%)]"
                >
                  Get Started
                </Button>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Browser extension</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic fact checking</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>10 URL checks per day</span>
                  </li>
                  <li className="flex items-start text-[var(--color-neutral-400)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-neutral-300)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Document analysis</span>
                  </li>
                  <li className="flex items-start text-[var(--color-neutral-400)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-neutral-300)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Analytics dashboard</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[var(--color-primary)] relative transform md:scale-105 z-10">
              <div className="bg-[var(--color-primary)] text-white text-center py-2 text-sm font-semibold">
                MOST POPULAR
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-[var(--color-neutral-600)] mb-6">Advanced protection for daily use</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${isAnnual ? '9.99' : '12.99'}</span>
                  <span className="text-[var(--color-neutral-500)]">/month</span>
                </div>
                <Button 
                  className="w-full mb-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:opacity-90"
                >
                  Get Started
                </Button>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced fact checking</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited URL checks</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Document analysis (10/month)</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic analytics dashboard</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[var(--color-neutral-200)]">
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <p className="text-[var(--color-neutral-600)] mb-6">Complete protection for organizations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${isAnnual ? '29.99' : '39.99'}</span>
                  <span className="text-[var(--color-neutral-500)]">/month</span>
                </div>
                <Button 
                  variant="outline"
                  className="w-full mb-6 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-neutral-50)]"
                >
                  Contact Sales
                </Button>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Team management</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited document analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-success)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[var(--color-neutral-50)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Can I switch plans later?</h3>
              <p className="text-[var(--color-neutral-600)]">
                Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Is there a free trial?</h3>
              <p className="text-[var(--color-neutral-600)]">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-[var(--color-neutral-600)]">
                We accept all major credit cards, PayPal, and for Enterprise customers, we also offer invoicing.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Can I cancel my subscription?</h3>
              <p className="text-[var(--color-neutral-600)]">
                Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Do you offer discounts for educational institutions?</h3>
              <p className="text-[var(--color-neutral-600)]">
                Yes, we offer special pricing for educational institutions and non-profit organizations. Please contact our sales team for more information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of users who are already using FactShield AI to navigate the information landscape with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  className="bg-white text-[var(--color-primary)] hover:bg-white/90 border-white"
                  size="lg"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="ghost"
                  className="text-white border border-white/30 hover:bg-white/10"
                  size="lg"
                >
                  Contact Sales
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/70">
                14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PricingPage;