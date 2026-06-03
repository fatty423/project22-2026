import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Building2, Users, GraduationCap, Church, CheckCircle, Mail, Shield, Heart, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PatchBadge } from '../components/patches/PatchBadge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Partner = Database['public']['Tables']['partners']['Row'];

const partnerPatchMap: Record<string, { series: 'watchman' | 'covenant' | 'vanguard'; rank: string; level: string }> = {
  'ess-academy': { series: 'vanguard', rank: 'general-partner', level: 'General Partner, Level V ($50,000+/yr)' },
  'fourth-watch': { series: 'vanguard', rank: 'tactical-partner', level: 'Tactical Partner, Level II ($5,000/yr)' },
  'ksa': { series: 'vanguard', rank: 'tactical-partner', level: 'Tactical Partner, Level II ($5,000/yr)' },
  'a-place-for-the-family': { series: 'covenant', rank: 'regimental-chapel', level: 'Regimental Chapel, Level IV ($7,500/yr)' },
  'fellowship-of-believers': { series: 'covenant', rank: 'mission-chapel', level: 'Mission Chapel, Level II ($1,500/yr)' },
};

function PartnerCard({ partner }: { partner: Partner }) {
  const hasLogo = !!partner.logo_url;
  const services = partner.services_provided.split(',').map((s) => s.trim());
  const patch = partnerPatchMap[partner.slug];

  return (
    <div id={partner.slug} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 scroll-mt-24">
      <div className="p-8">
        <div className="flex items-start gap-6 mb-6">
          {hasLogo ? (
            <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
              <img
                src={partner.logo_url!}
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 flex-shrink-0 bg-slate-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
              <Shield className="w-8 h-8 text-slate-400 mb-1" />
              <span className="text-[10px] text-slate-400 font-medium">Logo Coming</span>
            </div>
          )}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-slate-900">{partner.name}</h3>
            </div>
            <span className={`inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full ${
              partner.category === 'training'
                ? 'bg-blue-50 text-blue-700'
                : partner.category === 'community'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}>
              {partner.category === 'training'
                ? 'Training Partner'
                : partner.category === 'community'
                ? 'Community & Faith Support'
                : 'Wellness & Family Support'}
            </span>
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed mb-6">
          {partner.description}
        </p>

        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
            Services Provided
          </h4>
          <div className="flex flex-wrap gap-2">
            {services.map((service, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 text-sm bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg"
              >
                <CheckCircle className="w-3.5 h-3.5 text-brand-marine flex-shrink-0" />
                {service}
              </span>
            ))}
          </div>
        </div>

        {partner.website_url && (
          <a
            href={partner.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-marine hover:text-brand-scarlet font-semibold mt-5 transition-colors duration-200"
          >
            Visit Website
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {patch && (
          <div className="border-t border-slate-100 mt-6 pt-5 flex flex-col items-center gap-1">
            <Link to={`/partner-patches#${patch.series}`} className="relative group cursor-pointer hover:scale-105 transition-transform">
              <PatchBadge series={patch.series} rank={patch.rank} size={72} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {patch.level} — Click to learn more
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            </Link>
            <span className="text-xs font-semibold text-brand-gold">{patch.level}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Partnership() {
  const navigate = useAppNavigate();
  const location = useLocation();
  const [showContactModal, setShowContactModal] = useState(false);
  const [partnerType, setPartnerType] = useState<string>('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const hasScrolled = useRef(false);

  useEffect(() => {
    async function fetchPartners() {
      const { data } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (data) setPartners(data);
      setLoading(false);
    }
    fetchPartners();
  }, []);

  useEffect(() => {
    if (loading || hasScrolled.current) return;
    const hash = location.hash.replace('#', '');
    if (!hash) return;
    hasScrolled.current = true;
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, [loading, location.hash]);

  const trainingPartners = partners.filter((p) => p.category === 'training');
  const wellnessPartners = partners.filter((p) => p.category === 'wellness');
  const communityPartners = partners.filter((p) => p.category === 'community');

  const partnershipTypes = [
    {
      icon: Building2,
      title: 'Corporate Partners',
      description: 'Provide employment opportunities, sponsor training programs, and offer mentorship',
      benefits: [
        'Access to highly-trained veteran and first responder talent pool',
        'Tax-deductible sponsorships',
        'Brand association with hero support',
        'Employee engagement opportunities',
      ],
    },
    {
      icon: Church,
      title: 'Faith Communities',
      description: 'Support veterans and first responders in your congregation and community through collective sponsorship',
      benefits: [
        'Direct impact on local heroes',
        'Mission trip and service opportunities',
        'Educational programs for your community',
        'Recognition and progress updates',
      ],
    },
    {
      icon: GraduationCap,
      title: 'Educational Institutions',
      description: 'Partner on curriculum development, provide facilities, or sponsor students',
      benefits: [
        'Research collaboration opportunities',
        'Student volunteer programs',
        'Enhanced support services',
        'Community partnerships',
      ],
    },
    {
      icon: Users,
      title: 'Non-Profit Organizations',
      description: 'Collaborate on programs, share resources, and amplify support efforts for veterans and first responders',
      benefits: [
        'Resource sharing and collaboration',
        'Joint programming opportunities',
        'Expanded reach and impact',
        'Shared success stories',
      ],
    },
  ];

  const handleContactClick = (type: string) => {
    setPartnerType(type);
    setShowContactModal(true);
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-sm font-semibold text-brand-gold tracking-widest uppercase mb-4">
              Working Together for Heroes
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Our Partners
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto">
              The organizations delivering world-class training, career placement, community support, and wellness through Project 22
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-brand-marine tracking-widest uppercase mb-2">
              Career Training
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Training Partners
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our training partners deliver industry-leading programs in security, executive protection, and professional development
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-marine animate-spin" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {trainingPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          )}
        </div>
      </section>

      {wellnessPartners.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-emerald-600 tracking-widest uppercase mb-2">
                Holistic Support
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Wellness & Family Support
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Supporting the whole person, spirit, soul, and body, alongside career training
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {wellnessPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        </section>
      )}

      {communityPartners.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-amber-600 tracking-widest uppercase mb-2">
                Community & Faith Support
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                A Home Away From Home
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Local churches and faith communities providing housing, fellowship, and family support for our trainees
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {communityPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}

              <div className="mt-10 flex flex-col items-center">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 max-w-md w-full">
                  <img
                    src="/FOB_-_Housing.jpeg"
                    alt="Trainee housing provided by Fellowship of Believers"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="mt-3 text-sm text-slate-500 italic text-center">
                  Trainee housing provided by Fellowship of Believers
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-2">
              Join Our Mission
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Become a Partner
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover how your organization can make a lasting impact on the lives of veterans and first responders
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnershipTypes.map((type, index) => (
              <Card key={index}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-brand-marine/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <type.icon className="w-7 h-7 text-brand-marine" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-slate-600">
                      {type.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3">Benefits:</h4>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  fullWidth
                  className="mt-6"
                  onClick={() => handleContactClick(type.title)}
                >
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Partner?
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Whether you want to provide training, hire graduates, or support our mission financially, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setShowContactModal(true)}
              className="text-lg bg-white hover:bg-slate-50 text-brand-scarlet"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('help')}
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-brand-scarlet"
            >
              <Heart className="w-5 h-5 mr-2" />
              Donate Now
            </Button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Partnership Inquiry"
        maxWidth="lg"
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            Fill out the form below and our partnership team will contact you within 2 business days.
          </p>

          {partnerType && (
            <div className="bg-brand-marine/5 border border-brand-marine/10 rounded-lg p-4">
              <p className="text-sm font-medium text-brand-marine">
                Interested in: <span className="font-bold">{partnerType}</span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Input
              type="text"
              label="Organization Name"
              placeholder="Your organization name"
              required
            />
            <Input
              type="text"
              label="Contact Name"
              placeholder="Your full name"
              required
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="your@email.com"
              required
            />
            <Input
              type="tel"
              label="Phone Number"
              placeholder="(555) 123-4567"
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Organization Type
              </label>
              <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-marine focus:border-transparent">
                <option value="">Select type</option>
                <option value="corporate">Corporate</option>
                <option value="faith">Faith Community</option>
                <option value="education">Educational Institution</option>
                <option value="nonprofit">Non-Profit Organization</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message
              </label>
              <textarea
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-marine focus:border-transparent"
                rows={4}
                placeholder="Tell us about your interest in partnering with Project 22..."
              />
            </div>
          </div>

          <Button fullWidth size="lg">
            <Mail className="w-5 h-5 mr-2" />
            Submit Inquiry
          </Button>
        </div>
      </Modal>
    </div>
  );
}
