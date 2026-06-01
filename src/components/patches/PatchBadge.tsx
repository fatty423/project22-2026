interface PatchBadgeProps {
  series: 'watchman' | 'covenant' | 'vanguard';
  rank: string;
  size?: number;
  className?: string;
}

const seriesColors = {
  watchman: { fill: '#001E2E', border: '#940000', gold: '#84754E', text: '#FFFFFF' },
  covenant: { fill: '#001E2E', border: '#84754E', gold: '#84754E', text: '#FFFFFF' },
  vanguard: { fill: '#1a1a2e', border: '#84754E', gold: '#84754E', text: '#FFFFFF' },
};

// Watchman: Army chevron rendering
function WatchmanChevrons({ rank, cx, cy }: { rank: string; cx: number; cy: number }) {
  const gold = '#84754E';
  const w = 28;
  const chevronH = 8;
  const gap = 3;

  if (rank === 'recruit') {
    // Single horizontal service bar
    return <rect x={cx - 14} y={cy} width={28} height={4} fill={gold} />;
  }

  const chevronCount =
    rank === 'pvt-1st-class' ? 1 :
    rank === 'corporal' ? 2 :
    rank === 'sergeant' ? 3 :
    rank === 'staff-sergeant' ? 3 :
    rank === 'master-sergeant' ? 3 : 0;

  const rockerCount =
    rank === 'staff-sergeant' ? 1 :
    rank === 'master-sergeant' ? 2 : 0;

  if (chevronCount === 0) return null;

  const totalH = chevronCount * (chevronH + gap) + (rockerCount > 0 ? rockerCount * (chevronH + gap) + 4 : 0);
  const startY = cy - totalH / 2;

  return (
    <g>
      {/* Chevrons (point up) */}
      {Array.from({ length: chevronCount }).map((_, i) => {
        const y = startY + i * (chevronH + gap);
        return (
          <path
            key={`c-${i}`}
            d={`M${cx - w / 2},${y + chevronH} L${cx},${y} L${cx + w / 2},${y + chevronH}`}
            fill="none"
            stroke={gold}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
      {/* Rockers (arc below) */}
      {rockerCount > 0 && Array.from({ length: rockerCount }).map((_, i) => {
        const y = startY + chevronCount * (chevronH + gap) + 4 + i * (chevronH + gap);
        return (
          <path
            key={`r-${i}`}
            d={`M${cx - w / 2},${y} Q${cx},${y + chevronH + 2} ${cx + w / 2},${y}`}
            fill="none"
            stroke={gold}
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function ShieldShape({ rank, size }: { rank: string; size: number }) {
  const c = seriesColors.watchman;
  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} xmlns="http://www.w3.org/2000/svg">
      {/* Outer shield */}
      <path
        d="M100 10 L185 50 L185 140 Q185 200 100 230 Q15 200 15 140 L15 50 Z"
        fill={c.fill}
        stroke={c.border}
        strokeWidth="6"
      />
      {/* Inner border inset (sewn patch look) */}
      <path
        d="M100 22 L175 56 L175 138 Q175 194 100 220 Q25 194 25 138 L25 56 Z"
        fill="none"
        stroke={c.border}
        strokeWidth="2"
        opacity="0.5"
        strokeDasharray="4 3"
      />
      {/* Top arc decoration */}
      <path
        d="M55 52 Q100 38 145 52"
        fill="none"
        stroke={c.gold}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* P22 mark */}
      <text
        x="100"
        y="78"
        textAnchor="middle"
        fill={c.gold}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="900"
        fontSize="22"
        letterSpacing="2"
      >
        P22
      </text>
      {/* Series name */}
      <text
        x="100"
        y="98"
        textAnchor="middle"
        fill={c.gold}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="700"
        fontSize="12"
        letterSpacing="3"
        opacity="0.8"
      >
        WATCHMAN
      </text>
      {/* Divider line */}
      <line x1="60" y1="106" x2="140" y2="106" stroke={c.gold} strokeWidth="1" opacity="0.5" />
      {/* Chevron insignia */}
      <WatchmanChevrons rank={rank} cx={100} cy={140} />
      {/* Rank label */}
      <text
        x="100"
        y="195"
        textAnchor="middle"
        fill={c.text}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="600"
        fontSize="11"
        letterSpacing="1.5"
        opacity="0.9"
      >
        {rank.replace(/-/g, ' ').toUpperCase()}
      </text>
    </svg>
  );
}

// Covenant: Faith-based circle with cross motif
function CovenantCross({ cx, cy, rankLevel }: { cx: number; cy: number; rankLevel: number }) {
  const gold = '#84754E';
  const baseSize = 18;
  const armW = 4;

  return (
    <g>
      {/* Central cross */}
      <rect x={cx - armW / 2} y={cy - baseSize} width={armW} height={baseSize * 2} fill={gold} />
      <rect x={cx - baseSize * 0.7} y={cy - armW / 2} width={baseSize * 1.4} height={armW} fill={gold} />
      {/* Rank adornment rings */}
      {rankLevel >= 1 && (
        <circle cx={cx} cy={cy} r={28} fill="none" stroke={gold} strokeWidth="1.5" opacity="0.6" />
      )}
      {rankLevel >= 2 && (
        <circle cx={cx} cy={cy} r={34} fill="none" stroke={gold} strokeWidth="1" opacity="0.4" />
      )}
      {rankLevel >= 3 && (
        <>
          {/* Corner accent dots */}
          <circle cx={cx - 22} cy={cy - 22} r={2.5} fill={gold} opacity="0.7" />
          <circle cx={cx + 22} cy={cy - 22} r={2.5} fill={gold} opacity="0.7" />
          <circle cx={cx - 22} cy={cy + 22} r={2.5} fill={gold} opacity="0.7" />
          <circle cx={cx + 22} cy={cy + 22} r={2.5} fill={gold} opacity="0.7" />
        </>
      )}
      {rankLevel >= 4 && (
        <>
          {/* Radiating lines from cross */}
          <line x1={cx - 12} y1={cy - 12} x2={cx - 20} y2={cy - 20} stroke={gold} strokeWidth="1.5" opacity="0.6" />
          <line x1={cx + 12} y1={cy - 12} x2={cx + 20} y2={cy - 20} stroke={gold} strokeWidth="1.5" opacity="0.6" />
          <line x1={cx - 12} y1={cy + 12} x2={cx - 20} y2={cy + 20} stroke={gold} strokeWidth="1.5" opacity="0.6" />
          <line x1={cx + 12} y1={cy + 12} x2={cx + 20} y2={cy + 20} stroke={gold} strokeWidth="1.5" opacity="0.6" />
        </>
      )}
    </g>
  );
}

function CircleShape({ rank, size }: { rank: string; size: number }) {
  const c = seriesColors.covenant;
  const rankLevel =
    rank === 'field-chapel' ? 0 :
    rank === 'mission-chapel' ? 1 :
    rank === 'battalion-chapel' ? 2 :
    rank === 'regimental-chapel' ? 3 :
    rank === 'command-chapel' ? 4 : 0;

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle with gold border */}
      <circle cx="100" cy="100" r="92" fill={c.fill} stroke={c.border} strokeWidth="5" />
      {/* Inner stitched border */}
      <circle cx="100" cy="100" r="82" fill="none" stroke={c.border} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
      {/* Top arc text path */}
      <path id="topArc" d="M35,100 A65,65 0 0,1 165,100" fill="none" />
      <text fill={c.gold} fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="11" letterSpacing="3">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">COVENANT</textPath>
      </text>
      {/* P22 mark */}
      <text
        x="100"
        y="72"
        textAnchor="middle"
        fill={c.gold}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="900"
        fontSize="16"
        letterSpacing="1"
      >
        P22
      </text>
      {/* Cross motif with rank adornments */}
      <CovenantCross cx={100} cy={110} rankLevel={rankLevel} />
      {/* Rank label */}
      <text
        x="100"
        y="170"
        textAnchor="middle"
        fill={c.text}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="600"
        fontSize="10"
        letterSpacing="1.5"
        opacity="0.9"
      >
        {rank.replace(/-/g, ' ').toUpperCase()}
      </text>
    </svg>
  );
}

// Vanguard: Officer rank insignia
function OfficerInsignia({ rank, cx, cy }: { rank: string; cx: number; cy: number }) {
  const gold = '#84754E';
  const silver = '#C0C0C0';

  if (rank === 'field-ally') {
    // Single vertical bar (2LT style)
    return <rect x={cx - 3} y={cy - 14} width={6} height={28} fill={gold} rx="1" />;
  }

  if (rank === 'tactical-partner') {
    // Double vertical bars (1LT/CPT style)
    return (
      <g>
        <rect x={cx - 10} y={cy - 14} width={6} height={28} fill={gold} rx="1" />
        <rect x={cx + 4} y={cy - 14} width={6} height={28} fill={gold} rx="1" />
      </g>
    );
  }

  if (rank === 'strategic-command') {
    // Oak leaf cluster (MAJ/LTC style)
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={10} ry={14} fill={silver} opacity="0.9" />
        {/* Leaf veins */}
        <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 12} stroke={gold} strokeWidth="1" opacity="0.6" />
        <line x1={cx - 7} y1={cy - 4} x2={cx + 7} y2={cy + 4} stroke={gold} strokeWidth="0.8" opacity="0.5" />
        <line x1={cx - 7} y1={cy + 4} x2={cx + 7} y2={cy - 4} stroke={gold} strokeWidth="0.8" opacity="0.5" />
        {/* Side lobes */}
        <ellipse cx={cx - 12} cy={cy - 6} rx={5} ry={7} fill={silver} opacity="0.7" />
        <ellipse cx={cx + 12} cy={cy - 6} rx={5} ry={7} fill={silver} opacity="0.7" />
        <ellipse cx={cx - 12} cy={cy + 6} rx={5} ry={7} fill={silver} opacity="0.7" />
        <ellipse cx={cx + 12} cy={cy + 6} rx={5} ry={7} fill={silver} opacity="0.7" />
      </g>
    );
  }

  if (rank === 'operational-command') {
    // Single star (BG style)
    return (
      <polygon
        points={starPoints(cx, cy, 16, 7)}
        fill={gold}
      />
    );
  }

  if (rank === 'general-partner') {
    // Two stars (MG style)
    return (
      <g>
        <polygon points={starPoints(cx - 14, cy, 12, 5)} fill={gold} />
        <polygon points={starPoints(cx + 14, cy, 12, 5)} fill={gold} />
      </g>
    );
  }

  return null;
}

function starPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 2) + (i * Math.PI / 5);
    const r = i % 2 === 0 ? outerR : innerR;
    points.push(`${cx + r * Math.cos(angle)},${cy - r * Math.sin(angle)}`);
  }
  return points.join(' ');
}

