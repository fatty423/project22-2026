import { supabase, Database } from './supabase';

export type HeroUpdate = Database['public']['Tables']['hero_updates']['Row'];
export type HeroUpdateMedia = Database['public']['Tables']['hero_update_media']['Row'];
export type HeroUpdateWithMedia = HeroUpdate & { media: HeroUpdateMedia[] };

export const UPDATE_TYPES: Array<{ value: HeroUpdate['update_type']; label: string }> = [
  { value: 'general', label: 'General Update' },
  { value: 'milestone', label: 'Milestone Reached' },
  { value: 'training', label: 'Training Progress' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'gratitude', label: 'Thank You' },
];

export const VISIBILITY_OPTIONS: Array<{ value: HeroUpdate['visibility']; label: string; description: string }> = [
  { value: 'public', label: 'Public', description: 'Visible on your public hero page for everyone' },
  { value: 'donors_only', label: 'Donors Only', description: 'Only visible to people who donated to you' },
  { value: 'sponsors_only', label: 'Sponsors Only', description: 'Only visible to active sponsors' },
];

export function statusLabel(status: HeroUpdate['status']): string {
  switch (status) {
    case 'draft': return 'Draft';
    case 'pending_review': return 'Pending Review';
    case 'approved': return 'Approved';
    case 'rejected': return 'Changes Requested';
    case 'published': return 'Published';
  }
}

export function statusColor(status: HeroUpdate['status']): string {
  switch (status) {
    case 'draft': return 'bg-slate-100 text-slate-700';
    case 'pending_review': return 'bg-amber-100 text-amber-800';
    case 'approved': return 'bg-blue-100 text-blue-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'published': return 'bg-emerald-100 text-emerald-800';
  }
}

export async function fetchUpdatesForVeteran(veteranId: string): Promise<HeroUpdateWithMedia[]> {
  const { data: updates } = await supabase
    .from('hero_updates')
    .select('*')
    .eq('veteran_id', veteranId)
    .order('created_at', { ascending: false });

  if (!updates) return [];

  const ids = updates.map((u) => u.id);
  if (ids.length === 0) return updates.map((u) => ({ ...u, media: [] }));

  const { data: media } = await supabase
    .from('hero_update_media')
    .select('*')
    .in('update_id', ids)
    .order('display_order', { ascending: true });

  const mediaMap = new Map<string, HeroUpdateMedia[]>();
  (media || []).forEach((m) => {
    const list = mediaMap.get(m.update_id) || [];
    list.push(m);
    mediaMap.set(m.update_id, list);
  });

  return updates.map((u) => ({ ...u, media: mediaMap.get(u.id) || [] }));
}

export async function fetchPublishedPublicUpdates(veteranId: string): Promise<HeroUpdateWithMedia[]> {
  const all = await fetchUpdatesForVeteran(veteranId);
  return all.filter((u) => u.status === 'published' && u.visibility === 'public');
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return match ? match[1] : null;
}

export function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

export function getEmbedUrl(url: string): string | null {
  const yt = extractYouTubeId(url);
  if (yt) return `https://www.youtube.com/embed/${yt}`;
  const v = extractVimeoId(url);
  if (v) return `https://player.vimeo.com/video/${v}`;
  return null;
}
