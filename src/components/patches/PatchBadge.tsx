interface PatchBadgeProps {
  series: 'watchman' | 'covenant' | 'vanguard';
  rank: string;
  size?: number;
  className?: string;
}

export function PatchBadge({ series, rank, size = 120, className = '' }: PatchBadgeProps) {
  const src = `/patches/${series}-${rank}.png`;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={`${series} ${rank.replace(/-/g, ' ')} patch`}
        width={size}
        height={size}
        className="object-contain"
        loading="lazy"
      />
    </div>
  );
}
