import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Shield, Plus, TrendingUp, Users, DollarSign, FileText, LogOut, Clock, CheckCircle2, AlertCircle, CreditCard as Edit3 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useHeroAuth } from '../../hooks/useHeroAuth';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import {
  fetchUpdatesForVeteran,
  HeroUpdateWithMedia,
  statusColor,
  statusLabel,
} from '../../lib/heroUpdates';

export function HeroPortal() {
  const { user, veteran, loading } = useHeroAuth();
  const { signOut } = useAuth();
  const [updates, setUpdates] = useState<HeroUpdateWithMedia[]>([]);
  const [donationCount, setDonationCount] = useState(0);
  const [sponsorCount, setSponsorCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!veteran) return;
    (async () => {
      const [updatesList, donationsRes, sponsorshipsRes] = await Promise.all([
        fetchUpdatesForVeteran(veteran.id),
        supabase
          .from('donations')
          .select('donor_id', { count: 'exact' })
          .eq('veteran_id', veteran.id)
          .eq('status', 'succeeded'),
        supabase
          .from('sponsorships')
          .select('id', { count: 'exact', head: true })
          .eq('veteran_id', veteran.id)
          .eq('status', 'active'),
      ]);
      setUpdates(updatesList);
      setDonationCount(donationsRes.count || 0);
      setSponsorCount(sponsorshipsRes.count || 0);
      setLoadingData(false);
    })();
  }, [veteran]);

  const stats = useMemo(() => {
    const pending = updates.filter((u) => u.status === 'pending_review').length;
    const published = updates.filter((u) => u.status === 'published').length;
    const rejected = updates.filter((u) => u.status === 'rejected').length;
    return { pending, published, rejected };
  }, [updates]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/hero/login" replace />;

  if (!veteran) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No hero profile linked</h2>
          <p className="text-slate-600 mb-6">
            Your account isn't linked to a hero profile yet. Please contact the Project 22 team.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2 inline" />
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const progressPercent = Math.min(
    100,
    Math.round((veteran.sponsorship_amount_raised / Math.max(1, veteran.sponsorship_amount_needed)) * 100)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-5">
              <img
                src={veteran.photo_url}
                alt={veteran.first_name}
                className="w-20 h-20 rounded-xl object-cover border-2 border-white/20"
              />
              <div>
                <p className="text-blue-200 text-sm uppercase tracking-wide mb-1">Hero Portal</p>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Welcome, {veteran.first_name}
                </h1>
                <p className="text-slate-300 mt-1">
                  {veteran.military_branch} · {veteran.current_location}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={signOut}
              className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              icon={DollarSign}
              label="Raised"
              value={`$${Math.round(veteran.sponsorship_amount_raised).toLocaleString()}`}
              sub={`${progressPercent}% of goal`}
              color="bg-emerald-500"
            />
            <StatCard
              icon={Users}
              label="Donors"
              value={String(donationCount)}
              sub={`${sponsorCount} active sponsor${sponsorCount === 1 ? '' : 's'}`}
              color="bg-blue-500"
            />
            <StatCard
              icon={FileText}
              label="Published Updates"
              value={String(stats.published)}
              sub={stats.pending ? `${stats.pending} awaiting review` : 'All caught up'}
              color="bg-sky-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Story Status"
              value={stats.rejected ? 'Action needed' : 'On track'}
              sub={stats.rejected ? `${stats.rejected} need edits` : 'Keep sharing!'}
              color={stats.rejected ? 'bg-amber-500' : 'bg-emerald-500'}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your Journey Updates</h2>
              <p className="text-slate-600 mt-1">
                Share your progress with supporters. Updates are reviewed before publishing.
              </p>
            </div>
            <Link to="/hero/updates/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Update
              </Button>
            </Link>
          </div>

          {loadingData ? (
            <Card className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </Card>
          ) : updates.length === 0 ? (
            <Card className="py-12 text-center">
              <FileText className="w-14 h-14 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No updates yet</h3>
              <p className="text-slate-600 mb-6">
                Share your first story. Your supporters are cheering you on.
              </p>
              <Link to="/hero/updates/new">
                <Button>Write Your First Update</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {updates.map((u) => (
                <UpdateRow key={u.id} update={u} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 truncate">{value}</p>
          <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
        </div>
      </div>
    </Card>
  );
}

function UpdateRow({ update }: { update: HeroUpdateWithMedia }) {
  const canEdit = update.status === 'draft' || update.status === 'rejected' || update.status === 'pending_review';
  return (
    <Card className="!p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(update.status)}`}>
              {statusLabel(update.status)}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(update.created_at).toLocaleDateString()}
            </span>
            {update.media.length > 0 && (
              <span className="text-xs text-slate-500">{update.media.length} media</span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {update.title || 'Untitled update'}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2">{update.body}</p>

          {update.status === 'rejected' && update.moderation_notes && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-700">Reviewer feedback</p>
                <p className="text-sm text-red-700">{update.moderation_notes}</p>
              </div>
            </div>
          )}

          {update.status === 'pending_review' && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-700">
              <Clock className="w-3.5 h-3.5" />
              Our team is reviewing this update.
            </div>
          )}
          {update.status === 'published' && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Live for your supporters.
            </div>
          )}
        </div>

        {canEdit && (
          <Link to={`/hero/updates/${update.id}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
