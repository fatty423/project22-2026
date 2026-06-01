import { useState, useEffect } from 'react';
import { Heart, DollarSign, Calendar, TrendingUp, User, MapPin, Settings, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TaxDisclosure } from '../components/TaxDisclosure';
import { PortalProfile } from '../components/portal/PortalProfile';
import { PortalTaxSummary } from '../components/portal/PortalTaxSummary';
import { DonorHeroUpdatesFeed } from '../components/portal/DonorHeroUpdatesFeed';
import { PatchBadge } from '../components/patches/PatchBadge';
import { useAuth } from '../lib/auth';
import { supabase, Database } from '../lib/supabase';
import { getUserSubscription, openStripePortal } from '../lib/stripe';
import { getDonorRank, getRankProgress } from '../lib/donorRank';
import { HeroTimeline } from '../components/HeroTimeline';
import { useAppNavigate } from '../hooks/useAppNavigate';

type Veteran = Database['public']['Tables']['veterans']['Row'];
type Sponsorship = Database['public']['Tables']['sponsorships']['Row'];
type Donation = Database['public']['Tables']['donations']['Row'];
type VeteranProgress = Database['public']['Tables']['veteran_progress']['Row'];
type Donor = Database['public']['Tables']['donors']['Row'];

interface SponsorshipWithVeteran extends Sponsorship {
  veteran: Veteran;
  progress: VeteranProgress[];
}

