interface PatchBadgeProps {
  series: 'watchman' | 'covenant' | 'vanguard';
  rank: string;
  size?: number;
  className?: string;
}

const SCARLET = '#940000';
const GOLD = '#84754E';
const DARK_BG = '#001E2E';
const SILVER = '#A8A9AD';
const WHITE = '#FFFFFF';
const CREAM = '#D4C9A8';

function starPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 2) + (i * Math.PI / 5);
    const r = i % 2 === 0 ? outerR : innerR;
    points.push(`${cx + r * Math.cos(angle)},${cy - r * Math.sin(angle)}`);
  }
  return points.join(' ');
}

function ShieldShape({ rank, size }: { rank: string; size: number }) {
  const rankIndex =
    rank === 'recruit' ? 0 :
    rank === 'pvt-1st-class' ? 1 :
    rank === 'corporal' ? 2 :
    rank === 'sergeant' ? 3 :
    rank === 'staff-sergeant' ? 4 :
    rank === 'master-sergeant' ? 5 : 0;

  const isSenior = rankIndex >= 3;
  const borderColor = isSenior ? GOLD : SCARLET;
  const isMasterSgt = rank === 'master-sergeant';

  const chevronCount =
    rank === 'recruit' ? 0 :
    rank === 'pvt-1st-class' ? 1 :
    rank === 'corporal' ? 2 : 3;

  const rockerCount =
    rank === 'staff-sergeant' ? 1 :
    rank === 'master-sergeant' ? 2 : 0;

  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} xmlns="http://www.w3.org/2000/svg">
      {isMasterSgt && (
        <path
          d="M100 6 L189 48 L189 144 Q189 206 100 236 Q11 206 11 144 L11 48 Z"
          fill="none"
          stroke={SCARLET}
          strokeWidth="4"
        />
      )}
      <path
        d="M100 10 L185 50 L185 140 Q185 200 100 230 Q15 200 15 140 L15 50 Z"
        fill={DARK_BG}
        stroke={borderColor}
        strokeWidth="6"
      />
      <path
        d="M100 22 L175 56 L175 138 Q175 194 100 220 Q25 194 25 138 L25 56 Z"
        fill="none"
        stroke={borderColor}
        strokeWidth="1.5"
        opacity="0.3"
        strokeDasharray="4 3"
      />

      {/* P22 gold star at top */}
      <polygon
        points={starPoints(100, 48, 10, 4)}
        fill={GOLD}
      />

      {rank === 'recruit' ? (
        <rect x={86} y={120} width={28} height={4} fill={GOLD} rx="1" />
      ) : (
        <g>
          {Array.from({ length: chevronCount }).map((_, i) => {
            const cy = 95 + i * 16;
            return (
              <path
                key={`c-${i}`}
                d={`M68,${cy + 12} L100,${cy} L132,${cy + 12}`}
                fill="none"
                stroke={GOLD}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
          {rockerCount > 0 && Array.from({ length: rockerCount }).map((_, i) => {
            const cy = 95 + chevronCount * 16 + 10 + i * 14;
            return (
              <path
                key={`r-${i}`}
                d={`M68,${cy} Q100,${cy + 14} 132,${cy}`}
                fill="none"
                stroke={GOLD}
                strokeWidth="6"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      )}

      <text
        x="100" y="210"
        textAnchor="middle"
        fill={WHITE}
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

function CircleShape({ rank, size }: { rank: string; size: number }) {
  const rankLevel =
    rank === 'field-chapel' ? 0 :
    rank === 'mission-chapel' ? 1 :
    rank === 'battalion-chapel' ? 2 :
    rank === 'regimental-chapel' ? 3 :
    rank === 'command-chapel' ? 4 : 0;

  const isHighRank = rankLevel >= 3;
  const isTop = rankLevel === 4;
  const crossColor = isHighRank ? GOLD : CREAM;

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      {isTop && (
        <circle cx="100" cy="100" r="96" fill="none" stroke={GOLD} strokeWidth="3" />
      )}
      <circle cx="100" cy="100" r="92" fill={DARK_BG} stroke={GOLD} strokeWidth="5" />
      <circle cx="100" cy="100" r="82" fill="none" stroke={GOLD} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />

      {/* Cross */}
      <rect x={95} y={60} width={10} height={60} fill={crossColor} rx="1" />
      <rect x={72} y={85} width={56} height={10} fill={crossColor} rx="1" />

      {isHighRank && (
        <circle cx="100" cy="90" r="35" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.5" />
      )}

      {/* Stars around the cross based on rank */}
      {rankLevel >= 1 && (
        <polygon points={starPoints(100, 135, 7, 3)} fill={GOLD} />
      )}
      {rankLevel >= 2 && (
        <>
          <polygon points={starPoints(62, 90, 6, 2.5)} fill={GOLD} />
          <polygon points={starPoints(138, 90, 6, 2.5)} fill={GOLD} />
        </>
      )}
      {rankLevel >= 3 && (
        <>
          <polygon points={starPoints(78, 67, 5, 2)} fill={GOLD} />
          <polygon points={starPoints(122, 67, 5, 2)} fill={GOLD} />
          <polygon points={starPoints(78, 113, 5, 2)} fill={GOLD} />
          <polygon points={starPoints(122, 113, 5, 2)} fill={GOLD} />
        </>
      )}
      {rankLevel >= 4 && (
        <>
          <polygon points={starPoints(100, 55, 5, 2)} fill={GOLD} />
          <polygon points={starPoints(70, 78, 4, 1.5)} fill={GOLD} />
          <polygon points={starPoints(130, 78, 4, 1.5)} fill={GOLD} />
          <polygon points={starPoints(70, 102, 4, 1.5)} fill={GOLD} />
          <polygon points={starPoints(130, 102, 4, 1.5)} fill={GOLD} />
        </>
      )}

      <text
        x="100" y="170"
        textAnchor="middle"
        fill={WHITE}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="600"
        fontSize="9"
        letterSpacing="1.5"
        opacity="0.9"
      >
        {rank.replace(/-/g, ' ').toUpperCase()}
      </text>
    </svg>
  );
}

function PentagonShape({ rank, size }: { rank: string; size: number }) {
  const rankIndex =
    rank === 'field-ally' ? 0 :
    rank === 'tactical-partner' ? 1 :
    rank === 'strategic-command' ? 2 :
    rank === 'operational-command' ? 3 :
    rank === 'general-partner' ? 4 : 0;

  const isOfficer = rankIndex >= 2;
  const borderColor = isOfficer ? GOLD : SILVER;
  const isGeneral = rank === 'general-partner';

  return (
    <svg viewBox="0 0 200 210" width={size} height={size * 1.05} xmlns="http://www.w3.org/2000/svg">
      {isGeneral && (
        <polygon
          points="100,6 194,70 159,189 41,189 6,70"
          fill="none"
          stroke={SCARLET}
          strokeWidth="4"
        />
      )}
      <polygon
        points="100,10 190,72 155,185 45,185 10,72"
        fill="#1a1a2e"
        stroke={borderColor}
        strokeWidth="5"
      />
      <polygon
        points="100,24 178,78 147,178 53,178 22,78"
        fill="none"
        stroke={borderColor}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.3"
      />

      {/* P22 star at top */}
      <polygon
        points={starPoints(100, 55, 8, 3)}
        fill={GOLD}
      />

      {/* Insignia */}
      {rank === 'field-ally' && (
        <rect x={96} y={82} width={8} height={32} fill={GOLD} rx="1" />
      )}
      {rank === 'tactical-partner' && (
        <g>
          <rect x={88} y={82} width={8} height={32} fill={GOLD} rx="1" />
          <rect x={104} y={82} width={8} height={32} fill={GOLD} rx="1" />
        </g>
      )}
      {rank === 'strategic-command' && (
        <g>
          {/* Star with wings - eagle/aviator style */}
          <polygon points={starPoints(100, 100, 12, 5)} fill={GOLD} />
          {/* Wings */}
          <path d="M88,100 Q75,88 58,92 Q70,96 82,100" fill={GOLD} opacity="0.9" />
          <path d="M112,100 Q125,88 142,92 Q130,96 118,100" fill={GOLD} opacity="0.9" />
          <path d="M85,103 Q72,95 55,98 Q68,100 80,103" fill={GOLD} opacity="0.7" />
          <path d="M115,103 Q128,95 145,98 Q132,100 120,103" fill={GOLD} opacity="0.7" />
        </g>
      )}
      {rank === 'operational-command' && (
        <g>
          {/* Larger eagle with spread wings */}
          <polygon points={starPoints(100, 97, 10, 4)} fill={GOLD} />
          {/* Wide spread wings */}
          <path d="M90,97 Q72,80 50,82 Q65,90 82,97" fill={GOLD} />
          <path d="M110,97 Q128,80 150,82 Q135,90 118,97" fill={GOLD} />
          <path d="M87,102 Q70,90 48,92 Q63,96 80,102" fill={GOLD} opacity="0.8" />
          <path d="M113,102 Q130,90 152,92 Q137,96 120,102" fill={GOLD} opacity="0.8" />
          {/* Tail feathers */}
          <path d="M94,108 Q100,120 106,108" fill={GOLD} opacity="0.8" />
        </g>
      )}
      {rank === 'general-partner' && (
        <g>
          {/* Single large general's star */}
          <polygon points={starPoints(100, 105, 26, 11)} fill={GOLD} />
        </g>
      )}

      <text
        x="100" y="172"
        textAnchor="middle"
        fill={WHITE}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="600"
        fontSize="9"
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
