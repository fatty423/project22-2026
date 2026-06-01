import { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  Check,
  X,
  MessageSquare,
  Clock,
  Filter,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../lib/auth';
import {
  HeroUpdateWithMedia,
  statusColor,
  statusLabel,
} from '../../lib/heroUpdates';
import type { Database } from '../../lib/supabase';

type Veteran = Database['public']['Tables']['veterans']['Row'];

type TabId = 'pending_review' | 'published' | 'rejected' | 'all';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'pending_review', label: 'Pending Review' },
  { id: 'published', label: 'Published' },
  { id: 'rejected', label: 'Changes Requested' },
  { id: 'all', label: 'All' },
];

interface UpdateWithVeteran extends HeroUpdateWithMedia {
  veteran: Veteran | null;
}

export function AdminHeroUpdates() {
  const { user } = useAuth();
  const [tab, setTab] = useState<TabId>('pending_review');
  const [updates, setUpdates] = useState<UpdateWithVeteran[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from('hero_updates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!rows) {
      setUpdates([]);
      setLoading(false);
      return;
    }

    const vetIds = Array.from(new Set(rows.map((r) => r.veteran_id)));
    const updateIds = rows.map((r) => r.id);

    const [{ data: vets }, { data: media }] = await Promise.all([
      supabase.from('veterans').select('*').in('id', vetIds),
      supabase.from('hero_update_media').select('*').in('update_id', updateIds),
    ]);

    const vetMap = new Map<string, Veteran>();
    (vets || []).forEach((v) => vetMap.set(v.id, v));

    const mediaMap = new Map<string, any[]>();
    (media || []).forEach((m) => {
      const list = mediaMap.get(m.update_id) || [];
      list.push(m);
      mediaMap.set(m.update_id, list);
    });

    setUpdates(
      rows.map((r) => ({
        ...r,
        veteran: vetMap.get(r.veteran_id) || null,
        media: mediaMap.get(r.id) || [],
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { pending_review: 0, published: 0, rejected: 0, all: updates.length };
    updates.forEach((u) => {
      if (u.status === 'pending_review') c.pending_review++;
      if (u.status === 'published') c.published++;
      if (u.status === 'rejected') c.rejected++;
    });
    return c;
  }, [updates]);

  const filtered = useMemo(() => {
    if (tab === 'all') return updates;
    return updates.filter((u) => u.status === tab);
  }, [updates, tab]);

  const approveAndPublish = async (id: string) => {
    if (!user) return;
    setReviewing(id);
    const now = new Date().toISOString();
    await supabase
      .from('hero_updates')
      .update({
        status: 'published',
        reviewed_by: user.id,
        reviewed_at: now,
        published_at: now,
        moderation_notes: '',
      })
      .eq('id', id);
    await load();
    setReviewing(null);
  };

  const requestChanges = async (id: string) => {
    if (!user) return;
    const notes = notesDraft[id] || '';
    if (!notes.trim()) {
      alert('Please add a note explaining what should change.');
      return;
    }
    setReviewing(id);
    await supabase
      .from('hero_updates')
      .update({
        status: 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        moderation_notes: notes.trim(),
      })
      .eq('id', id);
    await load();
    setReviewing(null);
  };

  const unpublish = async (id: string) => {
    if (!confirm('Unpublish this update? Donors will no longer see it.')) return;
    setReviewing(id);
    await supabase
      .from('hero_updates')
      .update({ status: 'approved', published_at: null })
      .eq('id', id);
    await load();
    setReviewing(null);
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
        <h1 className="text-2xl font-bold text-slate-900">Hero Updates</h1>
        <p className="text-slate-500 mt-1">
          Review story submissions from heroes before they reach donors.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs opacity-80">({counts[t.id]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="py-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Nothing here right now.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((u) => (
            <Card key={u.id} className="!p-5">
              <div className="flex items-start gap-4 mb-4 flex-wrap">
                {u.veteran && (
                  <img
                    src={u.veteran.photo_url}
                    alt={u.veteran.first_name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(u.status)}`}>
                      {statusLabel(u.status)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {u.author_role === 'admin' ? 'Admin-authored' : 'Hero-authored'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900">{u.title || 'Untitled update'}</h3>
                  <p className="text-xs text-slate-500">
                    {u.veteran
                      ? `${u.veteran.first_name} ${u.veteran.last_initial}. · ${u.veteran.military_branch}`
                      : 'Unknown hero'}
                  </p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none mb-4">
                <p className="text-slate-700 whitespace-pre-wrap">{u.body}</p>
              </div>

              {u.media.length > 0 && (
                <p className="text-xs text-slate-500 mb-3">
                  {u.media.length} media item{u.media.length === 1 ? '' : 's'} attached
                </p>
              )}

              {u.status === 'rejected' && u.moderation_notes && (
                <Alert variant="warning" className="mb-4">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold">Previous feedback</p>
                      <p className="text-sm">{u.moderation_notes}</p>
                    </div>
                  </div>
                </Alert>
              )}

              {u.status === 'pending_review' && (
                <div className="space-y-3">
                  <textarea
                    value={notesDraft[u.id] || ''}
                    onChange={(e) => setNotesDraft((p) => ({ ...p, [u.id]: e.target.value }))}
                    placeholder="Feedback for the hero (required to request changes)"
                    rows={2}
                    className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => requestChanges(u.id)}
                      disabled={reviewing === u.id}
                      className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                      Request Changes
                    </Button>
                    <Button
                      onClick={() => approveAndPublish(u.id)}
                      loading={reviewing === u.id}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Check className="w-4 h-4" />
                      Approve & Publish
                    </Button>
                  </div>
                </div>
              )}

              {u.status === 'published' && (
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Published {u.published_at ? new Date(u.published_at).toLocaleDateString() : ''}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => unpublish(u.id)}
                    disabled={reviewing === u.id}
                  >
                    Unpublish
                  </Button>
                </div>
              )}

              {u.veteran && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <a
                    href={`/admin/heroes/${u.veteran.id}/journey`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                  >
                    Manage {u.veteran.first_name}'s full journey
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
