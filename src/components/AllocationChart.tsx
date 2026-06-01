const SEGMENTS = [
  { label: 'Career Training & Certifications', percent: 40, color: '#2563eb' },
  { label: 'Job Placement & Counseling', percent: 25, color: '#0ea5e9' },
  { label: 'Housing & Family Support', percent: 15, color: '#06b6d4' },
  { label: 'Holistic Wellness Programs', percent: 10, color: '#14b8a6' },
  { label: 'Operations & Administration', percent: 10, color: '#94a3b8' },
];

const SIZE = 200;
const STROKE = 28;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function AllocationChart({ compact = false }: { compact?: boolean }) {
  let cumulativePercent = 0;

  return (
    <div className={`flex flex-col ${compact ? 'lg:flex-row' : 'lg:flex-row'} items-center gap-8 lg:gap-12`}>
      <div className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="transform -rotate-90"
          width={SIZE}
          height={SIZE}
        >
          {SEGMENTS.map((seg) => {
            const offset = CIRCUMFERENCE * (1 - seg.percent / 100);
            const rotation = cumulativePercent * 3.6;
            cumulativePercent += seg.percent;

            return (
              <circle
                key={seg.label}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE}
                strokeDasharray={`${CIRCUMFERENCE}`}
                strokeDashoffset={offset}
                style={{
                  transformOrigin: 'center',
                  transform: `rotate(${rotation}deg)`,
                }}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900">90%</span>
          <span className="text-xs text-slate-500 font-medium">to programs</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 w-full">
        {SEGMENTS.map((seg) => (
          <div key={seg.label} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className={`${compact ? 'text-sm' : 'text-sm'} text-slate-700`}>
                {seg.label}
              </span>
              <span className={`${compact ? 'text-sm' : 'text-sm'} font-bold text-slate-900`}>
                {seg.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
