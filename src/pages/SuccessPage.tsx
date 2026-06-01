import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Heart, ArrowRight, Repeat, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TaxDisclosure } from '../components/TaxDisclosure';
import { PatchBadge } from '../components/patches/PatchBadge';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { getDonorRank } from '../lib/donorRank';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const type = searchParams.get('type');
  const amount = searchParams.get('amount');
  const veteranName = searchParams.get('veteran_name');
  const isRecurring = type === 'recurring' || type === 'monthly';
  const isSponsorship = type === 'sponsorship';

  const [donorRank, setDonorRank] = useState<ReturnType<typeof getDonorRank>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchRank() {
      const { data: donations } = await supabase
        .from('donations')
        .select('amount, is_recurring, status')
        .eq('donor_id', user!.id);

      if (donations) {
        const succeeded = donations.filter(d => d.status === 'succeeded');
        const monthlyTotal = succeeded.filter(d => d.is_recurring).reduce((s, d) => s + d.amount, 0);
        const totalDonated = succeeded.reduce((s, d) => s + d.amount, 0);
        setDonorRank(getDonorRank(monthlyTotal, totalDonated));
      }
      setLoading(false);
    }

    fetchRank();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {isSponsorship ? 'Thank You for Sponsoring!' : 'Thank You for Your Generosity!'}
          </h1>

          {amount && (
            <div className="inline-flex items-center gap-2 bg-brand-marine/5 border border-brand-marine/20 rounded-full px-5 py-2 mb-4">
              {isSponsorship ? (
                <Users className="w-4 h-4 text-brand-marine" />
              ) : isRecurring ? (
                <Repeat className="w-4 h-4 text-brand-marine" />
              ) : (
                <Heart className="w-4 h-4 text-brand-marine" />
              )}
              <span className="font-semibold text-brand-marine">
                ${parseFloat(amount).toLocaleString()}
                {isRecurring ? '/month' : ''}{' '}
                {isSponsorship ? 'sponsorship' : 'donation'}
              </span>
            </div>
          )}

          {isSponsorship && veteranName && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 inline-block">
              <p className="text-sm font-medium text-emerald-800">
                Your sponsorship for <span className="font-bold">{veteranName}</span> has been processed
              </p>
            </div>
          )}

          <p className="text-lg text-slate-600 max-w-md mx-auto">
            {isSponsorship
              ? 'Your sponsorship goes directly toward career training, certifications, and job placement for the hero you chose to support.'
              : isRecurring
              ? 'You are now a monthly supporter of Project 22! Your recurring donation will provide consistent support for heroes in training.'
              : 'Your one-time donation has been processed successfully. Every dollar goes directly toward career training and placement for veterans and first responders.'}
          </p>
        </div>

        {!loading && donorRank && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Your Partner Patch Rank</h3>
            <div className="flex flex-col items-center gap-3">
              <PatchBadge series={donorRank.series} rank={donorRank.rank} size={100} />
              <div>
                <p className="text-sm font-bold text-slate-900">{donorRank.label}</p>
                <p className="text-xs text-slate-500">Watchman Series</p>
              </div>
            </div>
            <Link to="/partner-patches" className="inline-block mt-4 text-xs text-brand-marine hover:underline">
              Learn about the Partner Patch Program
            </Link>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-3">What happens next?</h3>
          <ul className="text-left text-sm text-slate-600 space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>You will receive a confirmation email with your receipt</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Your {isSponsorship ? 'sponsorship' : 'donation'} is tax-deductible (Project 22 is a 501(c)(3)). You will receive an annual giving statement at year-end for your records.</span>
            </li>
            {isSponsorship && (
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>You can track your sponsored hero's progress from the Donor Portal</span>
              </li>
            )}
            {isRecurring && (
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>You can manage or cancel your subscription anytime from the Donor Portal</span>
              </li>
            )}
            <li className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Track your impact and sponsored heroes in your Donor Portal</span>
            </li>
          </ul>
        </div>

        <TaxDisclosure className="mb-8 max-w-md mx-auto" />

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/portal">
            <Button size="lg" className="w-full sm:w-auto flex items-center gap-2">
              View Donor Portal
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          {isSponsorship ? (
            <Link to="/heroes">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Back to Heroes
              </Button>
            </Link>
          ) : (
            <Link to="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Return Home
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
