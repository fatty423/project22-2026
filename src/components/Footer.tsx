import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Youtube } from 'lucide-react';
import { getPath } from '../lib/routes';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'about', label: 'About Us' },
    { id: 'programs', label: 'Training Programs' },
    { id: 'services', label: 'Services' },
    { id: 'impact', label: 'Our Impact' },
    { id: 'heroes', label: 'Heroes Directory' },
    { id: 'apply', label: 'Apply for Scholarship' },
    { id: 'help', label: 'Ways to Help' },
    { id: 'doc-sclater-scholarship', label: 'Doc Sclater Scholarship' },
    { id: 'partnership', label: 'Partnership' },
  ];

  const legalLinks = [
    { id: 'contact', label: 'Contact Us' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'accessibility', label: 'Accessibility' },
  ];

  return (
    <footer className="bg-brand-marine text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-display text-xl uppercase tracking-wide mb-4">Project 22</h3>
            <p className="text-sm leading-relaxed mb-4">
              Supporting veterans and first responders through career training and placement programs in security, executive protection, and overseas contracting.
            </p>
            <p className="text-brand-gold text-sm font-semibold italic mb-4">
              Standing for Those Who Have Stood for Us
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/project22us?igsh=NWwzazFmenJneGpq&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-brand-scarlet rounded-brand flex items-center justify-center transition-colors duration-200"
                aria-label="Visit our Instagram page"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-brand-scarlet rounded-brand flex items-center justify-center transition-colors duration-200"
                aria-label="Visit our YouTube channel"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-display text-xl uppercase tracking-wide mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={getPath(link.id)}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display text-xl uppercase tracking-wide mb-4">Legal & Support</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={getPath(link.id)}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display text-xl uppercase tracking-wide mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  425 E. Spruce St.<br />
                  Tarpon Springs, FL 34689
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <a
                  href="mailto:info@project22.org"
                  className="text-sm hover:text-white transition-colors duration-200"
                >
                  info@project22.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <a
                  href="tel:+17272224325"
                  className="text-sm hover:text-white transition-colors duration-200"
                >
                  727.222.4325
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              &copy; {currentYear} Project 22. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors duration-200">
                Terms
              </Link>
              <Link to="/accessibility" className="hover:text-white transition-colors duration-200">
                Accessibility
              </Link>
              <Link to="/admin/login" className="hover:text-slate-300 transition-colors duration-200">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
