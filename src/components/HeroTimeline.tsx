import { Check, Clock, Circle } from 'lucide-react';
import type { Database } from '../lib/supabase';

type VeteranProgress = Database['public']['Tables']['veteran_progress']['Row'];

interface HeroTimelineProps {
  milestones: VeteranProgress[];
  compact?: boolean;
}

export function HeroTimeline({ milestones, compact = false }: HeroTimelineProps) {
  const sorted = [...milestones].sort((a, b) => a.sort_order - b.sort_order);

  if (sorted.length === 0) return null;

  if (compact) {
    return <CompactTimeline milestones={sorted} />;
  }

  return <FullTimeline milestones={sorted} />;
}

function FullTimeline({ milestones }: { milestones: VeteranProgress[] }) {
  return (
    <div className="relative">
      {milestones.map((milestone, index) => {
        const isLast = index === milestones.length - 1;
        const isCompleted = milestone.status === 'completed';
        const isActive = milestone.status === 'in_progress';

        return (
          <div key={milestone.id} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <MilestoneIcon status={milestone.status} />
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-[2rem] ${
                    isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>

            <div className={`pb-8 flex-1 min-w-0 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-3 flex-wrap">
                <h4
                  className={`font-semibold text-sm ${
                    isCompleted
                      ? 'text-slate-900'
                      : isActive
                      ? 'text-brand-marine'
                      : 'text-slate-400'
                  }`}
                >
                  {milestone.milestone}
                </h4>
                {isActive && (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-brand-marine/10 text-brand-marine rounded-full">
                    {milestone.completion_percentage}%
                  </span>
                )}
              </div>

              <p
                className={`text-sm mt-1 leading-relaxed ${
                  isCompleted || isActive ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {milestone.description}
              </p>

              {isCompleted && milestone.completed_at && (
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(milestone.completed_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}

              {isActive && (
                <div className="mt-2 w-full max-w-[200px]">
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-marine rounded-full transition-all duration-700"
                      style={{ width: `${milestone.completion_percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CompactTimeline({ milestones }: { milestones: VeteranProgress[] }) {
  const activeIndex = milestones.findIndex((m) => m.status === 'in_progress');
  const currentStep = activeIndex >= 0 ? activeIndex + 1 : milestones.filter((m) => m.status === 'completed').length;
  const activeMilestone = milestones.find((m) => m.status === 'in_progress');

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Journey Progress</p>
        <p className="text-xs font-semibold text-slate-600">
          Step {currentStep} of {milestones.length}
        </p>
      </div>

      <div className="flex items-center gap-1">
        {milestones.map((milestone, index) => {
          const isCompleted = milestone.status === 'completed';
          const isActive = milestone.status === 'in_progress';

          return (
            <div key={milestone.id} className="flex-1 relative group">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isActive
                    ? 'bg-brand-marine'
                    : 'bg-slate-200'
                }`}
              />
              {isActive && (
                <div className="absolute inset-0 h-2 rounded-full bg-brand-marine/80 animate-pulse" />
              )}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {milestone.milestone}
                {isActive && ` (${milestone.completion_percentage}%)`}
              </div>
              {index === 0 && (
                <div
                  className={`absolute -left-0.5 -top-[3px] w-2 h-2 rounded-full border-2 border-white ${
                    isCompleted ? 'bg-emerald-500' : isActive ? 'bg-brand-marine' : 'bg-slate-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {activeMilestone && (
        <p className="text-xs text-brand-marine font-medium mt-2">
          Currently: {activeMilestone.milestone} ({activeMilestone.completion_percentage}%)
        </p>
      )}
    </div>
  );
}

function MilestoneIcon({ status }: { status: string }) {
  if (status === 'completed') {
    return (
      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-200">
        <Check className="w-4 h-4 text-white" strokeWidth={3} />
      </div>
    );
  }

  if (status === 'in_progress') {
    return (
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-brand-marine flex items-center justify-center shadow-sm shadow-brand-marine/40">
          <div className="w-2.5 h-2.5 bg-white rounded-full" />
        </div>
        <div className="absolute inset-0 w-8 h-8 rounded-full bg-brand-marine/60 animate-ping opacity-30" />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center flex-shrink-0 bg-white">
      <Circle className="w-3 h-3 text-slate-300" />
    </div>
  );
}
