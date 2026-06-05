import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, User, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { getPath } from '../lib/routes';
import { Button } from './ui/Button';

const aboutDropdownItems = [
  { id: 'about', label: 'About Us' },
  { id: 'expert-instructors', label: 'Expert Instructors' },
];

const dropdownItems = [
  { id: 'programs', label: 'Training Programs' },
  { id: 'services', label: 'Services' },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [howWeHelpOpen, setHowWeHelpOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileHowWeHelpOpen, setMobileHowWeHelpOpen] = useState(false);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useAppNavigate();
  const { pathname } = useLocation();

  const navItems = [
    { id: 'impact', label: 'Our Impact' },
    { id: 'heroes', label: 'Heroes Directory' },
    { id: 'partnership', label: 'Partnership' },
    { id: 'patches', label: 'Join the Mission' },
  ];

  const isActive = (pageId: string) => pathname === getPath(pageId);
  const isAboutActive = isActive('about') || isActive('expert-instructors');
  const isHowWeHelpActive = isActive('programs') || isActive('services');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHowWeHelpOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (pageId: string) => {
    navigate(pageId);
    setMobileMenuOpen(false);
    setAboutOpen(false);
    setHowWeHelpOpen(false);
    setMobileAboutOpen(false);
    setMobileHowWeHelpOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('home');
  };

  return (
    <nav className="bg-white border-b-2 border-brand-marine sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/Project22_logo.png"
              alt="Project 22"
              className="h-14 w-auto"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <div ref={aboutDropdownRef} className="relative">
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className={`font-semibold uppercase text-sm tracking-wide transition-colors duration-200 flex items-center gap-1 ${
                  isAboutActive
                    ? 'text-brand-scarlet'
                    : 'text-brand-marine hover:text-brand-scarlet'
                }`}
              >
                About
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`} />
              </button>

              {aboutOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-brand shadow-xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-slate-200 rotate-45" />
                  {aboutDropdownItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`block w-full text-left px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors duration-150 ${
                        isActive(item.id)
                          ? 'text-brand-scarlet bg-red-50'
                          : 'text-brand-marine hover:text-brand-scarlet hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setHowWeHelpOpen(!howWeHelpOpen)}
                className={`font-semibold uppercase text-sm tracking-wide transition-colors duration-200 flex items-center gap-1 ${
                  isHowWeHelpActive
                    ? 'text-brand-scarlet'
                    : 'text-brand-marine hover:text-brand-scarlet'
                }`}
              >
                How We Help
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${howWeHelpOpen ? 'rotate-180' : ''}`} />
              </button>

              {howWeHelpOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-brand shadow-xl border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-slate-200 rotate-45" />
                  {dropdownItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`block w-full text-left px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors duration-150 ${
                        isActive(item.id)
                          ? 'text-brand-scarlet bg-red-50'
                          : 'text-brand-marine hover:text-brand-scarlet hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-semibold uppercase text-sm tracking-wide transition-colors duration-200 ${
                  isActive(item.id)
                    ? 'text-brand-scarlet'
                    : 'text-brand-marine hover:text-brand-scarlet'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavClick('portal')}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Portal
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleNavClick('login')}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Donor Login
              </Button>
            )}
            <Button
              onClick={() => handleNavClick('donate')}
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Donate Now
            </Button>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-brand-marine bg-white">
          <div className="px-4 py-4 space-y-1">
            <div>
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-brand transition-colors duration-200 font-semibold uppercase text-sm tracking-wide ${
                  isAboutActive
                    ? 'bg-red-50 text-brand-scarlet'
                    : 'text-brand-marine hover:bg-slate-50'
                }`}
              >
                About
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileAboutOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-brand-scarlet pl-4">
                  {aboutDropdownItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`block w-full text-left px-4 py-2 rounded-brand text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
                        isActive(item.id)
                          ? 'bg-red-50 text-brand-scarlet'
                          : 'text-brand-marine hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setMobileHowWeHelpOpen(!mobileHowWeHelpOpen)}
                className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-brand transition-colors duration-200 font-semibold uppercase text-sm tracking-wide ${
                  isHowWeHelpActive
                    ? 'bg-red-50 text-brand-scarlet'
                    : 'text-brand-marine hover:bg-slate-50'
                }`}
              >
                How We Help
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileHowWeHelpOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileHowWeHelpOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-brand-scarlet pl-4">
                  {dropdownItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`block w-full text-left px-4 py-2 rounded-brand text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
                        isActive(item.id)
                          ? 'bg-red-50 text-brand-scarlet'
                          : 'text-brand-marine hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-2 rounded-brand transition-colors duration-200 font-semibold uppercase text-sm tracking-wide ${
                  isActive(item.id)
                    ? 'bg-red-50 text-brand-scarlet'
                    : 'text-brand-marine hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-200 space-y-3">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleNavClick('portal')}
                    className="flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    My Portal
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => handleNavClick('login')}
                  className="flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Donor Login
                </Button>
              )}
              <Button
                fullWidth
                onClick={() => handleNavClick('donate')}
                className="flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Donate Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
