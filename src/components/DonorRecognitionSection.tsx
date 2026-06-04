import { useState, useEffect } from 'react';
import { Heart, Loader2, Award, ChevronRight, User, Church, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { PatchBadge } from './patches/PatchBadge';

type DonorSponsor = Database['public']['Tables']['donor_sponsors']['Row'];
type Donor = Database['public']['Tables']['donors']['Row'];

const orgPatchMap: Record<string, { series: 'watchman' | 'covenant' | 'vanguard'; rank: string; label: string; amount: string }> = {
  'ESS Global Corp': { series: 'vanguard', rank: 'general-partner', label: 'General Partner', amount: '$50,000+/yr' },
  'A Place for Family': { series: 'covenant', rank: 'regimental-chapel', label: 'Regimental Chapel', amount: '$7,500/yr' },
  'Fourth Watch': { series: 'vanguard', rank: 'tactical-partner', label: 'Tactical Partner', amount: '$5,000/yr' },
  'Sponge Labs': { series: 'vanguard', rank: 'tactical-partner', label: 'Tactical Partner', amount: '$5,000/yr' },
  'Fellowship of Believers': { series: 'covenant', rank: 'mission-chapel', label: 'Mission Chapel', amount: '$1,500/yr' },
  'Fellowship Church': { series: 'covenant', rank: 'field-chapel', label: 'Field Chapel', amount: '$500/yr' },
};

const corporateNames = ['ESS Global Corp', 'Fourth Watch', 'Sponge Labs'];
const faithNames = ['A Place for Family', 'Fellowship of Believers'];

function getWatchmanRank(amount: number): { rank: string; label: string } {
  if (amount >= 1000) return { rank: 'master-sergeant', label: 'Master Sergeant' };
  if (amount >= 500) return { rank: 'staff-sergeant', label: 'Staff Sergeant' };
  if (amount >= 250) return { rank: 'sergeant', label: 'Sergeant' };
  if (amount >= 100) return { rank: 'corporal', label: 'Corporal' };
  if (amount >= 50) return { rank: 'pvt-1st-class', label: 'Pvt 1st Class' };
  return { rank: 'recruit', label: 'Recruit' };
}

type TabId = 'individual' | 'faith' | 'corporate';

const tabs: { id: TabId; label: string; icon: typeof User }[] = [
  { id: 'individual', label: 'Individual', icon: User },
  { id: 'faith', label: 'Faith-Based', icon: Church },
  { id: 'corporate', label: 'Corporate', icon: Building2 },
];

export function DonorRecognitionSection() {
  const [orgDonors, setOrgDonors] = useState<DonorSponsor[]>([]);
  const [individualDonors, setIndividualDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('individual');

  useEffect(() => {
    async function fetchAll() {
      const [orgRes, indRes] = await Promise.all([
        supabase.from('donor_sponsors').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('donors').select('*').gt('total_contributed', 0).order('total_contributed', { ascending: false }),
      ]);
      if (orgRes.data) setOrgDonors(orgRes.data);
      if (indRes.data) setIndividualDonors(indRes.data.filter((d) => !d.full_name.toLowerCase().includes('church') && !d.full_name.toLowerCase().includes('fellowship')));
      setLoading(false);
    }
    fetchAll();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-slate-50/50">
        <div className="flex justify-center">
          <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
        </div>
      </section>
    );
  }

  const corporateOrgs = orgDonors.filter((d) => corporateNames.includes(d.name));
  const faithOrgs = orgDonors.filter((d) => faithNames.includes(d.name));

  return (
    <section className="py-14 bg-slate-50 border-t-2 border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-brand-gold mb-3">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase">
              With Gratitude
            </span>
            <Heart className="w-4 h-4" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display text-brand-scarlet">
            Wall of Gratitude
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            We are grateful to these organizations and individuals whose generosity makes our mission possible
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-8 max-w-md mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-brand text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-brand-marine text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-marine hover:text-brand-marine'
              }`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Individual Tab */}
        {activeTab === 'individual' && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-12">
            {individualDonors.map((donor) => {
              const watchman = getWatchmanRank(donor.total_contributed);
              return (
                <div
                  key={donor.id}
                  className="flex items-center gap-3 bg-white rounded-brand px-4 py-3 border border-slate-100 hover:shadow-md transition-all duration-200"
                >
                  <PatchBadge series="watchman" rank={watchman.rank} size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{donor.full_name}</p>
                    <p className="text-[10px] font-semibold text-brand-gold uppercase tracking-wide">{watchman.label}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-900">${donor.total_contributed}</p>
                    {donor.is_monthly_donor && (
                      <span className="text-[9px] font-semibold uppercase tracking-wide text-emerald-600">Monthly</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Faith-Based Tab */}
        {activeTab === 'faith' && (
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {faithOrgs.map((org) => {
              const patch = orgPatchMap[org.name];
              return (
                <div
                  key={org.id}
                  className="flex items-center gap-4 bg-white rounded-brand px-5 py-4 border border-slate-100 hover:shadow-md transition-all duration-200"
                >
                  {patch && (
                    <div className="flex flex-col items-center flex-shrink-0">
                      <PatchBadge series={patch.series} rank={patch.rank} size={48} />
                      <p className="text-[10px] font-semibold text-brand-gold uppercase tracking-wide mt-0.5">{patch.label}</p>
                      <p className="text-[9px] font-bold text-slate-500">{patch.amount}</p>
                    </div>
                  )}
                  {org.logo_url ? (
                    <img src={org.logo_url} alt={org.name} className="max-h-10 w-auto object-contain" loading="lazy" />
                  ) : (
                    <span className="text-sm font-semibold text-slate-700">{org.name}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Corporate Tab */}
        {activeTab === 'corporate' && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {corporateOrgs.map((org) => {
              const patch = orgPatchMap[org.name];
              return (
                <div
                  key={org.id}
                  className="flex items-center gap-4 bg-white rounded-brand px-5 py-4 border border-slate-100 hover:shadow-md transition-all duration-200"
                >
                  {patch && (
                    <div className="flex flex-col items-center flex-shrink-0">
                      <PatchBadge series={patch.series} rank={patch.rank} size={48} />
                      <p className="text-[10px] font-semibold text-brand-gold uppercase tracking-wide mt-0.5">{patch.label}</p>
                      <p className="text-[9px] font-bold text-slate-500">{patch.amount}</p>
                    </div>
                  )}
                  {org.logo_url ? (
                    <img src={org.logo_url} alt={org.name} className="max-h-10 w-auto object-contain" loading="lazy" />
                  ) : (
                    <span className="text-sm font-semibold text-slate-700">{org.name}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Partner Patch Program CTA */}
        <div className="p-8 border-2 border-brand-gold/30 rounded-brand bg-white text-center">
          <div className="flex justify-center gap-4 mb-4">
            <PatchBadge series="watchman" rank="sergeant" size={60} />
            <PatchBadge series="covenant" rank="battalion-chapel" size={60} />
            <PatchBadge series="vanguard" rank="strategic-command" size={60} />
          </div>
          <h3 className="font-display text-xl text-brand-marine uppercase mb-2">
            Partner Patch Program
          </h3>
          <p className="text-slate-600 text-sm mb-4 max-w-md mx-auto">
            Earn your digital patch badge and advance through ranks as you support our heroes
          </p>
          <Link
            to="/partner-patches"
            className="inline-flex items-center gap-1 text-brand-scarlet font-semibold text-sm hover:underline"
          >
            <Award className="w-4 h-4" />
            Learn About the Patch Program
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
