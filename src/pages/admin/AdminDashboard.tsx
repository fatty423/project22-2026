import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle2, XCircle, MessageSquare, ArrowRight, Loader2, GraduationCap, Quote, Shield, Heart, Users, MessageSquareHeart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { getPath } from '../../lib/routes';
import { useAuth } from '../../lib/auth';

interface Stats {
  applicationsTotal: number;
  applicationsPending: number;
  applicationsApproved: number;
  applicationsDeclined: number;
  heroes: number;
  heroUpdatesPending: number;
  donors: number;
  donorsPublic: number;
  messages: number;
  programs: number;
  testimonials: number;
  team: number;
}

interface TileConfig {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  page: string;
  stat?: string | number;
  statLabel?: string;
  accent: string;
  iconBg: string;
  superAdminOnly?: boolean;
}

interface RecentApplication {
  id: string;
  full_name: string;
  military_branch: string;
  status: string;
  created_at: string;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  created_at: string;
}

export function AdminDashboard() {
  const navigate = useAppNavigate();
  const routerNavigate = useNavigate();
  const { user } = useAuth();

  const goToApplications = (status?: string) => {
    const path = getPath('admin-applications');
    routerNavigate(status ? `${path}?status=${status}` : path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [stats, setStats] = useState<Stats>({
    applicationsTotal: 0,
    applicationsPending: 0,
    applicationsApproved: 0,
    applicationsDeclined: 0,
    heroes: 0,
    heroUpdatesPending: 0,
    donors: 0,
    donorsPublic: 0,
    messages: 0,
    programs: 0,
    testimonials: 0,
    team: 0,
  });
  const [recentApps, setRecentApps] = useState<RecentApplication[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.role === 'super_admin') setIsSuperAdmin(true);
      });
  }, [user]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        appsRes,
        messagesRes,
        programsRes,
        testimonialsRes,
        heroesRes,
        heroUpdatesRes,
        donorsRes,
        donorsPublicRes,
        teamRes,
      ] = await Promise.all([
        supabase
          .from('veteran_applications')
          .select('id, full_name, military_branch, status, created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('contact_messages')
          .select('id, name, email, subject, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('programs').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('veterans').select('id', { count: 'exact', head: true }),
        supabase
          .from('hero_updates')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase.from('donors').select('id', { count: 'exact', head: true }),
        supabase
          .from('donor_sponsors')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        supabase.from('admin_users').select('id', { count: 'exact', head: true }),
      ]);

      const apps = appsRes.data || [];
      setRecentApps(apps.slice(0, 5));
      setRecentMessages(messagesRes.data || []);

      setStats({
        applicationsTotal: apps.length,
        applicationsPending: apps.filter((a) => a.status === 'pending').length,
        applicationsApproved: apps.filter((a) => a.status === 'approved').length,
        applicationsDeclined: apps.filter((a) => a.status === 'declined').length,
        heroes: heroesRes.count || 0,
        heroUpdatesPending: heroUpdatesRes.count || 0,
        donors: donorsRes.count || 0,
        donorsPublic: donorsPublicRes.count || 0,
        messages: messagesRes.data?.length || 0,
        programs: programsRes.count || 0,
        testimonials: testimonialsRes.count || 0,
        team: teamRes.count || 0,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      reviewing: 'bg-blue-100 text-blue-800',
      approved: 'bg-emerald-100 text-emerald-800',
      declined: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
          styles[status] || 'bg-slate-100 text-slate-800'
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const headlineStats = [
    {
      label: 'Total Applications',
      value: stats.applicationsTotal,
      icon: FileText,
      color: 'bg-blue-500',
      filter: undefined,
    },
    {
      label: 'Pending Review',
      value: stats.applicationsPending,
      icon: Clock,
      color: 'bg-amber-500',
      filter: 'pending',
    },
    {
      label: 'Approved Heroes',
      value: stats.applicationsApproved,
      icon: CheckCircle2,
      color: 'bg-emerald-500',
      filter: 'approved',
    },
    {
      label: 'Declined',
      value: stats.applicationsDeclined,
      icon: XCircle,
      color: 'bg-red-500',
      filter: 'declined',
    },
  ];

  const peopleTiles: TileConfig[] = [
    {
      id: 'heroes',
      label: 'Heroes',
      description: 'Profiles, portal logins, sponsorship status',
      icon: Shield,
      page: 'admin-heroes',
      stat: stats.heroes,
      statLabel: 'active profiles',
      accent: 'from-blue-600 to-blue-500',
      iconBg: 'bg-blue-500',
    },
    {
      id: 'donors',
      label: 'Donors',
      description: 'Accounts, giving history, public recognition',
      icon: Heart,
      page: 'admin-donors',
      stat: stats.donors,
      statLabel: `${stats.donorsPublic} shown publicly`,
      accent: 'from-rose-600 to-rose-500',
      iconBg: 'bg-rose-500',
    },
    {
      id: 'applications',
      label: 'Applicants',
      description: 'Review, approve, and onboard new heroes',
      icon: FileText,
      page: 'admin-applications',
      stat: stats.applicationsPending,
      statLabel: 'awaiting review',
      accent: 'from-amber-600 to-amber-500',
      iconBg: 'bg-amber-500',
    },
    {
      id: 'team',
      label: 'Team',
      description: 'Manage admin users and roles',
      icon: Users,
      page: 'admin-users',
      stat: stats.team,
      statLabel: 'admin accounts',
      accent: 'from-slate-700 to-slate-600',
      iconBg: 'bg-slate-600',
      superAdminOnly: true,
    },
  ];

  const contentTiles: TileConfig[] = [
    {
      id: 'hero-updates',
      label: 'Hero Updates',
      description: 'Moderate journey posts before they go public',
      icon: MessageSquareHeart,
      page: 'admin-hero-updates',
      stat: stats.heroUpdatesPending,
      statLabel: 'pending moderation',
      accent: 'from-teal-600 to-teal-500',
      iconBg: 'bg-teal-500',
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      description: 'Stories displayed across the public site',
      icon: Quote,
      page: 'admin-testimonials',
      stat: stats.testimonials,
      statLabel: 'published',
      accent: 'from-sky-600 to-sky-500',
      iconBg: 'bg-sky-500',
    },
    {
      id: 'programs',
      label: 'Programs',
      description: 'Training tracks, courses, and resources',
      icon: GraduationCap,
      page: 'admin-programs',
      stat: stats.programs,
      statLabel: 'programs live',
      accent: 'from-emerald-600 to-emerald-500',
      iconBg: 'bg-emerald-500',
    },
  ];

  const communicationTiles: TileConfig[] = [
    {
      id: 'messages',
      label: 'Inbox',
      description: 'Contact form submissions from the website',
      icon: MessageSquare,
      page: 'admin-messages',
      stat: stats.messages,
      statLabel: 'recent messages',
      accent: 'from-blue-700 to-blue-600',
      iconBg: 'bg-blue-600',
    },
  ];

  const renderTile = (tile: TileConfig) => (
    <button
      key={tile.id}
      onClick={() => navigate(tile.page)}
      className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 text-left shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tile.accent}`}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${tile.iconBg} flex items-center justify-center shadow-md`}
        >
          <tile.icon className="w-6 h-6 text-white" />
        </div>
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{tile.label}</h3>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">
        {tile.description}
      </p>
      {tile.stat !== undefined && (
        <div className="flex items-baseline gap-2 pt-3 border-t border-slate-100">
          <span className="text-2xl font-bold text-slate-900">{tile.stat}</span>
          {tile.statLabel && (
            <span className="text-xs text-slate-500">{tile.statLabel}</span>
          )}
        </div>
      )}
    </button>
  );

  const visiblePeopleTiles = peopleTiles.filter(
    (t) => !t.superAdminOnly || isSuperAdmin
  );

  const sectionHeading = (title: string, subtitle: string) => (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Portal</h1>
        <p className="text-slate-500 mt-1">
          One place to manage heroes, donors, applicants, and site content.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {headlineStats.map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => goToApplications(stat.filter)}
            className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 text-left shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            aria-label={`View ${stat.label}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0 shadow-md`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>

      <section>
        {sectionHeading(
          'People Management',
          'Accounts, profiles, and recognition for everyone in the program'
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visiblePeopleTiles.map(renderTile)}
        </div>
      </section>

      <section>
        {sectionHeading(
          'Public Content',
          'Everything that appears on the public-facing website'
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentTiles.map(renderTile)}
        </div>
      </section>

      <section>
        {sectionHeading(
          'Communication',
          'Messages and outreach from supporters and applicants'
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communicationTiles.map(renderTile)}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-900">Recent Applications</h2>
            </div>
            <button
              onClick={() => navigate('admin-applications')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {recentApps.length === 0 ? (
            <p className="text-slate-400 text-sm py-8 text-center">
              No applications yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {app.full_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {app.military_branch} &middot; {formatDate(app.created_at)}
                    </p>
                  </div>
                  {statusBadge(app.status)}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-900">Recent Messages</h2>
            </div>
            <button
              onClick={() => navigate('admin-messages')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-slate-400 text-sm py-8 text-center">
              No messages yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {msg.subject}
                    </p>
                    <p className="text-xs text-slate-500">
                      {msg.name} &middot; {formatDate(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
