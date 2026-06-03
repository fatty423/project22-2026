import { Heart, Users, BookOpen, Wallet, ArrowRight, Phone, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

import { useAppNavigate } from '../hooks/useAppNavigate';

const services = [
  {
    id: 'counseling',
    title: 'Counseling',
    icon: Heart,
    color: 'rose',
    description: 'Confidential counseling that addresses the unique challenges of military and first responder life and transition. Our licensed counselors understand the weight of service and provide a safe space to process trauma, anxiety, depression, and the everyday pressures of reintegration.',
    features: [
      'One-on-one sessions with licensed counselors experienced in veteran and first responder care',
      'Trauma-informed approaches tailored to service experiences',
      'Flexible scheduling to fit your life and work commitments',
      'Referral support for specialized needs and crisis intervention',
    ],
  },
  {
    id: 'family',
    title: 'Family Resources',
    icon: Users,
    color: 'marine',
    description: 'A structured 12-week course designed to strengthen family bonds and equip veterans, first responders, and their loved ones with the tools for a thriving household. Service affects the entire family — this program ensures no one rebuilds alone.',
    features: [
      '12-week guided curriculum covering communication, conflict resolution, and reconnection',
      'Resources for spouses and children navigating the transition alongside our heroes',
      'Group sessions that build community with other service families',
      'Take-home materials and ongoing support beyond the course',
    ],
    badge: '12-Week Course',
  },
  {
    id: 'bible',
    title: 'Bible Programs',
    icon: BookOpen,
    color: 'amber',
    description: 'Faith-based study and fellowship for veterans and first responders seeking spiritual growth and renewed purpose. Whether you are exploring faith for the first time or deepening an existing walk, our programs provide grounding, community, and hope.',
    features: [
      'Weekly group Bible study sessions led by experienced mentors',
      'One-on-one discipleship and spiritual mentoring',
      'Chapel services and worship gatherings',
      'Resources for personal devotion and spiritual growth',
    ],
  },
  {
    id: 'stewardship',
    title: 'Stewardship Resources',
    icon: Wallet,
    color: 'emerald',
    description: 'Practical financial literacy and resource management training to help veterans and first responders build a stable, sustainable future. From budgeting basics to long-term wealth building, we equip you with the knowledge and habits to manage your resources wisely.',
    features: [
      'Budgeting workshops and personal finance fundamentals',
      'Debt management strategies and credit rebuilding guidance',
      'Goal-setting for savings, homeownership, and retirement planning',
      'Access to financial mentors for ongoing accountability',
    ],
  },
];

const colorMap: Record<string, { bg: string; icon: string; badge: string; ring: string }> = {
  rose: { bg: 'bg-rose-100', icon: 'text-rose-600', badge: 'bg-rose-100 text-rose-700', ring: 'ring-rose-100' },
  marine: { bg: 'bg-brand-marine/10', icon: 'text-brand-marine', badge: 'bg-brand-marine/10 text-brand-marine', ring: 'ring-brand-marine/10' },
  amber: { bg: 'bg-amber-100', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', ring: 'ring-amber-100' },
  emerald: { bg: 'bg-emerald-100', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', ring: 'ring-emerald-100' },
};

export function Services() {
  const navigate = useAppNavigate();
  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-brand-gold font-semibold text-lg mb-4 tracking-wide uppercase">Support Beyond Training</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Services for the Whole Person
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              Career training is just one piece of the puzzle. We walk alongside veterans and first responders with counseling, family support, spiritual growth, and financial guidance — because lasting change touches every area of life.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Each service is designed to meet heroes where they are and help them build a foundation for lasting stability
            </p>
          </div>

          <div className="space-y-16">
            {services.map((service, index) => {
              const colors = colorMap[service.color];
              const isReversed = index % 2 !== 0;

              return (
                <div
                  key={service.id}
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 items-center`}
                >
                  <div className="flex-1 w-full">
                    <div className="bg-slate-50 rounded-2xl p-8 lg:p-10 border border-slate-100">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                          <service.icon className={`w-7 h-7 ${colors.icon}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">{service.title}</h3>
                            {service.badge && (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                                <Clock className="w-3 h-3" />
                                {service.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-lg mb-8">
                        {service.description}
                      </p>
                      <ul className="space-y-3">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.icon}`} />
                            <span className="text-slate-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex-1 w-full flex justify-center">
                    <div className={`relative w-full max-w-md aspect-square rounded-3xl ${colors.bg} flex items-center justify-center ring-8 ${colors.ring}`}>
                      <service.icon className={`w-32 h-32 ${colors.icon} opacity-30`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center px-8">
                          <service.icon className={`w-16 h-16 mx-auto mb-4 ${colors.icon}`} />
                          <p className="text-slate-800 font-bold text-xl">{service.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            You Don't Have to Do This Alone
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Whether you need someone to talk to, help for your family, spiritual guidance, or a plan for your finances — we are here. Reach out and let us walk this road with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('apply')}
              className="text-lg bg-white hover:bg-slate-50 text-brand-scarlet flex items-center justify-center gap-2"
            >
              Apply for Scholarship
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                window.location.href = 'tel:+17275551212';
              }}
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-brand-scarlet flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Us Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
