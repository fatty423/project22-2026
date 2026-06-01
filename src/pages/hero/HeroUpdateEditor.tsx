import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { useHeroAuth } from '../../hooks/useHeroAuth';
import { supabase, Database } from '../../lib/supabase';
import {
  UPDATE_TYPES,
  VISIBILITY_OPTIONS,
  statusLabel,
  statusColor,
} from '../../lib/heroUpdates';

type HeroUpdate = Database['public']['Tables']['hero_updates']['Row'];

export function HeroUpdateEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { user, veteran, loading } = useHeroAuth();

  const [update, setUpdate] = useState<HeroUpdate | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [updateType, setUpdateType] = useState<HeroUpdate['update_type']>('general');
  const [visibility, setVisibility] = useState<HeroUpdate['visibility']>('public');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew || !veteran) return;
    (async () => {
      const { data } = await supabase
        .from('hero_updates')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (data) {
        setUpdate(data);
        setTitle(data.title);
        setBody(data.body);
        setUpdateType(data.update_type);
        setVisibility(data.visibility);
      }
      setInitialLoading(false);
    })();
  }, [id, isNew, veteran]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/hero/login" replace />;
  if (!veteran) return <Navigate to="/hero" replace />;

  const canEdit = !update || ['draft', 'rejected', 'pending_review'].includes(update.status);

  const doSave = async (statusToSet: 'draft' | 'pending_review') => {
    setError('');
    setSuccessMessage('');
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.');
      return;
    }
    if (body.trim().length < 20) {
      setError('Please write at least 20 characters so reviewers have context.');
      return;
    }
    const setLoading = statusToSet === 'pending_review' ? setSubmitting : setSaving;
    setLoading(true);

    try {
      if (isNew || !update) {
        const payload = {
          veteran_id: veteran.id,
          author_id: user.id,
          author_role: 'hero' as const,
          title: title.trim(),
          body: body.trim(),
          update_type: updateType,
          visibility,
          status: statusToSet,
          moderation_notes: '',
          submitted_at: statusToSet === 'pending_review' ? new Date().toISOString() : null,
          reviewed_by: null,
          reviewed_at: null,
          published_at: null,
        };
        const { data, error: err } = await supabase
          .from('hero_updates')
          .insert(payload)
          .select()
          .maybeSingle();
        if (err) throw err;
        if (data) {
          setUpdate(data);
          if (statusToSet === 'pending_review') {
            setSuccessMessage('Your update has been submitted for review.');
            setTimeout(() => navigate('/hero'), 1400);
          } else {
            setSuccessMessage('Draft saved.');
            navigate(`/hero/updates/${data.id}`, { replace: true });
          }
        }
      } else {
        const payload: Partial<HeroUpdate> = {
          title: title.trim(),
          body: body.trim(),
          update_type: updateType,
          visibility,
          status: statusToSet,
          updated_at: new Date().toISOString(),
          ...(statusToSet === 'pending_review'
            ? { submitted_at: new Date().toISOString(), moderation_notes: '' }
            : {}),
        };
        const { data, error: err } = await supabase
          .from('hero_updates')
          .update(payload)
          .eq('id', update.id)
          .select()
          .maybeSingle();
        if (err) throw err;
        if (data) setUpdate(data);
        if (statusToSet === 'pending_review') {
          setSuccessMessage('Update resubmitted for review.');
          setTimeout(() => navigate('/hero'), 1400);
        } else {
          setSuccessMessage('Changes saved.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!update) return;
    if (!confirm('Delete this update? This cannot be undone.')) return;
    const { error: err } = await supabase.from('hero_updates').delete().eq('id', update.id);
    if (err) {
      setError(err.message);
      return;
    }
    navigate('/hero');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/hero" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>

        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isNew ? 'Write an Update' : 'Edit Update'}
            </h1>
            <p className="text-slate-600 mt-1">
              Share progress, milestones, and gratitude with your supporters.
            </p>
          </div>
          {update && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(update.status)}`}>
              {statusLabel(update.status)}
            </span>
          )}
        </div>

        {update?.status === 'rejected' && update.moderation_notes && (
          <Alert variant="error" className="mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Please review and update:</p>
                <p className="text-sm mt-1">{update.moderation_notes}</p>
              </div>
            </div>
          </Alert>
        )}

        <Card>
          <div className="space-y-5">
            {error && <Alert variant="error">{error}</Alert>}
            {successMessage && (
              <Alert variant="success">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {successMessage}
                </div>
              </Alert>
            )}

            <Input
              label="Title"
              placeholder="What would you like to share?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!canEdit}
              maxLength={120}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Update Type</label>
                <select
                  value={updateType}
                  onChange={(e) => setUpdateType(e.target.value as HeroUpdate['update_type'])}
                  disabled={!canEdit}
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {UPDATE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Who can see this</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as HeroUpdate['visibility'])}
                  disabled={!canEdit}
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {VISIBILITY_OPTIONS.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  {VISIBILITY_OPTIONS.find((v) => v.value === visibility)?.description}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Your Story</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                disabled={!canEdit}
                rows={12}
                maxLength={5000}
                placeholder="Share how things are going, what you've accomplished, or thank your supporters..."
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              />
              <p className="text-xs text-slate-500 mt-1">{body.length} / 5000</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold">How reviewing works</p>
                <p className="text-blue-800 mt-1">
                  Text updates are reviewed by our team before they reach donors. You'll get an email once your
                  update is approved or if changes are requested.
                </p>
              </div>
            </div>

            {canEdit ? (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <div>
                  {update && (
                    <Button
                      variant="ghost"
                      onClick={handleDelete}
                      className="text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => doSave('draft')}
                    loading={saving}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={() => doSave('pending_review')}
                    loading={submitting}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit for Review
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-200 text-sm text-slate-500">
                This update is {statusLabel(update!.status).toLowerCase()} and cannot be edited.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