export function DonorPortal() {
  const navigate = useAppNavigate();
  const { user } = useAuth();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [sponsorships, setSponsorships] = useState<SponsorshipWithVeteran[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDonorData();
    }
  }, [user]);

  const fetchDonorData = async () => {
    if (!user) return;

    try {
      const { data: donorData } = await supabase
        .from('donors')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (donorData) {
        setDonor(donorData);
      }

      const { data: sponsorshipsData } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('donor_id', user.id);

      if (sponsorshipsData) {
        const sponsorshipsWithDetails = await Promise.all(
          sponsorshipsData.map(async (sponsorship) => {
            const { data: veteran } = await supabase
              .from('veterans')
              .select('*')
              .eq('id', sponsorship.veteran_id)
              .single();

            const { data: progress } = await supabase
              .from('veteran_progress')
              .select('*')
              .eq('veteran_id', sponsorship.veteran_id)
              .order('sort_order', { ascending: true });

            return {
              ...sponsorship,
              veteran: veteran!,
              progress: progress || [],
            };
          })
        );

        setSponsorships(sponsorshipsWithDetails);
      }

      const { data: donationsData } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false });

      if (donationsData) {
        setDonations(donationsData);
      }

      const sub = await getUserSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Error fetching donor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const url = await openStripePortal(window.location.href);
      window.location.href = url;
    } catch (error: any) {
      console.error('Error opening portal:', error);
      alert(error.message || 'Could not open billing portal.');
    } finally {
      setPortalLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Sign in to view your portal
          </h2>
          <p className="text-slate-600 mb-6">
            Access your donation history and track your sponsored heroes
          </p>
          <Button className="w-full" onClick={() => navigate('login')}>
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-marine mb-4" />
          <p className="text-slate-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const totalDonated = donations
    .filter((d) => d.status === 'succeeded')
    .reduce((sum, d) => sum + d.amount, 0);

  const monthlyDonations = donations.filter((d) => d.is_recurring);
  const monthlyTotal = monthlyDonations.reduce((sum, d) => sum + d.amount, 0);

  const hasActiveSubscription = subscription &&
    subscription.status === 'active' &&
    subscription.subscription_id;

  const lastDonation = donations.find((d) => d.status === 'succeeded');

  const donorRank = getDonorRank(monthlyTotal, totalDonated);
  const { next: nextRank, percentToNext } = getRankProgress(monthlyTotal, totalDonated);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-brand-marine via-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              {donorRank && (
                <div className="hidden sm:flex flex-col items-center">
                  <PatchBadge series={donorRank.series} rank={donorRank.rank} size={80} />
                  <span className="text-xs text-brand-gold font-semibold mt-1 tracking-wide uppercase">{donorRank.label}</span>
                </div>
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Welcome back, {donor?.full_name || 'Donor'}
                </h1>
                <p className="text-xl text-slate-200">
                  Thank you for supporting our heroes
                </p>
                {donorRank && nextRank && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-gold rounded-full transition-all" style={{ width: `${percentToNext}%` }} />
                    </div>
                    <span className="text-xs text-slate-300">Next: {nextRank.label}</span>
                  </div>
                )}
              </div>
            </div>
            {donorRank && (
              <Link to="/partner-patches" className="hidden md:block text-xs text-brand-gold/80 hover:text-brand-gold underline underline-offset-2">
                About Partner Patches
              </Link>
            )}
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <StatCard icon={DollarSign} label="Total Donated" value={`$${totalDonated.toFixed(0)}`} color="blue" />
            <StatCard icon={Heart} label="Heroes Sponsored" value={String(sponsorships.length)} color="green" />
            <StatCard icon={Calendar} label="Monthly Giving" value={`$${monthlyTotal.toFixed(0)}`} color="sky" />
            <StatCard icon={TrendingUp} label="Total Donations" value={String(donations.length)} color="yellow" />
          </div>
        </div>
      </section>

      {hasActiveSubscription && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Active Subscription</h2>
            <Card className="border-2 border-brand-marine/20 bg-gradient-to-br from-brand-marine/5 to-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-brand-marine/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-7 h-7 text-brand-marine" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Monthly Donation</h3>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>
                        Status:{' '}
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {subscription.status}
                        </span>
                      </p>
                      {subscription.current_period_end && (
                        <p>Next billing: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}</p>
                      )}
                      {subscription.payment_method_brand && subscription.payment_method_last4 && (
                        <p>Payment: {subscription.payment_method_brand} ending in {subscription.payment_method_last4}</p>
                      )}
                      {subscription.cancel_at_period_end && (
                        <p className="text-amber-600 font-medium">Cancels at end of billing period</p>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                  loading={portalLoading}
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <Settings className="w-4 h-4" />
                  Manage Subscription
                </Button>
              </div>
            </Card>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {donor && (
                <PortalProfile donor={donor} onUpdate={setDonor} donorRank={donorRank} />
              )}

              {donations.length > 0 && (
                <PortalTaxSummary donations={donations} donorName={donor?.full_name || 'Donor'} />
              )}

              <DonorHeroUpdatesFeed donorId={user.id} donations={donations} />
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-brand-scarlet to-brand-scarlet/90 border-0 text-white">
                <h3 className="text-lg font-bold mb-2">Quick Donate</h3>
                <p className="text-white/80 text-sm mb-5">
                  {lastDonation
                    ? `Your last donation was $${lastDonation.amount.toFixed(0)}. Continue supporting our heroes.`
                    : 'Make a donation to support career training for veterans and first responders.'}
                </p>
                <Link to="/donate">
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Donate Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>

              <Card>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Your Impact</h3>
                <p className="text-sm text-slate-500 mb-4">How your contributions help</p>
                <div className="space-y-3">
                  <ImpactItem label="Training hours funded" value={Math.round(totalDonated / 25)} />
                  <ImpactItem label="Career placement support" value={Math.round(totalDonated / 500)} suffix="heroes" />
                  <ImpactItem label="Months of mentorship" value={Math.round(totalDonated / 100)} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Sponsored Heroes</h2>
          <p className="text-slate-600 mb-6">Track the progress of heroes you are supporting</p>

          {sponsorships.length === 0 ? (
            <Card className="text-center py-12">
              <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No sponsored heroes yet</h3>
              <p className="text-slate-600 mb-6">Start making a difference by sponsoring a hero today</p>
              <Button onClick={() => navigate('heroes')}>View Heroes Directory</Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {sponsorships.map((sponsorship) => (
                <SponsorshipCard key={sponsorship.id} sponsorship={sponsorship} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Donation History</h2>
          <p className="text-slate-600 mb-6">Review your past contributions to Project 22</p>

          {donations.length === 0 ? (
            <Card className="text-center py-12">
              <DollarSign className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No donations yet</h3>
              <p className="text-slate-600 mb-6">Make your first donation to support our mission</p>
              <Button onClick={() => navigate('donate')}>Make a Donation</Button>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {donations.map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                          ${donation.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {donation.is_recurring ? 'Monthly' : 'One-time'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              donation.status === 'succeeded'
                                ? 'bg-green-100 text-green-800'
                                : donation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <TaxDisclosure className="mt-6 max-w-xl" />
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Continue Making an Impact
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Your support is changing lives. Consider sponsoring another hero or
            increasing your monthly contribution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('heroes')}>
              <Heart className="w-5 h-5 mr-2" />
              Sponsor Another Hero
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('donate')}>
              Make a Donation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-brand-marine/20',
    green: 'bg-green-500 bg-opacity-30',
    sky: 'bg-sky-500 bg-opacity-30',
    yellow: 'bg-yellow-500 bg-opacity-30',
  };

  return (
    <Card className="bg-white bg-opacity-10 backdrop-blur border-0">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${colorMap[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-slate-300 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function ImpactItem({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-900">
        {value}{suffix ? ` ${suffix}` : ''}
      </span>
    </div>
  );
}

function SponsorshipCard({ sponsorship }: { sponsorship: SponsorshipWithVeteran }) {
  return (
    <Card>
      <div className="flex items-start gap-4 mb-6">
        <img
          src={sponsorship.veteran.photo_url}
          alt={`${sponsorship.veteran.first_name} ${sponsorship.veteran.last_initial}.`}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            {sponsorship.veteran.first_name} {sponsorship.veteran.last_initial}.
          </h3>
          <p className="text-sm text-slate-600 mb-2">
            {sponsorship.veteran.military_branch} ·{' '}
            <MapPin className="w-3 h-3 inline" /> {sponsorship.veteran.current_location}
          </p>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              sponsorship.status === 'active'
                ? 'bg-green-100 text-green-700'
                : sponsorship.status === 'completed'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {sponsorship.status === 'active' && (
              (() => {
                const active = sponsorship.progress.find((m) => m.status === 'in_progress');
                if (active) return active.milestone;
                const completed = sponsorship.progress.filter((m) => m.status === 'completed');
                if (completed.length > 0 && completed.length === sponsorship.progress.length) return 'Completed';
                if (completed.length > 0) return completed[completed.length - 1].milestone;
                return 'Application Approved';
              })()
            )}
            {sponsorship.status === 'completed' && 'Completed'}
            {sponsorship.status === 'cancelled' && 'Cancelled'}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Career Goal:</span>
          <span className="font-medium text-slate-900">{sponsorship.veteran.career_goals}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Your Contribution:</span>
          <span className="font-bold text-brand-marine">${sponsorship.amount_committed.toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Started:</span>
          <span className="font-medium text-slate-900">{new Date(sponsorship.started_at).toLocaleDateString()}</span>
        </div>
      </div>

      {sponsorship.progress.length > 0 ? (
        <div className="bg-slate-50 rounded-lg p-4">
          <HeroTimeline milestones={sponsorship.progress} compact />
        </div>
      ) : (
        <div className="bg-brand-marine/5 border border-brand-marine/20 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-700">
            Training updates will appear here as your sponsored hero progresses through the program.
          </p>
        </div>
      )}
    </Card>
  );
}
