import { useEffect, useState } from 'react';
import { Heart, Award, Loader2, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
import { PatchBadge } from './patches/PatchBadge';
import { supabase } from '../lib/supabase';

type HeroDonor = {
  donor_display_name: string;
  total_amount: number;
  latest_donation_at: string;
  is_monthly: boolean;
  overall_total: number;
  monthly_amount: number;
};

interface HeroDonorRecognitionProps {
  veteranId: string;
  veteranFirstName: string;
}

function getTier(amount: number): { label: string; badge: string; text: string; ring: string } {
  if (amount >= 2500) {
    return {
      label: 'Champion',
      badge: 'bg-gradient-to-br from-amber-400 to-amber-600',
      text: 'text-amber-900',
      ring: 'ring-amber-200',
    };
  }
  if (amount >= 1000) {
    return {
      label: 'Patron',
      badge: 'bg-gradient-to-br from-slate-300 to-slate-500',
      text: 'text-slate-900',
      ring: 'ring-slate-200',
    };
  }
  if (amount >= 250) {
    return {
      label: 'Ally',
      badge: 'bg-gradient-to-br from-orange-300 to-orange-500',
      text: 'text-orange-900',
      ring: 'ring-orange-200',
    };
  }
  return {
    label: 'Supporter',
    badge: 'bg-gradient-to-br from-brand-marine to-brand-marine/80',
    text: 'text-brand-marine',
    ring: 'ring-brand-marine/20',
  };
}

function getWatchmanRank(amount: number): { rank: string; label: string } {
  if (amount >= 1000) return { rank: 'master-sergeant', label: 'Master Sergeant' };
  if (amount >= 500) return { rank: 'staff-sergeant', label: 'Staff Sergeant' };
  if (amount >= 250) return { rank: 'sergeant', label: 'Sergeant' };
  if (amount >= 100) return { rank: 'corporal', label: 'Corporal' };
  if (amount >= 50) return { rank: 'pvt-1st-class', label: 'Pvt 1st Class' };
  return { rank: 'recruit', label: 'Recruit' };
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function HeroDonorRecognition({ veteranId, veteranFirstName }: HeroDonorRecognitionProps) {
  const [donors, setDonors] = useState<HeroDonor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_veteran_donors', {
        p_veteran_id: veteranId,
      });

      if (!cancelled) {
        if (!error && data) {
          setDonors(data as HeroDonor[]);
        }
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [veteranId]);

  if (loading) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-bold text-slate-900">Wall of Gratitude</h3>
        </div>
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
        </div>
      </Card>
    );
  }

  const totalDonors = donors.length;
  const totalRaised = donors.reduce((sum, d) => sum + Number(d.total_amount), 0);
  const topDonor = donors[0];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-bold text-slate-900">Wall of Gratitude</h3>
        </div>
        {totalDonors > 0 && (
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {totalDonors} {totalDonors === 1 ? 'donor' : 'donors'}
          </span>
        )}
      </div>

      {totalDonors === 0 ? (
        <div className="text-center py-6 px-4 bg-gradient-to-br from-brand-marine/5 to-slate-50 rounded-lg border border-brand-marine/10">
          <Sparkles className="w-8 h-8 text-brand-gold mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800 mb-1">
            Be the first to champion {veteranFirstName}
          </p>
          <p className="text-xs text-slate-600">
            Your name will be honored here as a founding supporter of their journey.
          </p>
        </div>
      ) : (
        <>
          {topDonor && (
            <div className="mb-4 p-4 bg-gradient-to-br from-amber-50 via-amber-50 to-orange-50 border border-amber-200 rounded-xl relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-amber-700 mb-1">
                Top Supporter
              </p>
              <p className="text-base font-bold text-slate-900">
                {topDonor.donor_display_name}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                ${Number(topDonor.total_amount).toFixed(0)} contributed
                {topDonor.is_monthly && ' (monthly)'}
              </p>
            </div>
          )}

          <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {donors.map((donor, idx) => {
              const tier = getTier(Number(donor.total_amount));
              const rankAmount = Number(donor.monthly_amount) > 0 ? Number(donor.monthly_amount) : Number(donor.overall_total ?? donor.total_amount);
              const watchman = getWatchmanRank(rankAmount);
              return (
                <li
                  key={`${donor.donor_display_name}-${idx}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <span title={`$${Number(donor.total_amount).toFixed(0)} contributed`} className="cursor-pointer">
                      <PatchBadge series="watchman" rank={watchman.rank} size={36} />
                    </span>
                    <span className="text-[8px] font-semibold text-brand-gold mt-0.5 uppercase tracking-wide">{watchman.label}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {donor.donor_display_name}
                      </p>
                      {donor.is_monthly && (
                        <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Monthly
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{tier.label}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-900">
                      ${Number(donor.total_amount).toFixed(0)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Community Total</span>
            <span className="text-sm font-bold text-slate-900">
              ${totalRaised.toFixed(0)}
            </span>
          </div>
        </>
      )}
    </Card>
  );
}
