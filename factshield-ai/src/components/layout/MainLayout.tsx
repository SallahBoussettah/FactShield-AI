import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col">
      <header>
        <Navigation />
      </header>
      <main className="flex-grow pt-20">
        {children}
      </main>
      <footer className="bg-[var(--color-neutral-800)] text-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FactShield AI</h3>
              <p className="text-[var(--color-neutral-400)]">
                Fighting misinformation with cutting-edge AI technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" onClick={scrollToTop} className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" onClick={scrollToTop} className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/browser-extension" onClick={scrollToTop} className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Browser Extension</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" onClick={scrollToTop} className="text-[var(--color-neutral-400)] hover:text-white transition-colors">About</Link></li>
                <li><Link to="/blog" onClick={scrollToTop} className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/careers" onClick={scrollToTop} className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" onClick={scrollToTop} className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" onClick={scrollToTop} className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookie-policy" onClick={scrollToTop} className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--color-neutral-700)] mt-8 pt-8 text-center text-[var(--color-neutral-400)]">
            &copy; {new Date().getFullYear()} FactShield AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;