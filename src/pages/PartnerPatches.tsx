import { useState } from 'react';
import { Heart, Star, Shield, ChevronRight } from 'lucide-react';
import { PatchBadge } from '../components/patches/PatchBadge';
import { Button } from '../components/ui/Button';
import { useAppNavigate } from '../hooks/useAppNavigate';

const givingTiers = [
  {
    id: 'entry',
    name: 'Recruit',
    amount: '$25',
    period: '/month',
    description: 'Entry-level commitment. Single horizontal service bar. The beginning of standing watch. Eligible for the P22 digital supporter badge, name in quarterly newsletter, and annual report recognition.',
    benefits: ['Digital supporter badge', 'Name in quarterly newsletter', 'Annual report recognition'],
    startingRank: 'recruit',
    color: 'border-brand-gold',
  },
  {
    id: 'standard',
    name: 'Private First Class',
    amount: '$50',
    period: '/month',
    description: 'One chevron. The first mark of sustained commitment. Earns a P22 physical patch mailed annually, plus all Level I benefits.',
    benefits: ['All Recruit benefits included', 'Physical patch mailed annually', 'Personalized commitment letter'],
    startingRank: 'pvt-1st-class',
    color: 'border-brand-scarlet',
  },
  {
    id: 'champion',
    name: 'Corporal',
    amount: '$100',
    period: '/month',
    description: 'Two chevrons. Named recognition in P22 field report. Invitation to annual Partner Briefing call. All prior benefits included.',
    benefits: ['All prior benefits included', 'Named recognition in P22 field report', 'Invitation to annual Partner Briefing call'],
    startingRank: 'corporal',
    color: 'border-brand-marine',
  },
];

const patchSeries = [
  {
    id: 'watchman' as const,
    name: 'Watchman Series',
    shape: 'Shield',
    donorType: 'Individual Partners',
    monthlyAmount: '$25 – $1,000/month',
    description: 'The Watchman Series recognizes individual donors — veterans, first responders, family members, and mission-aligned citizens who personally invest in the P22 mission. Patches use the heraldic shield shape with a scarlet red border. Rank insignia follows U.S. Army enlisted chevron tradition.',
    ranks: [
      { rank: 'recruit', label: 'Recruit', amount: '$25/mo', annual: '$300/yr' },
      { rank: 'pvt-1st-class', label: 'Pvt 1st Class', amount: '$50/mo', annual: '$600/yr' },
      { rank: 'corporal', label: 'Corporal', amount: '$100/mo', annual: '$1,200/yr' },
      { rank: 'sergeant', label: 'Sergeant', amount: '$250/mo', annual: '$3,000/yr' },
      { rank: 'staff-sergeant', label: 'Staff Sergeant', amount: '$500/mo', annual: '$6,000/yr' },
      { rank: 'master-sergeant', label: 'Master Sergeant', amount: '$1,000/mo', annual: '$12,000/yr' },
    ],
  },
  {
    id: 'covenant' as const,
    name: 'Covenant Series',
    shape: 'Circle',
    donorType: 'Church / Ministry Partners',
    monthlyAmount: '$500 – $15,000/year',
    description: 'The Covenant Series honors churches, ministries, and faith-based organizations that mobilize their congregation behind the P22 mission. The circular patch shape reflects covenant unity — the unbroken commitment of a congregation. A gold border on all church patches reflects the eternal covenant of service.',
    ranks: [
      { rank: 'field-chapel', label: 'Field Chapel', amount: '$500/yr', annual: '' },
      { rank: 'mission-chapel', label: 'Mission Chapel', amount: '$1,500/yr', annual: '' },
      { rank: 'battalion-chapel', label: 'Battalion Chapel', amount: '$3,000/yr', annual: '' },
      { rank: 'regimental-chapel', label: 'Regimental Chapel', amount: '$7,500/yr', annual: '' },
      { rank: 'command-chapel', label: 'Command Chapel', amount: '$15,000/yr', annual: '' },
    ],
  },
  {
    id: 'vanguard' as const,
    name: 'Vanguard Series',
    shape: 'Pentagon',
    donorType: 'Business / Corporate Partners',
    monthlyAmount: '$1,000 – $50,000/year',
    description: 'The Vanguard Series is built for businesses and corporate partners. The pentagon patch shape is a direct reference to the U.S. Pentagon — the command structure of American military force. Insignia follows the U.S. officer rank tradition: bars, leaves, and stars.',
    ranks: [
      { rank: 'field-ally', label: 'Field Ally', amount: '$1,000/yr', annual: '' },
      { rank: 'tactical-partner', label: 'Tactical Partner', amount: '$5,000/yr', annual: '' },
      { rank: 'strategic-command', label: 'Strategic Command', amount: '$10,000/yr', annual: '' },
      { rank: 'operational-command', label: 'Operational Command', amount: '$25,000/yr', annual: '' },
      { rank: 'general-partner', label: 'General Partner', amount: '$50,000/yr', annual: '' },
    ],
  },
];

