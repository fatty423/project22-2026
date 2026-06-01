import { useEffect, useMemo, useState } from 'react';
import { Heart, MessageSquareHeart, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { supabase, Database } from '../../lib/supabase';
import { getEmbedUrl, HeroUpdateWithMedia } from '../../lib/heroUpdates';

type Veteran = Database['public']['Tables']['veterans']['Row'];
type Donation = Database['public']['Tables']['donations']['Row'];

interface FeedItem extends HeroUpdateWithMedia {
  veteran: Veteran;
  isFirstTimeDonor: boolean;
  donationCount: number;
}

interface Props {
  donorId: string;
  donations: Donation[];
}

export function DonorHeroUpdatesFeed({ donorId, donations }: Props) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const donatedVeteranIds = useMemo(() => {
    return Array.from(
      new Set(
        donations
          .filter((d) => d.status === 'succeeded' && d.veteran_id)
          .map((d) => d.veteran_id as string)
      )
    );
  }, [donations]);

  const donationCountByVet = useMemo(() => {
    const map = new Map<string, number>();
    donations
      .filter((d) => d.status === 'succeeded' && d.veteran_id)
      .forEach((d) => {
        map.set(d.veteran_id as string, (map.get(d.veteran_id as string) || 0) + 1);
      });
    return map;
  }, [donations]);

  useEffect(() => {
    if (donatedVeteranIds.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    (async () => {
      const [{ data: updates }, { data: vets }] = await Promise.all([
        supabase
          .from('hero_updates')
          .select('*')
          .in('veteran_id', donatedVeteranIds)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(25),
        supabase.from('veterans').select('*').in('id', donatedVeteranIds),
      ]);

      const updateIds = (updates || []).map((u) => u.id);
      const { data: media } = updateIds.length
        ? await supabase.from('hero_update_media').select('*').in('update_id', updateIds)
        : { data: [] as any[] };

      const vetMap = new Map<string, Veteran>();
      (vets || []).forEach((v) => vetMap.set(v.id, v));

      const mediaMap = new Map<string, any[]>();
      (media || []).forEach((m) => {
        const list = mediaMap.get(m.update_id) || [];
        list.push(m);
        mediaMap.set(m.update_id, list);
      });

      const visible = (updates || []).filter((u) => {
        if (u.visibility === 'public' || u.visibility === 'donors_only') return true;
        return false;
      });

      const feed: FeedItem[] = visible
        .map((u) => {
          const vet = vetMap.get(u.veteran_id);
          if (!vet) return null;
          const count = donationCountByVet.get(u.veteran_id) || 0;
          return {
            ...u,
            media: mediaMap.get(u.id) || [],
            veteran: vet,
            donationCount: count,
            isFirstTimeDonor: count === 1,
          } as FeedItem;
        })
        .filter((x): x is FeedItem => x !== null);

      setItems(feed);
      setLoading(false);
    })();
  }, [donatedVeteranIds, donationCountByVet, donorId]);

  if (loading) {
    return (
      <Card>
        <div className="h-24 flex items-center justify-center text-slate-400 text-sm">
          Loading updates...
        </div>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-3 mb-2">
          <MessageSquareHeart className="w-5 h-5 text-brand-marine" />
          <h3 className="text-lg font-bold text-slate-900">Updates from your heroes</h3>
        </div>
        <p className="text-sm text-slate-500">
          When a hero you've supported shares a new story, you'll see it here.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <MessageSquareHeart className="w-5 h-5 text-brand-marine" />
        <h3 className="text-lg font-bold text-slate-900">Updates from your heroes</h3>
      </div>
      <div className="space-y-6">
        {items.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <article className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={item.veteran.photo_url}
          alt={item.veteran.first_name}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">
            {item.veteran.first_name} {item.veteran.last_initial}.
          </p>
          <p className="text-xs text-slate-500">
            {item.veteran.military_branch} ·{' '}
            {item.published_at ? new Date(item.published_at).toLocaleDateString() : ''}
          </p>
        </div>
        <DonorBadge isFirstTime={item.isFirstTimeDonor} count={item.donationCount} />
      </div>

      <h4 className="text-base font-bold text-slate-900 mb-1">{item.title}</h4>
      <p className="text-sm text-slate-700 whitespace-pre-wrap mb-3">{item.body}</p>

      {item.media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {item.media.map((m) => {
            if (m.media_type === 'image') {
              const src = supabase.storage.from('hero-media').getPublicUrl(m.storage_path).data.publicUrl;
              return (
                <img
                  key={m.id}
                  src={src}
                  alt={m.caption}
                  className="aspect-square object-cover w-full rounded-lg"
                />
              );
            }
            const embed = getEmbedUrl(m.external_url);
            if (!embed) return null;
            return (
              <div key={m.id} className="col-span-2 sm:col-span-3 aspect-video rounded-lg overflow-hidden bg-slate-900">
                <iframe src={embed} className="w-full h-full" allowFullScreen />
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

function DonorBadge({ isFirstTime, count }: { isFirstTime: boolean; count: number }) {
  if (isFirstTime) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 whitespace-nowrap">
        <Sparkles className="w-3 h-3" />
        First-time donor
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 whitespace-nowrap">
      <Heart className="w-3 h-3" />
      {count} gifts
    </span>
  );
}
