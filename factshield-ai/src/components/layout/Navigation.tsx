import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  transparent?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`w-full fixed top-0 z-50 transition-all duration-300 ${transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[var(--color-primary)]">FactShield AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <Link to="/" onClick={scrollToTop} className="text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors">
                Home
              </Link>
              <Link to="/features" onClick={scrollToTop} className="text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors">
                Features
              </Link>
              <Link to="/pricing" onClick={scrollToTop} className="text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors">
                Pricing
              </Link>
              <Link to="/about" onClick={scrollToTop} className="text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors">
                About
              </Link>
            </div>
            
            {/* Authentication Buttons */}
            {authState.isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-2 rounded-md text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)] transition-colors"
                  aria-expanded={isUserMenuOpen}
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white">
                    {authState.user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{authState.user?.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-[var(--color-neutral-200)]">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-primary)]"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/dashboard?section=settings" 
                      className="block px-4 py-2 text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-primary)]"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        // The dashboard will handle the section change based on URL parameter
                      }}
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-danger)]"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" onClick={scrollToTop}>
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/register" onClick={scrollToTop}>
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden starting:opacity-0 starting:max-h-0 ${
            isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-4 pt-4 pb-6 border-t border-[var(--color-neutral-200)]">
            <Link 
              to="/" 
              className="px-2 py-2 text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-50)] rounded-md transition-colors"
              onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="px-2 py-2 text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-50)] rounded-md transition-colors"
              onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="px-2 py-2 text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-50)] rounded-md transition-colors"
              onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="px-2 py-2 text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-50)] rounded-md transition-colors"
              onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
            >
              About
            </Link>
            
            {/* Mobile Authentication */}
            {authState.isAuthenticated ? (
              <>
                <div className="px-2 py-2 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white">
                    {authState.user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[var(--color-neutral-700)]">{authState.user?.name}</span>
                </div>
                <Link 
                  to="/dashboard" 
                  className="px-2 py-2 text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-50)] rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/dashboard?section=settings" 
                  className="px-2 py-2 text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-50)] rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="px-2 py-2 text-left text-[var(--color-danger)] hover:bg-[var(--color-neutral-50)] rounded-md transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={() => { setIsMenuOpen(false); scrollToTop(); }}>
                  <Button variant="outline" className="w-full justify-center">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => { setIsMenuOpen(false); scrollToTop(); }}>
                  <Button className="w-full justify-center">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;