const rankDescriptions: Record<string, { label: string; desc: string }> = {
  recruit: { label: 'Recruit', desc: 'Entry-level commitment. The beginning of standing watch.' },
  'pvt-1st-class': { label: 'Pvt 1st Class', desc: 'The first mark of sustained commitment. Earns physical patch.' },
  corporal: { label: 'Corporal', desc: 'Named recognition in P22 field report. Annual Partner Briefing invitation.' },
  sergeant: { label: 'Sergeant', desc: 'Senior rank. P22 Leadership Summit. Quarterly impact call with director.' },
  'staff-sergeant': { label: 'Staff Sergeant', desc: 'Leading others into mission. Named on P22 Partner Wall.' },
  'master-sergeant': { label: 'Master Sergeant', desc: 'The highest individual rank. Board of Advisors invitation.' },
};

export function PartnerPatches() {
  const [activeSeries, setActiveSeries] = useState<'watchman' | 'covenant' | 'vanguard'>('watchman');
  const navigate = useAppNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-brand-marine text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes text-white pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-1 bg-brand-scarlet mx-auto mb-8" />
          <p className="text-sm font-display tracking-[0.2em] text-brand-gold mb-4">
            SECTION 12 — PROGRAMS & GIVING
          </p>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-6">
            JOIN THE MISSION
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4 font-body">
            Standing for those who have stood for us.
          </p>
          <p className="text-lg text-brand-gold font-display tracking-wide">
            EARN YOUR PATCH. ADVANCE YOUR RANK. SUPPORT THE MISSION.
          </p>
        </div>
      </section>

      {/* Giving Tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display text-brand-scarlet mb-4">
              CHOOSE YOUR COMMITMENT LEVEL
            </h2>
            <div className="w-12 h-1 bg-brand-gold mx-auto mb-6" />
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-body">
              Your monthly commitment earns rank through sustained giving. Rank is evaluated annually — sustain or increase to advance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {givingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`border-t-4 ${tier.color} border-x border-b border-slate-200 p-8 flex flex-col`}
              >
                <div className="mb-6">
                  <p className="text-xs font-display tracking-[0.15em] text-brand-gray uppercase mb-2">
                    {tier.id === 'entry' ? 'Entry Level' : tier.id === 'standard' ? 'Standard Level' : 'Champion Level'}
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-4xl font-display text-brand-scarlet">{tier.amount}</span>
                    <span className="text-lg text-brand-gray font-body">{tier.period}</span>
                  </div>
                </div>
                <h3 className="text-xl font-display text-brand-marine mb-4">
                  {tier.name}
                </h3>
                <p className="text-slate-600 font-body mb-6 flex-grow">
                  {tier.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-slate-700 font-body">
                      <Star className="w-3.5 h-3.5 text-brand-gold mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-slate-200 mb-6">
                  <p className="text-xs font-display tracking-wide text-brand-gold uppercase mb-1">Starting Rank</p>
                  <p className="text-brand-marine font-display text-sm">{tier.startingRank.toUpperCase()}</p>
                </div>
                <Button
                  onClick={() => navigate('donate')}
                  className="w-full"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patch Series */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-brand-scarlet mb-4">
              THREE PATCH SERIES
            </h2>
            <div className="w-12 h-1 bg-brand-gold mx-auto mb-6" />
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-body">
              Each series features a unique shape representing a different aspect of the mission. Your patch is earned through faithful, consistent support.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {patchSeries.map((series) => (
              <button
                key={series.id}
                onClick={() => setActiveSeries(series.id)}
                className={`px-6 py-4 font-display uppercase text-sm tracking-wide transition-all duration-200 border-2 text-center ${
                  activeSeries === series.id
                    ? 'bg-brand-marine border-brand-marine text-white'
                    : 'bg-white border-brand-marine text-brand-marine hover:bg-brand-marine hover:text-white'
                }`}
              >
                <span className="block">{series.name}</span>
                <span className={`block text-[10px] mt-1 normal-case tracking-normal ${
                  activeSeries === series.id ? 'text-brand-gold' : 'text-slate-500'
                }`}>
                  {series.donorType}
                </span>
              </button>
            ))}
          </div>

          {patchSeries
            .filter((s) => s.id === activeSeries)
            .map((series) => (
              <div key={series.id}>
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-display text-brand-marine mb-2">
                    {series.name.toUpperCase()}
                  </h3>
                  <p className="text-sm font-display text-brand-gold tracking-wide uppercase mb-2">
                    {series.shape} Shape
                  </p>
                  <p className="text-sm font-display text-brand-scarlet tracking-wide uppercase mb-1">
                    {series.donorType}
                  </p>
                  <p className="text-sm font-display text-slate-500 tracking-wide mb-4">
                    {series.monthlyAmount}
                  </p>
                  <p className="text-slate-600 max-w-2xl mx-auto font-body">
                    {series.description}
                  </p>
                </div>

                <div className={`grid grid-cols-2 md:grid-cols-3 ${series.ranks.length === 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-8`}>
                  {series.ranks.map(({ rank, label, amount, annual }, idx) => (
                    <div key={rank} className="flex flex-col items-center text-center group">
                      <div className="transition-transform duration-200 group-hover:scale-105">
                        <PatchBadge series={series.id} rank={rank} size={100} />
                      </div>
                      <p className="mt-3 font-display text-brand-marine text-sm">
                        {label.toUpperCase()}
                      </p>
                      <p className="mt-1 text-sm font-bold text-brand-scarlet">
                        {amount}
                      </p>
                      {annual && (
                        <p className="text-xs text-slate-500">
                          {annual}
                        </p>
                      )}
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: idx }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-brand-gold text-brand-gold" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Rank Progression */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-brand-scarlet mb-4">
              RANK PROGRESSION
            </h2>
            <div className="w-12 h-1 bg-brand-gold mx-auto mb-6" />
            <p className="text-slate-600 font-body">
              Your rank advances as your commitment grows. Each level represents deeper partnership.
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(rankDescriptions).map(([rank, { label, desc }], index) => (
              <div
                key={rank}
                className="flex items-center gap-4 p-4 border-l-4 border-brand-marine bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-brand-marine flex items-center justify-center flex-shrink-0">
                  {index === 0 ? (
                    <Shield className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-brand-gold font-display text-sm">{index}</span>
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="font-display text-brand-marine text-sm">{label.toUpperCase()}</h4>
                  <p className="text-sm text-slate-600 font-body">{desc}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: index }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-marine text-white relative overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes text-white pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            STAND WITH THOSE WHO STOOD FOR YOU
          </h2>
          <div className="w-12 h-1 bg-brand-scarlet mx-auto mb-6" />
          <p className="text-lg text-slate-300 mb-10 font-body max-w-2xl mx-auto">
            Start your partner journey today. Every contribution advances your rank and directly supports a veteran or first responder through discipleship and community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('donate')}
              className="bg-brand-scarlet hover:bg-brand-dark-red text-white text-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Start Your Commitment
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('heroes')}
              className="border-2 border-white text-white hover:bg-white hover:text-brand-marine text-lg"
            >
              Sponsor a Hero
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
