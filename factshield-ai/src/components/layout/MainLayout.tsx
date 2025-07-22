import React from 'react';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col">
      <header>
        <Navigation />
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
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
                <li><a href="#" className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Browser Extension</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[var(--color-neutral-400)] hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-[var(--color-neutral-400)] hover:text-white transition-colors">Cookie Policy</a></li>
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