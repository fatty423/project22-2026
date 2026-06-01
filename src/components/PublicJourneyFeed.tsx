import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { fetchPublishedPublicUpdates, getEmbedUrl, HeroUpdateWithMedia } from '../lib/heroUpdates';
import { supabase } from '../lib/supabase';

interface Props {
  veteranId: string;
  firstName: string;
}

export function PublicJourneyFeed({ veteranId, firstName }: Props) {
  const [items, setItems] = useState<HeroUpdateWithMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await fetchPublishedPublicUpdates(veteranId);
      setItems(all);
      setLoading(false);
    })();
  }, [veteranId]);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-brand-marine" />
        <h2 className="text-2xl font-bold text-slate-900">
          Updates from {firstName}
        </h2>
      </div>

      <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
        {items.map((item) => (
          <article key={item.id} className="relative pl-10">
            <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-brand-marine border-4 border-white ring-2 ring-brand-marine/20" />
            <p className="text-xs text-slate-400 mb-1">
              {item.published_at ? new Date(item.published_at).toLocaleDateString() : ''}
            </p>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
            <p className="text-slate-700 whitespace-pre-wrap mb-4">{item.body}</p>

            {item.media.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.media.map((m) => {
                  if (m.media_type === 'image') {
                    const src = supabase.storage
                      .from('hero-media')
                      .getPublicUrl(m.storage_path).data.publicUrl;
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
                    <div
                      key={m.id}
                      className="col-span-2 sm:col-span-3 aspect-video rounded-lg overflow-hidden bg-slate-900"
                    >
                      <iframe src={embed} className="w-full h-full" allowFullScreen />
                    </div>
                  );
                })}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
