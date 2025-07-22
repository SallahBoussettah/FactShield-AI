import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

const BrowserExtensionPage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">FactShield Browser Extension</h1>
            <p className="text-xl text-[var(--color-neutral-600)] mb-8">
              Get real-time fact-checking as you browse the web. Our browser extension highlights potentially misleading content and provides instant verification.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg">
                Add to Chrome
              </Button>
              <Button variant="outline" size="lg">
                Add to Firefox
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-[var(--color-neutral-50)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Extension Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[var(--color-primary-100)] text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Analysis</h3>
              <p className="text-[var(--color-neutral-600)]">
                Automatically analyzes web content as you browse and highlights potentially misleading information.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[var(--color-primary-100)] text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Verification</h3>
              <p className="text-[var(--color-neutral-600)]">
                Click on highlighted content to get detailed fact-checking information with sources and evidence.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[var(--color-primary-100)] text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
              <p className="text-[var(--color-neutral-600)]">
                Your browsing data stays private. We only analyze content you choose to fact-check.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Install Extension</h3>
                <p className="text-[var(--color-neutral-600)]">
                  Add FactShield to your browser from the Chrome Web Store or Firefox Add-ons.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Browse Normally</h3>
                <p className="text-[var(--color-neutral-600)]">
                  Continue browsing as usual. The extension works silently in the background.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Alerts</h3>
                <p className="text-[var(--color-neutral-600)]">
                  Potentially misleading content is highlighted with detailed fact-checking information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browser Support */}
      <section className="py-12 bg-[var(--color-neutral-50)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Browser Support</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#4285f4] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h3 className="font-semibold">Chrome</h3>
                <p className="text-sm text-[var(--color-neutral-600)]">Version 88+</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#ff9500] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h3 className="font-semibold">Firefox</h3>
                <p className="text-sm text-[var(--color-neutral-600)]">Version 85+</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#0078d4] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h3 className="font-semibold">Edge</h3>
                <p className="text-sm text-[var(--color-neutral-600)]">Version 88+</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm opacity-50">
              <div className="w-12 h-12 bg-[#1d1d1f] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h3 className="font-semibold">Safari</h3>
                <p className="text-sm text-[var(--color-neutral-600)]">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Fact-Checking Today</h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of users who are already using FactShield AI to navigate the information landscape with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  className="bg-white text-[var(--color-primary)] hover:bg-white/90 border-white"
                  size="lg"
                >
                  Add to Chrome
                </Button>
                <Button 
                  variant="ghost"
                  className="text-white border border-white/30 hover:bg-white/10"
                  size="lg"
                >
                  Add to Firefox
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/70">
                Free to install • Works on all major websites • Privacy protected
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default BrowserExtensionPage;