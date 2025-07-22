import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import CallToActionSection from '../components/ui/CallToActionSection';
import DemoSection from '../components/ui/DemoSection';
import FeatureShowcase from '../components/ui/FeatureShowcase';
import HeroSection from '../components/ui/HeroSection';
import TestimonialsSection from '../components/ui/TestimonialsSection';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      
      {/* All sections with consistent max-width */}
      <div className="max-w-6xl mx-auto px-4">
        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-[var(--color-neutral-800)]">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm animate-bounce-in" style={{ animationDelay: '0ms' }}>
              <div className="bg-[color-mix(in_srgb,var(--color-primary),transparent_90%)] w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[var(--color-primary)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Scan Content</h3>
              <p className="text-[var(--color-neutral-600)]">
                Our AI analyzes web content, documents, and social media posts to identify factual claims.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm animate-bounce-in" style={{ animationDelay: '150ms' }}>
              <div className="bg-[color-mix(in_srgb,var(--color-primary),transparent_90%)] w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[var(--color-primary)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verify Facts</h3>
              <p className="text-[var(--color-neutral-600)]">
                Claims are checked against trusted sources and databases to determine their accuracy.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm animate-bounce-in" style={{ animationDelay: '300ms' }}>
              <div className="bg-[color-mix(in_srgb,var(--color-primary),transparent_90%)] w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[var(--color-primary)]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-[var(--color-neutral-600)]">
                Receive clear indicators of content reliability with supporting evidence and alternative sources.
              </p>
            </div>
          </div>
        </section>
        
        {/* Demo Section */}
        <section className="mb-16">
          <DemoSection />
        </section>
        
        {/* Features Section */}
        <section className="mb-16">
          <FeatureShowcase />
        </section>
        
        {/* Testimonials Section */}
        <section className="mb-16">
          <TestimonialsSection />
        </section>
        
        {/* CTA Section */}
        <section className="mb-16">
          <CallToActionSection />
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage;