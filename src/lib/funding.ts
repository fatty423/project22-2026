export function formatFundingPercent(raised: number, needed: number): string {
  if (!needed || needed <= 0) return '0%';
  const ratio = (raised / needed) * 100;
  if (ratio <= 0) return '0%';
  if (ratio >= 100) return '100%';
  if (ratio < 1) return '<1%';
  return `${Math.round(ratio)}%`;
}

export function fundingBarPercent(raised: number, needed: number): number {
  if (!needed || needed <= 0) return 0;
  const ratio = (raised / needed) * 100;
  if (ratio <= 0) return 0;
  if (ratio >= 100) return 100;
  return Math.max(ratio, 2);
}
