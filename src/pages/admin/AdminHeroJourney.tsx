import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Video,
  Link as LinkIcon,
  Upload,
  Loader2,
  X,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { supabase, Database } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../lib/auth';
import {
  HeroUpdateWithMedia,
  UPDATE_TYPES,
  VISIBILITY_OPTIONS,
  fetchUpdatesForVeteran,
  getEmbedUrl,
  statusColor,
  statusLabel,
} from '../../lib/heroUpdates';

type Veteran = Database['public']['Tables']['veterans']['Row'];
type HeroUpdate = Database['public']['Tables']['hero_updates']['Row'];
type HeroMedia = Database['public']['Tables']['hero_update_media']['Row'];

export function AdminHeroJourney() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [veteran, setVeteran] = useState<Veteran | null>(null);
  const [updates, setUpdates] = useState<HeroUpdateWithMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<HeroUpdate | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const { data: vet } = await supabase
      .from('veterans')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    setVeteran(vet);
    if (vet) {
      setUpdates(await fetchUpdatesForVeteran(vet.id));
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!veteran) {
    return (
      <Card className="text-center py-12">
        <p className="text-slate-500">Hero not found.</p>
        <Link to="/admin/heroes" className="text-blue-600 mt-4 inline-block">
          Back to heroes
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/heroes"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Heroes
      </Link>

      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <img
            src={veteran.photo_url}
            alt={veteran.first_name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {veteran.first_name} {veteran.last_initial}.'s Journey
            </h1>
            <p className="text-slate-500 text-sm">
              {veteran.military_branch} · {veteran.current_location}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/heroes/${veteran.id}`} target="_blank">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View public page
            </Button>
          </Link>
          <Button
            onClick={() => {
              setEditing(null);
              setComposerOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Update
          </Button>
        </div>
      </div>

      {composerOpen && user && (
        <UpdateComposer
          veteranId={veteran.id}
          adminUserId={user.id}
          existing={editing}
          onClose={() => setComposerOpen(false)}
          onSaved={async () => {
            setComposerOpen(false);
            setEditing(null);
            await load();
          }}
        />
      )}

      <div className="space-y-4">
        {updates.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500">No journey updates yet.</p>
          </Card>
        ) : (
          updates.map((u) => (
            <JourneyUpdateCard
              key={u.id}
              update={u}
              onEdit={() => {
                setEditing(u);
                setComposerOpen(true);
              }}
              onChanged={load}
            />
          ))
        )}
      </div>
    </div>
  );
}

function JourneyUpdateCard({
  update,
  onEdit,
  onChanged,
}: {
  update: HeroUpdateWithMedia;
  onEdit: () => void;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const publish = async () => {
    setBusy(true);
    await supabase
      .from('hero_updates')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', update.id);
    await onChanged();
    setBusy(false);
  };

  const unpublish = async () => {
    setBusy(true);
    await supabase
      .from('hero_updates')
      .update({ status: 'approved', published_at: null })
      .eq('id', update.id);
    await onChanged();
    setBusy(false);
  };

  const remove = async () => {
    if (!confirm('Delete this update and all its media?')) return;
    setBusy(true);
    await supabase.from('hero_updates').delete().eq('id', update.id);
    await onChanged();
    setBusy(false);
  };

  return (
    <Card className="!p-5">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(update.status)}`}>
              {statusLabel(update.status)}
            </span>
            <span className="text-xs text-slate-400">
              {update.author_role === 'admin' ? 'Admin' : 'Hero'}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(update.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-bold text-slate-900">{update.title || 'Untitled'}</h3>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}>
            Edit
          </Button>
          {update.status === 'published' ? (
            <Button size="sm" variant="outline" onClick={unpublish} disabled={busy}>
              Unpublish
            </Button>
          ) : (
            <Button size="sm" onClick={publish} disabled={busy} className="bg-emerald-600 hover:bg-emerald-700">
              Publish
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={remove} disabled={busy} className="text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-slate-700 whitespace-pre-wrap text-sm mb-3">{update.body}</p>

      {update.media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {update.media.map((m) => (
            <MediaThumb key={m.id} media={m} />
          ))}
        </div>
      )}
    </Card>
  );
}

function MediaThumb({ media }: { media: HeroMedia }) {
  if (media.media_type === 'image') {
    const url = supabase.storage.from('hero-media').getPublicUrl(media.storage_path).data.publicUrl;
    return (
      <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
        <img src={url} alt={media.caption} className="w-full h-full object-cover" />
      </div>
    );
  }

  if (media.media_type === 'video' && media.storage_path) {
    const url = supabase.storage.from('hero-media').getPublicUrl(media.storage_path).data.publicUrl;
    return (
      <div className="aspect-video rounded-lg overflow-hidden bg-slate-900">
        <video src={url} controls className="w-full h-full object-cover" />
      </div>
    );
  }

  const embed = getEmbedUrl(media.external_url);
  if (embed) {
    return (
      <div className="aspect-video rounded-lg overflow-hidden bg-slate-900">
        <iframe src={embed} className="w-full h-full" allowFullScreen />
      </div>
    );
  }

  return (
    <div className="aspect-square rounded-lg bg-slate-100 flex items-center justify-center">
      <Video className="w-6 h-6 text-slate-400" />
    </div>
  );
}

function UpdateComposer({
  veteranId,
  adminUserId,
  existing,
  onClose,
  onSaved,
}: {
  veteranId: string;
  adminUserId: string;
  existing: HeroUpdate | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(existing?.title || '');
  const [body, setBody] = useState(existing?.body || '');
  const [updateType, setUpdateType] = useState<HeroUpdate['update_type']>(existing?.update_type || 'milestone');
  const [visibility, setVisibility] = useState<HeroUpdate['visibility']>(existing?.visibility || 'public');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [media, setMedia] = useState<HeroMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(!!existing);

  useEffect(() => {
    if (!existing) return;
    supabase
      .from('hero_update_media')
      .select('*')
      .eq('update_id', existing.id)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        setMedia(data || []);
        setLoadingMedia(false);
      });
  }, [existing]);

  const saveAndMaybePublish = async (publish: boolean) => {
    setError('');
    if (!title.trim() || !body.trim()) {
      setError('Please add both a title and a body.');
      return;
    }
    setSaving(true);
    try {
      const now = new Date().toISOString();
      if (!existing) {
        const payload = {
          veteran_id: veteranId,
          author_id: adminUserId,
          author_role: 'admin' as const,
          title: title.trim(),
          body: body.trim(),
          update_type: updateType,
          visibility,
          status: publish ? ('published' as const) : ('approved' as const),
          moderation_notes: '',
          submitted_at: now,
          reviewed_by: adminUserId,
          reviewed_at: now,
          published_at: publish ? now : null,
        };
        const { error: err } = await supabase
          .from('hero_updates')
          .insert(payload);
        if (err) throw err;
      } else {
        const payload: Partial<HeroUpdate> = {
          title: title.trim(),
          body: body.trim(),
          update_type: updateType,
          visibility,
          updated_at: now,
        };
        if (publish) {
          payload.status = 'published';
          payload.published_at = existing.published_at || now;
          payload.reviewed_by = adminUserId;
          payload.reviewed_at = now;
        }
        const { error: err } = await supabase
          .from('hero_updates')
          .update(payload)
          .eq('id', existing.id);
        if (err) throw err;
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    if (!existing) {
      setError('Save the update first, then add photos.');
      return;
    }
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${veteranId}/${existing.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('hero-media')
      .upload(path, file, { contentType: file.type });
    if (upErr) {
      setError(upErr.message);
      return;
    }
    const { data, error: insErr } = await supabase
      .from('hero_update_media')
      .insert({
        update_id: existing.id,
        media_type: 'image',
        storage_path: path,
        external_url: '',
        caption: '',
        display_order: media.length,
      })
      .select()
      .maybeSingle();
    if (insErr) {
      setError(insErr.message);
      return;
    }
    if (data) setMedia((m) => [...m, data]);
  };

  const uploadVideo = async (file: File) => {
    if (!existing) {
      setError('Save the update first, then add videos.');
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      setError('Video file too large. Please keep videos under 200MB, or paste a YouTube/Vimeo link instead.');
      return;
    }
    const ext = file.name.split('.').pop() || 'mp4';
    const path = `${veteranId}/${existing.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('hero-media')
      .upload(path, file, { contentType: file.type });
    if (upErr) {
      setError(upErr.message);
      return;
    }
    const { data, error: insErr } = await supabase
      .from('hero_update_media')
      .insert({
        update_id: existing.id,
        media_type: 'video',
        storage_path: path,
        external_url: '',
        caption: '',
        display_order: media.length,
      })
      .select()
      .maybeSingle();
    if (insErr) {
      setError(insErr.message);
      return;
    }
    if (data) setMedia((m) => [...m, data]);
  };

  const addVideoEmbed = async (url: string) => {
    if (!existing) {
      setError('Save the update first, then add videos.');
      return;
    }
    const embed = getEmbedUrl(url);
    if (!embed) {
      setError('Enter a YouTube or Vimeo URL.');
      return;
    }
    const { data } = await supabase
      .from('hero_update_media')
      .insert({
        update_id: existing.id,
        media_type: 'embed',
        storage_path: '',
        external_url: url,
        caption: '',
        display_order: media.length,
      })
      .select()
      .maybeSingle();
    if (data) setMedia((m) => [...m, data]);
  };

  const removeMedia = async (m: HeroMedia) => {
    if (m.storage_path) {
      await supabase.storage.from('hero-media').remove([m.storage_path]);
    }
    await supabase.from('hero_update_media').delete().eq('id', m.id);
    setMedia((prev) => prev.filter((p) => p.id !== m.id));
  };

  return (
    <Card className="!p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h2 className="font-bold text-slate-900">{existing ? 'Edit update' : 'New update'}</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-200">
          <X className="w-4 h-4 text-slate-600" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Training milestone reached"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
            <select
              value={updateType}
              onChange={(e) => setUpdateType(e.target.value as any)}
              className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            >
              {UPDATE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            >
              {VISIBILITY_OPTIONS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm resize-y"
            placeholder="Share an update on behalf of the hero..."
          />
        </div>

        <MediaEditor
          disabled={!existing}
          media={media}
          onUpload={uploadImage}
          onUploadVideo={uploadVideo}
          onAddEmbed={addVideoEmbed}
          onRemove={removeMedia}
          loadingMedia={loadingMedia}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={() => saveAndMaybePublish(false)} loading={saving}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={() => saveAndMaybePublish(true)}
            loading={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
    </Card>
  );
}

function MediaEditor({
  media,
  disabled,
  loadingMedia,
  onUpload,
  onUploadVideo,
  onAddEmbed,
  onRemove,
}: {
  media: HeroMedia[];
  disabled: boolean;
  loadingMedia: boolean;
  onUpload: (f: File) => Promise<void>;
  onUploadVideo: (f: File) => Promise<void>;
  onAddEmbed: (url: string) => Promise<void>;
  onRemove: (m: HeroMedia) => Promise<void>;
}) {
  const [embedUrl, setEmbedUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-2">Photos & Video</label>
      {disabled && (
        <p className="text-xs text-slate-500 mb-2">Save the update first, then add media.</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <label
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer ${
            disabled ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed' : 'border-blue-200 text-blue-700 hover:bg-blue-50'
          }`}
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload image'}
          <input
            type="file"
            accept="image/*"
            disabled={disabled || uploading}
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setUploading(true);
              await onUpload(f);
              setUploading(false);
              e.target.value = '';
            }}
          />
        </label>

        <label
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer ${
            disabled ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <Video className="w-4 h-4" />
          {uploadingVideo ? 'Uploading...' : 'Upload video'}
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/*"
            disabled={disabled || uploadingVideo}
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setUploadingVideo(true);
              await onUploadVideo(f);
              setUploadingVideo(false);
              e.target.value = '';
            }}
          />
        </label>

        <div className="flex-1 min-w-[240px] flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="YouTube or Vimeo URL"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              disabled={disabled}
            />
          </div>
          <Button
            variant="outline"
            disabled={disabled || !embedUrl}
            onClick={async () => {
              await onAddEmbed(embedUrl);
              setEmbedUrl('');
            }}
            className="flex items-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {loadingMedia ? (
        <p className="text-sm text-slate-500">Loading media...</p>
      ) : media.length === 0 ? (
        <p className="text-sm text-slate-500">No media yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {media.map((m) => (
            <div key={m.id} className="relative group">
              {m.media_type === 'image' ? (
                <img
                  src={supabase.storage.from('hero-media').getPublicUrl(m.storage_path).data.publicUrl}
                  alt={m.caption}
                  className="aspect-square object-cover w-full rounded-lg"
                />
              ) : m.media_type === 'video' && m.storage_path ? (
                <video
                  src={supabase.storage.from('hero-media').getPublicUrl(m.storage_path).data.publicUrl}
                  controls
                  className="aspect-square object-cover w-full rounded-lg bg-slate-900"
                />
              ) : (
                <div className="aspect-square bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white text-xs p-2 text-center">
                  <Video className="w-6 h-6 mb-1" />
                  {m.external_url.slice(0, 40)}
                </div>
              )}
              <button
                onClick={() => onRemove(m)}
                className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
