import { Heart, ArrowRight, Repeat, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { PatchBadge } from './patches/PatchBadge';

const donationTiers = [
  {
    amount: '$25',
    period: 'per month',
    annual: '$300/yr',
    description: 'Entry-level commitment to stand watch',
    series: 'watchman' as const,
    rank: 'recruit',
    rankLabel: 'Recruit',
  },
  {
    amount: '$100',
    period: 'per month',
    annual: '$1,200/yr',
    description: 'Named recognition in P22 field report',
    series: 'watchman' as const,
    rank: 'corporal',
    rankLabel: 'Corporal',
  },
  {
    amount: '$500',
    period: 'per year',
    annual: '',
    description: 'Church entry-level: mobilize your congregation',
    series: 'covenant' as const,
    rank: 'field-chapel',
    rankLabel: 'Field Chapel',
  },
  {
    amount: '$1,000',
    period: 'per year',
    annual: '',
    description: 'Corporate entry: lead from the front',
    series: 'vanguard' as const,
    rank: 'field-ally',
    rankLabel: 'Field Ally',
  },
];

export function DonationSection() {
  return (
    <section className="bg-brand-marine text-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center">
            <Heart className="w-8 h-8 text-brand-gold" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Support a Hero Today
        </h2>

        <p className="text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed">
          Your contribution directly impacts a hero's journey from uncertainty to a purposeful career.
          Each level earns you a digital Partner Patch.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {donationTiers.map((tier) => (
            <div
              key={tier.amount}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex flex-col items-center"
            >
              <div className="mb-3">
                <PatchBadge series={tier.series} rank={tier.rank} size={44} />
              </div>
              <div className="text-3xl font-bold mb-1">{tier.amount}</div>
              <div className="text-sm text-brand-gold mb-1">{tier.period}</div>
              {tier.annual && <div className="text-xs text-white/50 mb-2">{tier.annual}</div>}
              {!tier.annual && <div className="mb-2" />}
              <p className="text-white/70 text-sm mb-3">{tier.description}</p>
              <p className="text-xs font-semibold text-brand-gold/80 uppercase tracking-wider">
                Earns: {tier.rankLabel}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/donate">
            <Button
              size="lg"
              className="bg-brand-scarlet text-white hover:bg-brand-dark-red border-0 text-lg px-8 flex items-center gap-2"
            >
              <Repeat className="w-5 h-5" />
              Give Monthly
            </Button>
          </Link>
          <Link to="/donate">
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 text-lg px-8 flex items-center gap-2"
            >
              Make a One-Time Gift
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 max-w-lg mx-auto border border-white/15">
          <PieChart className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <p className="text-sm text-white/70 text-left">
            <span className="font-semibold text-white">90% of donations</span> go directly to programs serving veterans and first responders.{' '}
            <Link to="/impact" className="underline hover:text-white transition-colors">See the full breakdown</Link>
          </p>
        </div>

        <p className="mt-4 text-sm text-white/60">
          All donations are tax-deductible. Project 22 is a registered 501(c)(3) nonprofit.
          Donors receive an annual giving statement at year-end for their tax records.
        </p>
      </div>
    </section>
  );
}
