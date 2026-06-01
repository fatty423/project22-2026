type Series = 'watchman' | 'covenant' | 'vanguard';

interface DonorRankResult {
  series: Series;
  rank: string;
  label: string;
  earned: boolean;
}

const watchmanThresholds = [
  { monthly: 1000, rank: 'master-sergeant', label: 'Master Sergeant' },
  { monthly: 500, rank: 'staff-sergeant', label: 'Staff Sergeant' },
  { monthly: 250, rank: 'sergeant', label: 'Sergeant' },
  { monthly: 100, rank: 'corporal', label: 'Corporal' },
  { monthly: 50, rank: 'pvt-1st-class', label: 'Pvt 1st Class' },
  { monthly: 25, rank: 'recruit', label: 'Recruit' },
];

export function getDonorRank(monthlyAmount: number, totalDonated: number): DonorRankResult | null {
  const effectiveMonthly = monthlyAmount > 0
    ? monthlyAmount
    : totalDonated / 12;

  for (const tier of watchmanThresholds) {
    if (effectiveMonthly >= tier.monthly) {
      return {
        series: 'watchman',
        rank: tier.rank,
        label: tier.label,
        earned: true,
      };
    }
  }

  return null;
}

export function getRankProgress(monthlyAmount: number, totalDonated: number): { current: DonorRankResult | null; next: typeof watchmanThresholds[number] | null; percentToNext: number } {
  const current = getDonorRank(monthlyAmount, totalDonated);
  const effectiveMonthly = monthlyAmount > 0 ? monthlyAmount : totalDonated / 12;

  if (!current) {
    return { current: null, next: watchmanThresholds[watchmanThresholds.length - 1], percentToNext: Math.min((effectiveMonthly / 25) * 100, 99) };
  }

  const currentIdx = watchmanThresholds.findIndex(t => t.rank === current.rank);
  if (currentIdx <= 0) {
    return { current, next: null, percentToNext: 100 };
  }

  const next = watchmanThresholds[currentIdx - 1];
  const currentThreshold = watchmanThresholds[currentIdx].monthly;
  const nextThreshold = next.monthly;
  const percentToNext = Math.min(((effectiveMonthly - currentThreshold) / (nextThreshold - currentThreshold)) * 100, 99);

  return { current, next, percentToNext };
}
