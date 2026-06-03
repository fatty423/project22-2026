import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heart, Star, Shield, ChevronRight, User, Church, Building2 } from 'lucide-react';
import { PatchBadge } from '../components/patches/PatchBadge';
import { Button } from '../components/ui/Button';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useNavigate as useRouterNavigate } from 'react-router-dom';

const givingTiers = [
  {
    id: 'entry',
    name: 'Recruit',
    amount: '$22',
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
    monthlyAmount: '$22 – $1,000/month',
    description: 'The Watchman Series recognizes individual donors, veterans, first responders, family members, and mission-aligned citizens who personally invest in the P22 mission. Patches use the heraldic shield shape with a scarlet red border (Levels I-III) advancing to Field Drab Gold (Levels IV-VI). Rank insignia follows U.S. Army enlisted chevron tradition.',
    ranks: [
      { rank: 'recruit', label: 'Recruit', amount: '$22/mo', annual: '$264/yr' },
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
    description: 'The Covenant Series honors churches, ministries, and faith-based organizations that mobilize their congregation behind the P22 mission. The circular patch shape reflects covenant unity, the unbroken commitment of a congregation. A gold border on all church patches reflects the eternal covenant of service. The cross and P22 gold star appear on every patch, with rank shown through star accumulation around the cross.',
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
    description: 'The Vanguard Series is built for businesses and corporate partners. The pentagon patch shape is a direct reference to the U.S. Pentagon, the command structure of American military force. Entry-level patches carry a silver border (enlisted equivalent), advancing to gold as commitment grows (officer equivalent). Insignia follows the U.S. officer rank tradition: bars, leaves, and stars.',
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
  recruit: { label: 'Recruit', desc: 'Level I. Digital supporter badge, name in quarterly newsletter, annual report recognition.' },
  'pvt-1st-class': { label: 'Pvt 1st Class', desc: 'Level II. P22 physical patch mailed annually, plus all Level I benefits.' },
  corporal: { label: 'Corporal', desc: 'Level III. Named recognition in P22 field report. Annual Partner Briefing invitation.' },
  sergeant: { label: 'Sergeant', desc: 'Level IV. Gold border marks senior rank. P22 Leadership Summit. Quarterly impact call with director.' },
  'staff-sergeant': { label: 'Staff Sergeant', desc: 'Level V. Named on P22 Partner Wall. Private briefing access, personalized impact report.' },
  'master-sergeant': { label: 'Master Sergeant', desc: 'Level VI. Highest individual rank. P22 Board of Advisors invitation. Engraved recognition at all P22 events. Lifetime Veteran designation retained after retirement.' },
  'field-chapel': { label: 'Field Chapel', desc: 'Level I. Digital badge, newsletter feature, annual report listing.' },
  'mission-chapel': { label: 'Mission Chapel', desc: 'Level II. Physical patch, bulletin insert materials, speaker invitation.' },
  'battalion-chapel': { label: 'Battalion Chapel', desc: 'Level III. Pulpit visit from P22 leadership, congregation impact report.' },
  'regimental-chapel': { label: 'Regimental Chapel', desc: 'Level IV. Named partnership plaque, P22 event presence, custom resources.' },
  'command-chapel': { label: 'Command Chapel', desc: 'Level V. Top-tier co-branding, board advisory seat, personal mission adoption.' },
  'field-ally': { label: 'Field Ally', desc: 'Level I. Digital badge, P22 partner listing, newsletter feature.' },
  'tactical-partner': { label: 'Tactical Partner', desc: 'Level II. Physical patch + certificate, co-branded materials, event presence.' },
  'strategic-command': { label: 'Strategic Command', desc: 'Level III. Named partnership plaque, leadership briefings, co-branded social content.' },
  'operational-command': { label: 'Operational Command', desc: 'Level IV. Exclusive P22 field event access, co-branded campaign, quarterly exec call.' },
  'general-partner': { label: 'General Partner', desc: 'Level V. Board advisory seat, full co-branding rights, personal mission adoption, P22 impact summit.' },
};

const pathOptions = [
  {
    id: 'individual' as const,
    series: 'watchman' as const,
    icon: User,
    title: 'Individual',
    subtitle: 'I want to give personally',
  },
  {
    id: 'faith' as const,
    series: 'covenant' as const,
    icon: Church,
    title: 'Faith Community',
    subtitle: 'Our church or ministry wants to give',
  },
  {
    id: 'business' as const,
    series: 'vanguard' as const,
    icon: Building2,
    title: 'Business',
    subtitle: 'Our company wants to partner',
  },
];

export function PartnerPatches() {
  const location = useLocation();
  const [activeSeries, setActiveSeries] = useState<'watchman' | 'covenant' | 'vanguard'>('watchman');
  const [selectedPath, setSelectedPath] = useState<string>('individual');
  const navigate = useAppNavigate();
  const routerNavigate = useRouterNavigate();

  useEffect(() => {
    const hash = location.hash.replace('#', '') as 'watchman' | 'covenant' | 'vanguard';
    if (['watchman', 'covenant', 'vanguard'].includes(hash)) {
      setActiveSeries(hash);
      setTimeout(() => {
        document.getElementById('patch-series')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-brand-marine text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes text-white pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-1 bg-brand-scarlet mx-auto mb-8" />
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

      {/* Choose Your Path */}
      <section id="choose-path" className="py-20 bg-white scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-brand-scarlet mb-4">
              CHOOSE YOUR PATH
            </h2>
            <div className="w-12 h-1 bg-brand-gold mx-auto mb-6" />
            <p className="text-lg text-slate-600 font-body max-w-2xl mx-auto">
              How would you like to support the mission? Select your path and choose a giving level to earn your patch.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {pathOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedPath(option.id);
                  setActiveSeries(option.series);
                }}
                className={`p-8 rounded-brand border-2 text-center transition-all duration-200 ${
                  selectedPath === option.id
                    ? 'border-brand-gold bg-brand-gold/5 shadow-lg scale-[1.02]'
                    : 'border-slate-200 hover:border-brand-marine hover:shadow-md'
                }`}
              >
                <option.icon className={`w-10 h-10 mx-auto mb-4 ${
                  selectedPath === option.id ? 'text-brand-gold' : 'text-brand-marine'
                }`} />
                <h3 className="text-xl font-display text-slate-900 mb-1">{option.title}</h3>
                <p className="text-sm text-slate-500">{option.subtitle}</p>
              </button>
            ))}
          </div>

          {selectedPath && (() => {
            const path = pathOptions.find((p) => p.id === selectedPath)!;
            const series = patchSeries.find((s) => s.id === path.series)!;
            return (
              <div className="bg-slate-50 rounded-brand p-8 border border-slate-200">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-display text-brand-marine mb-2">
                    {series.name.toUpperCase()}
                  </h3>
                  <p className="text-sm text-slate-600 font-body max-w-lg mx-auto">
                    {series.description}
                  </p>
                </div>
                <div className={`grid grid-cols-2 md:grid-cols-3 ${series.ranks.length === 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-6`}>
                  {series.ranks.map(({ rank, label, amount }) => {
                    const numAmount = parseFloat(amount.replace(/[$,/a-z]/gi, ''));
                    const isMonthly = amount.includes('/mo');
                    return (
                    <button
                      key={rank}
                      onClick={() => routerNavigate(`/donate?amount=${numAmount}&type=${isMonthly ? 'monthly' : 'one-time'}`)}
                      className="flex flex-col items-center text-center p-4 rounded-brand border-2 border-slate-200 bg-white hover:border-brand-gold hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        <PatchBadge series={series.id} rank={rank} size={72} />
                      </div>
                      <p className="mt-3 font-display text-brand-marine text-xs">
                        {label.toUpperCase()}
                      </p>
                      <p className="mt-1 text-sm font-bold text-brand-scarlet">
                        {amount}
                      </p>
                      <span className="mt-2 text-xs font-semibold text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">
                        Give Now →
                      </span>
                    </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
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
