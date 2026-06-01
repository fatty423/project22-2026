import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase, Database } from '../lib/supabase';

type Veteran = Database['public']['Tables']['veterans']['Row'];

export function useHeroAuth() {
  const { user, loading: authLoading } = useAuth();
  const [veteran, setVeteran] = useState<Veteran | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setVeteran(null);
      setLoading(false);
      return;
    }

    let active = true;
    supabase
      .from('veterans')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setVeteran(data);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  return { user, veteran, loading: authLoading || loading };
}
