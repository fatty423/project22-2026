import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Heart, LayoutDashboard, Star } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [donorName, setDonorName] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      supabase
        .from('donors')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.full_name) setDonorName(data.full_name);
        });
    } else {
      setDonorName(null);
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setIsMenuOpen(false);
    await signOut();
  };

  const displayName = donorName || user?.email?.split('@')[0] || 'Account';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img src="/Project22_logo.png" alt="Project 22" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-brand-scarlet transition-colors text-sm font-medium">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-brand-scarlet transition-colors text-sm font-medium flex items-center gap-1">
                About
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-brand-scarlet">
                  About Us
                </Link>
                <Link to="/impact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-brand-scarlet">
                  Impact
                </Link>
              </div>
            </div>
            <Link to="/programs" className="text-gray-700 hover:text-brand-scarlet transition-colors text-sm font-medium">
              Programs
            </Link>
            <Link to="/heroes" className="text-gray-700 hover:text-brand-scarlet transition-colors text-sm font-medium">
              Heroes
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-brand-scarlet transition-colors text-sm font-medium">
              Contact
            </Link>
            <Link to="/partner-patches" className="text-brand-gold hover:text-brand-scarlet transition-colors text-sm font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-brand-gold" />
              Earn Your Patch
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/donate">
                  <Button size="sm" className="flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5" />
                    Donate
                  </Button>
                </Link>

                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-marine/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-3.5 w-3.5 text-brand-marine" />
                    </div>
                    <span className="max-w-[120px] truncate">{displayName}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">{donorName || 'Donor'}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/portal"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-400" />
                          My Portal
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 py-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/donate">
                  <Button size="sm" className="flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5" />
                    Donate
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-6">
            <div className="flex flex-col space-y-1">
              <Link to="/" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/about" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/impact" className="px-3 py-2 pl-7 rounded-lg text-gray-500 hover:bg-slate-50 transition-colors text-sm" onClick={() => setIsMenuOpen(false)}>
                Impact
              </Link>
              <Link to="/programs" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Programs
              </Link>
              <Link to="/heroes" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Heroes
              </Link>
              <Link to="/contact" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/partner-patches" className="px-3 py-2 rounded-lg text-brand-gold font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5" onClick={() => setIsMenuOpen(false)}>
                <Star className="w-3.5 h-3.5 fill-brand-gold" />
                Earn Your Patch
              </Link>

              <div className="pt-3 mt-2 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-marine/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-brand-marine" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/portal"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      My Portal
                    </Link>
                    <Link to="/donate" onClick={() => setIsMenuOpen(false)}>
                      <Button fullWidth className="flex items-center justify-center gap-2">
                        <Heart className="h-4 w-4" />
                        Donate
                      </Button>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" fullWidth>Sign In</Button>
                    </Link>
                    <Link to="/donate" onClick={() => setIsMenuOpen(false)}>
                      <Button fullWidth className="flex items-center justify-center gap-2">
                        <Heart className="h-4 w-4" />
                        Donate
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