function PentagonShape({ rank, size }: { rank: string; size: number }) {
  const c = seriesColors.vanguard;
  return (
    <svg viewBox="0 0 200 210" width={size} height={size * 1.05} xmlns="http://www.w3.org/2000/svg">
      {/* Outer pentagon */}
      <polygon
        points="100,10 190,72 155,185 45,185 10,72"
        fill={c.fill}
        stroke={c.border}
        strokeWidth="5"
      />
      {/* Inner stitched border */}
      <polygon
        points="100,24 178,78 147,178 53,178 22,78"
        fill="none"
        stroke={c.border}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.5"
      />
      {/* P22 mark */}
      <text
        x="100"
        y="68"
        textAnchor="middle"
        fill={c.gold}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="900"
        fontSize="18"
        letterSpacing="2"
      >
        P22
      </text>
      {/* Series name */}
      <text
        x="100"
        y="86"
        textAnchor="middle"
        fill={c.gold}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="700"
        fontSize="11"
        letterSpacing="3"
        opacity="0.8"
      >
        VANGUARD
      </text>
      {/* Divider */}
      <line x1="60" y1="93" x2="140" y2="93" stroke={c.gold} strokeWidth="1" opacity="0.5" />
      {/* Officer insignia */}
      <OfficerInsignia rank={rank} cx={100} cy={125} />
      {/* Rank label */}
      <text
        x="100"
        y="168"
        textAnchor="middle"
        fill={c.text}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="600"
        fontSize="10"
        letterSpacing="1.5"
        opacity="0.9"
      >
        {rank.replace(/-/g, ' ').toUpperCase()}
      </text>
    </svg>
  );
}

export function PatchBadge({ series, rank, size = 120, className = '' }: PatchBadgeProps) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {series === 'watchman' && <ShieldShape rank={rank} size={size} />}
      {series === 'covenant' && <CircleShape rank={rank} size={size} />}
      {series === 'vanguard' && <PentagonShape rank={rank} size={size} />}
    </div>
  );
}
