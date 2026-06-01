import { useState, useEffect } from 'react';
import { Heart, Loader2, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { PatchBadge } from './patches/PatchBadge';

type DonorSponsor = Database['public']['Tables']['donor_sponsors']['Row'];

const TIER_ORDER: Record<string, number> = {
  gold: 0,
  silver: 1,
  bronze: 2,
  supporter: 3,
};

const TIER_LABELS: Record<string, string> = {
  gold: 'Gold Sponsors',
  silver: 'Silver Sponsors',
  bronze: 'Bronze Sponsors',
  supporter: 'Supporters',
};

function DonorLogo({ donor }: { donor: DonorSponsor }) {
  const content = donor.logo_url ? (
    <img
      src={donor.logo_url}
      alt={donor.name}
      className="max-h-12 md:max-h-14 w-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
      loading="lazy"
    />
  ) : (
    <span className="text-sm md:text-base font-semibold text-slate-500 group-hover:text-brand-marine transition-colors duration-500">
      {donor.name}
    </span>
  );

  if (donor.website_url) {
    return (
      <a
        href={donor.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center px-6 py-4 rounded-brand hover:bg-white hover:shadow-md transition-all duration-300"
        aria-label={`Visit ${donor.name}'s website`}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="group flex items-center justify-center px-6 py-4 rounded-brand">
      {content}
    </div>
  );
}

export function DonorRecognitionSection() {
  const [donors, setDonors] = useState<DonorSponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonors() {
      const { data } = await supabase
        .from('donor_sponsors')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (data) setDonors(data);
      setLoading(false);
    }
    fetchDonors();
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

  const tiers = donors.reduce<Record<string, DonorSponsor[]>>((acc, donor) => {
    const tier = donor.tier;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(donor);
    return acc;
  }, {});

  const sortedTiers = Object.entries(tiers).sort(
    ([a], [b]) => (TIER_ORDER[a] ?? 99) - (TIER_ORDER[b] ?? 99)
  );

  const hasMixedTiers = sortedTiers.length > 1 || (sortedTiers.length === 1 && sortedTiers[0][0] !== 'supporter');

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
            Our Generous Supporters
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            We are grateful to these organizations and individuals whose generosity makes our mission possible
          </p>
        </div>

        <div className="mb-12 p-8 border-2 border-brand-gold/30 rounded-brand bg-white text-center">
          <div className="flex justify-center gap-4 mb-4">
            <PatchBadge series="watchman" rank="sentinel" size={60} />
            <PatchBadge series="covenant" rank="guardian" size={60} />
            <PatchBadge series="vanguard" rank="defender" size={60} />
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

        {donors.length > 0 && (
          <>
            {hasMixedTiers ? (
              <div className="space-y-8">
                {sortedTiers.map(([tier, tierDonors]) => (
                  <div key={tier}>
                    <p className="text-center text-xs font-semibold text-brand-gold tracking-widest uppercase mb-4">
                      {TIER_LABELS[tier] || tier}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                      {tierDonors.map((donor) => (
                        <DonorLogo key={donor.id} donor={donor} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                {donors.map((donor) => (
                  <DonorLogo key={donor.id} donor={donor} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
