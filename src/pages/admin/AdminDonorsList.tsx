import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Loader2,
  AlertCircle,
  X,
  RefreshCw,
  Users,
  Search,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Repeat,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { PatchBadge } from '../../components/patches/PatchBadge';
import { getDonorRank } from '../../lib/donorRank';

interface DonorRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  is_monthly_donor: boolean;
  total_contributed: number;
  created_at: string;
}

interface DonationRecord {
  id: string;
  donor_id: string;
  amount: number;
  is_recurring: boolean;
  status: string;
  created_at: string;
}

interface DonorWithStats extends DonorRecord {
  donationCount: number;
  totalDonated: number;
  lastDonationAt: string | null;
  monthlyTotal: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (iso: string | null) => {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export function AdminDonorsList() {
  const [donors, setDonors] = useState<DonorRecord[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'monthly' | 'one_time' | 'active'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [donorRes, donationRes] = await Promise.all([
      supabase.from('donors').select('*').order('created_at', { ascending: false }),
      supabase.from('donations').select('*').eq('status', 'succeeded'),
    ]);

    if (donorRes.error) {
      setError(donorRes.error.message);
    } else if (donationRes.error) {
      setError(donationRes.error.message);
    } else {
      setDonors((donorRes.data || []) as DonorRecord[]);
      setDonations((donationRes.data || []) as DonationRecord[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const enriched: DonorWithStats[] = useMemo(() => {
    const byDonor = new Map<string, { count: number; total: number; last: string | null; monthlyTotal: number }>();
    for (const d of donations) {
      const entry = byDonor.get(d.donor_id) || { count: 0, total: 0, last: null, monthlyTotal: 0 };
      entry.count += 1;
      entry.total += Number(d.amount || 0);
      if (d.is_recurring) entry.monthlyTotal += Number(d.amount || 0);
      if (!entry.last || d.created_at > entry.last) entry.last = d.created_at;
      byDonor.set(d.donor_id, entry);
    }
    return donors.map((d) => {
      const stats = byDonor.get(d.id) || { count: 0, total: 0, last: null, monthlyTotal: 0 };
      return {
        ...d,
        donationCount: stats.count,
        totalDonated: stats.total,
        lastDonationAt: stats.last,
        monthlyTotal: stats.monthlyTotal,
      };
    });
  }, [donors, donations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched.filter((d) => {
      if (filter === 'monthly' && !d.is_monthly_donor) return false;
      if (filter === 'one_time' && d.is_monthly_donor) return false;
      if (filter === 'active' && d.donationCount === 0) return false;
      if (!q) return true;
      return (
        d.full_name?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q)
      );
    });
  }, [enriched, search, filter]);

  const stats = useMemo(() => {
    const totalRaised = enriched.reduce((s, d) => s + d.totalDonated, 0);
    const monthly = enriched.filter((d) => d.is_monthly_donor).length;
    const active = enriched.filter((d) => d.donationCount > 0).length;
    return { totalRaised, monthly, active, total: enriched.length };
  }, [enriched]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Something went wrong</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 rounded hover:bg-red-100 transition-colors"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Active Donors</h2>
          <p className="text-slate-500 mt-1 text-sm">
            {stats.total} registered donor{stats.total !== 1 ? 's' : ''} -{' '}
            {stats.active} giving
          </p>
        </div>
        <button
          onClick={load}
          className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Donors" value={stats.total.toString()} icon={Users} accent="slate" />
        <StatCard
          label="Active Givers"
          value={stats.active.toString()}
          icon={DollarSign}
          accent="emerald"
        />
        <StatCard
          label="Monthly Donors"
          value={stats.monthly.toString()}
          icon={Repeat}
          accent="blue"
        />
        <StatCard
          label="Total Raised"
          value={formatCurrency(stats.totalRaised)}
          icon={DollarSign}
          accent="amber"
        />
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Donors</option>
            <option value="active">Active Givers</option>
            <option value="monthly">Monthly</option>
            <option value="one_time">One-Time</option>
          </select>
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">
              {enriched.length === 0
                ? 'No donors have registered yet'
                : 'No donors match your filters'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((donor) => {
              const rank = getDonorRank(donor.monthlyTotal, donor.totalDonated);
              return (
              <div
                key={donor.id}
                className="flex items-center gap-4 py-4 px-2 hover:bg-slate-50/50 transition-colors rounded-lg"
              >
                {rank ? (
                  <PatchBadge series={rank.series} rank={rank.rank} size={44} />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {donor.full_name
                      ? donor.full_name
                          .split(' ')
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : '?'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 truncate">
                      {donor.full_name || 'Unnamed Donor'}
                    </p>
                    {rank && (
                      <span className="text-xs px-2 py-0.5 bg-brand-gold/10 text-brand-gold rounded-full font-medium">
                        {rank.label}
                      </span>
                    )}
                    {donor.is_monthly_donor && (
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium flex items-center gap-1">
                        <Repeat className="w-3 h-3" />
                        Monthly
                      </span>
                    )}
                    {donor.donationCount === 0 && (
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                        No donations
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <a
                        href={`mailto:${donor.email}`}
                        className="hover:text-blue-600 truncate"
                      >
                        {donor.email}
                      </a>
                    </span>
                    {donor.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {donor.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {formatDate(donor.created_at)}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-slate-900">
                    {formatCurrency(donor.totalDonated)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {donor.donationCount} donation{donor.donationCount !== 1 ? 's' : ''}
                  </p>
                  {donor.lastDonationAt && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Last: {formatDate(donor.lastDonationAt)}
                    </p>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: 'slate' | 'emerald' | 'blue' | 'amber';
}

const ACCENTS: Record<StatCardProps['accent'], { bg: string; text: string }> = {
  slate: { bg: 'bg-slate-100', text: 'text-slate-600' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
};

function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  const a = ACCENTS[accent];
  return (
    <Card className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${a.bg} ${a.text} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-slate-900 truncate">{value}</p>
      </div>
    </Card>
  );
}
