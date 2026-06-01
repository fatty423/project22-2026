import {
  Heart,
  Shield,
  GraduationCap,
  Briefcase,
  DollarSign,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TransparencySection } from '../components/TransparencySection';
import { useAppNavigate } from '../hooks/useAppNavigate';

const sponsorshipTiers = [
  {
    amount: 250,
    title: 'Champion',
    description: 'Cover certification fees for one hero',
    icon: Shield,
    color: 'sky',
  },
  {
    amount: 500,
    title: 'Guardian',
    description: 'Fund materials, training supplies, and exam prep',
    icon: Star,
    color: 'blue',
  },
  {
    amount: 1500,
    title: 'Full Sponsor',
    description: 'Fully sponsor one hero\'s complete training program',
    icon: Award,
    featured: true,
    color: 'blue',
  },
];

const impactStats = [
  { value: '22', label: 'Veterans lose their lives to suicide every day' },
  { value: '95%', label: 'Job placement rate for program graduates' },
  { value: '$0', label: 'Cost to sponsored heroes' },
  { value: '100+', label: 'Heroes waiting for assistance' },
];

const whatSponsorshipCovers = [
  { text: 'Full tuition and training materials', icon: GraduationCap },
  { text: 'Industry certifications and licensing', icon: Shield },
  { text: 'Job placement assistance after graduation', icon: Briefcase },
  { text: 'Counseling and family support services', icon: Users },
];

export function SponsorAVeteran() {
  const navigate = useAppNavigate();

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <p className="text-brand-gold font-semibold text-lg mb-4 tracking-wide uppercase">
            Change a Hero's Life Today
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Sponsor a Hero
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10">
            Your sponsorship gives a veteran or first responder full access to career training, certifications, job placement, and holistic support -- at no cost to them. You are not just funding a program. You are changing a life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('help')}
              className="text-lg bg-white hover:bg-slate-50 text-brand-scarlet flex items-center justify-center gap-2 px-8"
            >
              <Heart className="w-5 h-5" />
              Donate Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('heroes')}
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-brand-scarlet flex items-center justify-center gap-2 px-8"
            >
              Meet the Heroes
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <p className="text-3xl md:text-4xl font-black text-brand-marine mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              What Your Sponsorship Covers
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every dollar goes directly toward transforming a hero's future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatSponsorshipCovers.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 text-center shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-brand-marine/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-8 h-8 text-brand-marine" />
                </div>
                <p className="font-semibold text-slate-900 leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Choose Your Impact
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every level makes a real difference in a hero's journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sponsorshipTiers.map((tier) => (
              <div
                key={tier.title}
                className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                  tier.featured
                    ? 'bg-white border-brand-marine/20 shadow-xl ring-2 ring-brand-marine/10 hover:shadow-2xl hover:-translate-y-1'
                    : 'bg-white border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {tier.featured && (
                  <div className="bg-brand-scarlet text-white text-center py-2 text-sm font-bold tracking-wide uppercase">
                    Most Impact
                  </div>
                )}
                <div className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                    tier.featured ? 'bg-brand-marine/10' : 'bg-brand-marine/5'
                  }`}>
                    <tier.icon className={`w-8 h-8 ${
                      tier.featured ? 'text-brand-marine' : 'text-brand-marine'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{tier.title}</h3>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <DollarSign className="w-6 h-6 text-slate-400" />
                    <span className="text-4xl font-black text-slate-900">
                      {tier.amount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-6">{tier.description}</p>
                  <Button
                    fullWidth
                    onClick={() => navigate('help')}
                    className={tier.featured ? 'bg-brand-scarlet hover:bg-brand-scarlet/90' : ''}
                  >
                    Sponsor Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'You Sponsor',
                description: 'Choose a sponsorship level or sponsor a specific hero from our directory.',
              },
              {
                step: '02',
                title: 'We Match',
                description: 'Your contribution is matched with a veteran or first responder in need of training and career support.',
              },
              {
                step: '03',
                title: 'They Train',
                description: 'The hero enrolls in a certified training program with full support services.',
              },
              {
                step: '04',
                title: 'Lives Change',
                description: 'The hero graduates with certifications, gets placed in a career, and rebuilds their life.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-marine flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border border-slate-200">
            <div className="flex flex-col md:flex-row items-center gap-8 p-6 md:p-10">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">100% Tax Deductible</h3>
                <p className="text-slate-600 leading-relaxed">
                  Project 22 is a registered 501(c)(3) nonprofit. Your donation is fully tax-deductible, and you will receive a receipt for each contribution. Donors also receive an annual giving statement at year-end for their tax records.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <TransparencySection />

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Change a Life?
          </h2>
          <p className="text-xl mb-10 text-white/80 max-w-2xl mx-auto">
            Every veteran and first responder deserves a chance to rebuild. Your sponsorship is not just a donation -- it is a lifeline. Step up today and become the reason a hero gets a second chance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('help')}
              className="text-lg bg-white hover:bg-slate-50 text-brand-scarlet flex items-center justify-center gap-2 px-8"
            >
              <Heart className="w-5 h-5" />
              Sponsor a Hero
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('contact')}
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-brand-scarlet flex items-center justify-center gap-2 px-8"
            >
              Questions? Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
