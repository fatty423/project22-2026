import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Eye,
  X,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  Image as ImageIcon,
  Phone,
  Mail,
  Calendar,
  Shield,
  Download,
  VideoOff,
  AlertTriangle,
  MapPin,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { Database } from '../../lib/supabase';

type Application = Database['public']['Tables']['veteran_applications']['Row'];
type Status = Application['status'];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
];

const BRANCH_OPTIONS = [
  'All Backgrounds',
  'Army',
  'Navy',
  'Air Force',
  'Marines',
  'Coast Guard',
  'Space Force',
  'Law Enforcement',
  'Fire Department',
  'EMS/EMT',
  'Dispatch',
  'Corrections',
];

export function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [programLabels, setProgramLabels] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    initialStatus && STATUS_OPTIONS.some((o) => o.value === initialStatus)
      ? initialStatus
      : 'all'
  );
  const [branchFilter, setBranchFilter] = useState('All Backgrounds');

  useEffect(() => {
    const current = searchParams.get('status') ?? 'all';
    if (current !== statusFilter) {
      const next = new URLSearchParams(searchParams);
      if (statusFilter === 'all') next.delete('status');
      else next.set('status', statusFilter);
      setSearchParams(next, { replace: true });
    }
  }, [statusFilter, searchParams, setSearchParams]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadApplications = useCallback(async () => {
    try {
      const [appsRes, programsRes] = await Promise.all([
        supabase
          .from('veteran_applications')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('programs')
          .select('slug, name'),
      ]);

      if (appsRes.error) throw appsRes.error;
      setApplications(appsRes.data || []);

      if (programsRes.data) {
        const labels: Record<string, string> = {};
        programsRes.data.forEach((p) => { labels[p.slug] = p.name; });
        setProgramLabels(labels);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const updateStatus = async (id: string, status: Status) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('veteran_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status, updated_at: new Date().toISOString() } : app))
      );

      if (selectedApp?.id === id) {
        setSelectedApp((prev) => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = applications.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (branchFilter !== 'All Backgrounds' && app.military_branch !== branchFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        app.full_name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      reviewing: 'bg-blue-100 text-blue-800',
      approved: 'bg-emerald-100 text-emerald-800',
      declined: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-500 mt-1">{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {BRANCH_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No applications match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Background</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Programs</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((app) => (
                  <tr key={app.id} onClick={() => setSelectedApp(app)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-900 text-sm">{app.full_name}</p>
                      <p className="text-xs text-slate-500">{app.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-slate-600 hidden md:table-cell">{app.military_branch}</td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {app.programs_interested.slice(0, 2).map((p) => (
                          <span key={p} className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                            {programLabels[p] || p}
                          </span>
                        ))}
                        {app.programs_interested.length > 2 && (
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                            +{app.programs_interested.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{statusBadge(app.status)}</td>
                    <td className="py-3.5 px-4 text-sm text-slate-500 hidden sm:table-cell">{formatDate(app.created_at)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 font-medium">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selectedApp && (
        <ApplicationDetail
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdateStatus={updateStatus}
          updating={updating}
          formatDateTime={formatDateTime}
          statusBadge={statusBadge}
          programLabels={programLabels}
        />
      )}
    </div>
  );
}

interface DetailProps {
  app: Application;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Status) => void;
  updating: boolean;
  formatDateTime: (d: string) => string;
  statusBadge: (s: string) => JSX.Element;
  programLabels: Record<string, string>;
}

function ApplicationDetail({ app, onClose, onUpdateStatus, updating, formatDateTime, statusBadge, programLabels }: DetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{app.full_name}</h2>
            <p className="text-sm text-slate-500">Application Details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-3">
            {statusBadge(app.status)}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              <Shield className="w-3 h-3" />
              {app.military_branch}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <a href={`mailto:${app.email}`} className="text-sm text-blue-600 hover:underline">{app.email}</a>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Phone className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <a href={`tel:${app.phone}`} className="text-sm text-blue-600 hover:underline">{app.phone}</a>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <MapPin className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="text-sm text-slate-900">
                  {[app.city, app.state].filter(Boolean).join(', ') || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Desired Timeline</p>
                <p className="text-sm text-slate-900">{app.desired_start_timeline}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Submitted</p>
                <p className="text-sm text-slate-900">{formatDateTime(app.created_at)}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Programs Interested</p>
            <div className="flex flex-wrap gap-2">
              {app.programs_interested.map((p) => (
                <span key={p} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {programLabels[p] || p}
                </span>
              ))}
            </div>
          </div>

          {app.photo_url && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Photo
              </p>
              <img
                src={app.photo_url}
                alt={`${app.full_name}'s photo`}
                className="w-full max-w-sm rounded-xl border border-slate-200 object-cover"
              />
            </div>
          )}

          <VideoSection url={app.video_url} />

          <div className="border-t border-slate-200 pt-5">
            <p className="text-sm font-medium text-slate-700 mb-3">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {app.status !== 'reviewing' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updating}
                  onClick={() => onUpdateStatus(app.id, 'reviewing')}
                  className="flex items-center gap-1.5"
                >
                  <Clock className="w-4 h-4" />
                  Mark as Reviewing
                </Button>
              )}
              {app.status !== 'approved' && (
                <Button
                  size="sm"
                  disabled={updating}
                  onClick={() => onUpdateStatus(app.id, 'approved')}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </Button>
              )}
              {app.status !== 'declined' && (
                <Button
                  size="sm"
                  variant="danger"
                  disabled={updating}
                  onClick={() => onUpdateStatus(app.id, 'declined')}
                  className="flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  Decline
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoSection({ url }: { url: string }) {
  const [error, setError] = useState(false);
  const hasVideo = url && url.length > 0;

  if (!hasVideo) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <VideoOff className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-400">No video submitted</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
        <Play className="w-4 h-4" />
        Sponsorship Video
      </p>
      {!error ? (
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          className="w-full rounded-xl border border-slate-200 bg-black"
          onError={() => setError(true)}
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <p className="text-sm text-slate-600">
            This video format may not be supported in your browser.
          </p>
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Video
      </a>
    </div>
  );
}
