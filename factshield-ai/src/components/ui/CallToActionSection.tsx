import React from 'react';
import Button from './Button';

const CallToActionSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-8 md:p-12 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Making Informed Decisions Today
        </h2>
        <p className="text-xl mb-8 text-white/90">
          Join thousands of users who are already fighting misinformation with FactShield AI.
          Get started with our free trial - no credit card required.
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
            View Demo
          </Button>
        </div>
        <p className="mt-6 text-sm text-white/70">
          14-day free trial • No credit card required • Cancel anytime
        </p>
      </div>
    </div>
  );
};

export default CallToActionSection;