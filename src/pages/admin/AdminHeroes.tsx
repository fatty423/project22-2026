import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2,
  X,
  Check,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Shield,
  MessageSquareHeart,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { Database } from '../../lib/supabase';

type Veteran = Database['public']['Tables']['veterans']['Row'];
type VeteranProgress = Database['public']['Tables']['veteran_progress']['Row'];

const DEFAULT_MILESTONES = [
  { milestone: 'Application Approved', sort_order: 1 },
  { milestone: 'Funding Secured', sort_order: 2 },
  { milestone: 'Training Started', sort_order: 3 },
  { milestone: 'Certifications Earned', sort_order: 4 },
  { milestone: 'Job Placement', sort_order: 5 },
  { milestone: 'Mentorship Phase', sort_order: 6 },
  { milestone: 'Career Established', sort_order: 7 },
  { milestone: 'Success Story', sort_order: 8 },
];

interface VeteranWithProgress extends Veteran {
  progress: VeteranProgress[];
}

export function AdminHeroes() {
  const [veterans, setVeterans] = useState<VeteranWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVeteran, setEditingVeteran] = useState<VeteranWithProgress | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadVeterans = useCallback(async () => {
    const { data: vets } = await supabase
      .from('veterans')
      .select('*')
      .order('first_name', { ascending: true });

    if (!vets) {
      setLoading(false);
      return;
    }

    const { data: allProgress } = await supabase
      .from('veteran_progress')
      .select('*')
      .order('sort_order', { ascending: true });

    const progressMap = new Map<string, VeteranProgress[]>();
    (allProgress || []).forEach((p) => {
      const list = progressMap.get(p.veteran_id) || [];
      list.push(p);
      progressMap.set(p.veteran_id, list);
    });

    setVeterans(
      vets.map((v) => ({
        ...v,
        progress: progressMap.get(v.id) || [],
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadVeterans();
  }, [loadVeterans]);

  const getCurrentStep = (progress: VeteranProgress[]) => {
    const active = progress.find((m) => m.status === 'in_progress');
    if (active) return active.milestone;
    const completed = progress.filter((m) => m.status === 'completed');
    if (completed.length === progress.length && progress.length > 0) return 'Completed';
    if (completed.length > 0) return completed[completed.length - 1].milestone;
    return 'Not started';
  };

  const getProgressPercent = (progress: VeteranProgress[]) => {
    if (progress.length === 0) return 0;
    const completed = progress.filter((m) => m.status === 'completed').length;
    return Math.round((completed / progress.length) * 100);
  };

  const handleInitMilestones = async (veteran: VeteranWithProgress) => {
    const inserts = DEFAULT_MILESTONES.map((m) => ({
      veteran_id: veteran.id,
      milestone: m.milestone,
      description: '',
      completion_percentage: 0,
      sort_order: m.sort_order,
      status: 'upcoming' as const,
      completed_at: null,
    }));

    const { data, error } = await supabase
      .from('veteran_progress')
      .insert(inserts)
      .select();

    if (!error && data) {
      setVeterans((prev) =>
        prev.map((v) => (v.id === veteran.id ? { ...v, progress: data } : v))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hero Progress</h1>
        <p className="text-slate-500 mt-1">
          Manage journey milestones for {veterans.length} hero{veterans.length !== 1 ? 'es' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {veterans.map((veteran) => {
          const isExpanded = expandedId === veteran.id;
          const percent = getProgressPercent(veteran.progress);
          const currentStep = getCurrentStep(veteran.progress);

          return (
            <Card key={veteran.id} className="!p-0 overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : veteran.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <img
                  src={veteran.photo_url}
                  alt={`${veteran.first_name} ${veteran.last_initial}.`}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      {veteran.first_name} {veteran.last_initial}.
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      {veteran.military_branch}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {veteran.progress.length > 0 ? currentStep : 'No milestones'}
                  </p>
                </div>

                {veteran.progress.length > 0 && (
                  <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                    <div className="w-32">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-600 w-10 text-right">
                      {percent}%
                    </span>
                  </div>
                )}

                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50 p-5">
                  {veteran.progress.length === 0 ? (
                    <div className="text-center py-6">
                      <Shield className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 mb-4">No milestones set up yet</p>
                      <Button
                        onClick={() => handleInitMilestones(veteran)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Initialize 8 Default Milestones
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <p className="text-sm font-semibold text-slate-700">
                          {veteran.progress.filter((m) => m.status === 'completed').length} of{' '}
                          {veteran.progress.length} milestones completed
                        </p>
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/heroes/${veteran.id}/journey`}>
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              <MessageSquareHeart className="w-4 h-4" />
                              Manage Journey
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            onClick={() => setEditingVeteran(veteran)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Edit Milestones
                          </Button>
                        </div>
                      </div>

                      {veteran.progress
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((m) => (
                          <MilestoneRow key={m.id} milestone={m} />
                        ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {editingVeteran && (
        <EditMilestonesModal
          veteran={editingVeteran}
          onClose={() => setEditingVeteran(null)}
          onSaved={(updated) => {
            setVeterans((prev) =>
              prev.map((v) => (v.id === updated.id ? { ...v, progress: updated.progress } : v))
            );
            setEditingVeteran(null);
          }}
        />
      )}
    </div>
  );
}

function MilestoneRow({ milestone }: { milestone: VeteranProgress }) {
  const isCompleted = milestone.status === 'completed';
  const isActive = milestone.status === 'in_progress';

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg ${
        isCompleted ? 'bg-white' : isActive ? 'bg-blue-50 border border-blue-200' : 'bg-white opacity-60'
      }`}
    >
      <div className="flex-shrink-0">
        {isCompleted ? (
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        ) : isActive ? (
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full border-2 border-slate-200 flex items-center justify-center">
            <Circle className="w-3 h-3 text-slate-300" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isCompleted || isActive ? 'text-slate-900' : 'text-slate-400'}`}>
          {milestone.milestone}
        </p>
        {milestone.description && (
          <p className="text-xs text-slate-500 truncate">{milestone.description}</p>
        )}
      </div>

      {isActive && (
        <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex-shrink-0">
          {milestone.completion_percentage}%
        </span>
      )}

      {isCompleted && milestone.completed_at && (
        <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
          <Clock className="w-3 h-3" />
          {new Date(milestone.completed_at).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

interface EditModalProps {
  veteran: VeteranWithProgress;
  onClose: () => void;
  onSaved: (veteran: VeteranWithProgress) => void;
}

interface MilestoneEdit {
  id: string;
  milestone: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  completion_percentage: number;
  sort_order: number;
  completed_at: string | null;
}

function EditMilestonesModal({ veteran, onClose, onSaved }: EditModalProps) {
  const [edits, setEdits] = useState<MilestoneEdit[]>(
    veteran.progress
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((m) => ({
        id: m.id,
        milestone: m.milestone,
        description: m.description,
        status: m.status,
        completion_percentage: m.completion_percentage,
        sort_order: m.sort_order,
        completed_at: m.completed_at,
      }))
  );
  const [saving, setSaving] = useState(false);

  const updateEdit = (index: number, changes: Partial<MilestoneEdit>) => {
    setEdits((prev) => prev.map((e, i) => (i === index ? { ...e, ...changes } : e)));
  };

  const setStatus = (index: number, newStatus: 'completed' | 'in_progress' | 'upcoming') => {
    setEdits((prev) =>
      prev.map((e, i) => {
        if (i !== index) {
          if (newStatus === 'in_progress' && e.status === 'in_progress') {
            return { ...e, status: 'upcoming', completion_percentage: 0, completed_at: null };
          }
          return e;
        }

        if (newStatus === 'completed') {
          return {
            ...e,
            status: 'completed',
            completion_percentage: 100,
            completed_at: e.completed_at || new Date().toISOString(),
          };
        }
        if (newStatus === 'in_progress') {
          return {
            ...e,
            status: 'in_progress',
            completion_percentage: e.completion_percentage === 100 ? 50 : e.completion_percentage,
            completed_at: null,
          };
        }
        return { ...e, status: 'upcoming', completion_percentage: 0, completed_at: null };
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);

    const updates = edits.map((e) =>
      supabase
        .from('veteran_progress')
        .update({
          description: e.description,
          status: e.status,
          completion_percentage: e.completion_percentage,
          completed_at: e.completed_at,
        })
        .eq('id', e.id)
    );

    await Promise.all(updates);

    const { data } = await supabase
      .from('veteran_progress')
      .select('*')
      .eq('veteran_id', veteran.id)
      .order('sort_order', { ascending: true });

    setSaving(false);
    onSaved({ ...veteran, progress: data || [] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-12 px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <img
              src={veteran.photo_url}
              alt=""
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {veteran.first_name} {veteran.last_initial}. -- Milestones
              </h2>
              <p className="text-xs text-slate-500">{veteran.military_branch}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {edits.map((edit, index) => (
            <div
              key={edit.id}
              className={`rounded-xl border p-4 transition-colors ${
                edit.status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : edit.status === 'in_progress'
                  ? 'border-blue-200 bg-blue-50/50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  {edit.sort_order}
                </span>
                <h4 className="font-semibold text-slate-900 flex-1">{edit.milestone}</h4>
              </div>

              <div className="flex gap-2 mb-3">
                {(['completed', 'in_progress', 'upcoming'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(index, s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      edit.status === s
                        ? s === 'completed'
                          ? 'bg-emerald-500 text-white'
                          : s === 'in_progress'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-500 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {s === 'completed' ? 'Completed' : s === 'in_progress' ? 'In Progress' : 'Upcoming'}
                  </button>
                ))}
              </div>

              <textarea
                value={edit.description}
                onChange={(e) => updateEdit(index, { description: e.target.value })}
                placeholder="Description of this milestone..."
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />

              {edit.status === 'in_progress' && (
                <div className="mt-3 flex items-center gap-3">
                  <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Progress:</label>
                  <input
                    type="range"
                    min={0}
                    max={99}
                    value={edit.completion_percentage}
                    onChange={(e) =>
                      updateEdit(index, { completion_percentage: parseInt(e.target.value) })
                    }
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-sm font-bold text-blue-600 w-10 text-right">
                    {edit.completion_percentage}%
                  </span>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
