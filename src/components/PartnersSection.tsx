import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppNavigate } from '../hooks/useAppNavigate';
import type { Database } from '../lib/supabase';

type Partner = Database['public']['Tables']['partners']['Row'];

function PartnerLogo({ partner }: { partner: Partner }) {
  if (partner.logo_url) {
    return (
      <img
        src={partner.logo_url}
        alt={partner.name}
        className="max-h-16 md:max-h-20 w-auto object-contain"
      />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-100 rounded-lg flex items-center justify-center">
        <Shield className="w-6 h-6 md:w-7 md:h-7 text-slate-400" />
      </div>
      <span className="text-lg md:text-xl font-bold text-slate-700 tracking-tight">
        {partner.name}
      </span>
    </div>
  );
}

export function PartnersSection() {
  const appNavigate = useAppNavigate();
  const routerNavigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      const { data } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (data) setPartners(data);
      setLoading(false);
    }
    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      </section>
    );
  }

  if (partners.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-brand-gold tracking-widest uppercase mb-2">
            Trusted By Industry Leaders
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Our Partners
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 lg:gap-20">
          {partners.map((partner) => {
            const href = partner.slug === 'a-place-for-the-family'
              ? '/family-wellness'
              : `/partnership#${partner.slug}`;
            return (
              <button
                key={partner.id}
                onClick={() => routerNavigate(href)}
                className="flex items-center justify-center cursor-pointer hover:opacity-75 hover:scale-105 transition-all duration-200"
              >
                <PartnerLogo partner={partner} />
              </button>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => appNavigate('partnership')}
            className="inline-flex items-center gap-2 text-brand-scarlet hover:text-brand-dark-red font-semibold transition-colors duration-200 group"
          >
            View All Partners
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
}
