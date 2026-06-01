import { useState } from 'react';
import { Heart, DollarSign, Users, Calendar, Gift, CheckCircle, CreditCard, ArrowRight, Shield, Target, Star, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TaxDisclosure } from '../components/TaxDisclosure';
import { PatchBadge } from '../components/patches/PatchBadge';
import { useAuth } from '../lib/auth';
import { createDonationCheckout } from '../lib/stripe';
import { useAppNavigate } from '../hooks/useAppNavigate';

const MIN_AMOUNT = 25;

export function WaysToHelp() {
  const navigate = useAppNavigate();
  const { user } = useAuth();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const donationOptions = [
    {
      icon: Heart,
      amount: 50,
      title: 'Support a Hero',
      description: 'Cover training materials and resources for one hero',
    },
    {
      icon: Gift,
      amount: 100,
      title: 'Equip a Hero',
      description: 'Provide essential equipment and certification prep',
    },
    {
      icon: Target,
      amount: 300,
      title: 'Train a Hero',
      description: 'Fund one full year at Recruit level ($25/mo equivalent)',
    },
    {
      icon: Shield,
      amount: 600,
      title: 'Advance a Hero',
      description: 'One year at Pvt 1st Class level ($50/mo equivalent)',
    },
    {
      icon: Star,
      amount: 1200,
      title: 'Sponsor a Hero',
      description: 'One year at Corporal level ($100/mo equivalent)',
    },
    {
      icon: Award,
      amount: 3000,
      title: 'Champion a Hero',
      description: 'One year at Sergeant level ($250/mo equivalent)',
    },
  ];

  const monthlyTiers = [
    {
      amount: 25,
      label: '$25/month',
      name: 'Recruit',
      impact: 'Entry-level commitment. The beginning of standing watch. Digital badge and newsletter recognition.',
      series: 'watchman' as const,
      rank: 'recruit',
      rankLabel: 'Recruit',
      annual: '$300/yr',
    },
    {
      amount: 50,
      label: '$50/month',
      name: 'Pvt 1st Class',
      impact: 'The first mark of sustained commitment. Earns a physical P22 patch mailed annually.',
      series: 'watchman' as const,
      rank: 'pvt-1st-class',
      rankLabel: 'Pvt 1st Class',
      annual: '$600/yr',
    },
    {
      amount: 100,
      label: '$100/month',
      name: 'Corporal',
      impact: 'Named recognition in P22 field report. Invitation to annual Partner Briefing call.',
      series: 'watchman' as const,
      rank: 'corporal',
      rankLabel: 'Corporal',
      annual: '$1,200/yr',
    },
  ];

  const otherWays = [
    {
      title: 'Corporate Partnership',
      description: 'Partner with Project 22 to provide employment opportunities and sponsorships',
      action: 'Learn More',
      page: 'partnership',
    },
    {
      title: 'Volunteer',
      description: 'Share your expertise as a mentor or support our programs directly',
      action: 'Get Involved',
      page: 'partnership',
    },
    {
      title: 'Spread the Word',
      description: 'Share our mission on social media and help us reach more supporters',
      action: 'Share Mission',
      page: 'about',
    },
  ];

  const presetAmounts = [2.22, 22, 222, 2222];

  const handleDonateClick = (type: 'one-time' | 'monthly', amount?: number) => {
    setDonationType(type);
    setError('');
    if (amount) {
      setSelectedAmount(amount);
      setCustomAmount('');
    }
    setShowDonationModal(true);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setCustomAmount(val);
      setSelectedAmount(null);
      setError('');
    }
  };

  const getDonationAmount = () => {
    if (customAmount) return parseFloat(customAmount);
    if (selectedAmount) return selectedAmount;
    return 0;
  };

  const handleCompleteDonation = async () => {
    const amount = getDonationAmount();

    if (!user) {
      setShowDonationModal(false);
      navigate('login');
      return;
    }

    if (amount < MIN_AMOUNT) {
      setError(`Minimum donation is $${MIN_AMOUNT}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { url } = await createDonationCheckout(
        amount,
        donationType === 'monthly',
        `${window.location.origin}/success?type=${donationType}&amount=${amount}`,
        window.location.href
      );

      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Ways to Help
            </h1>
            <p className="text-xl md:text-2xl text-slate-200">
              Your support transforms lives through career training and opportunity for veterans and first responders
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Make a One-Time Donation
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every donation makes an immediate impact on a hero's life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {donationOptions.map((option, index) => (
              <Card key={index} hover>
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-marine/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <option.icon className="w-8 h-8 text-brand-marine" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    ${option.amount}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {option.title}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {option.description}
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => handleDonateClick('one-time', option.amount)}
                  >
                    Donate Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <button
              onClick={() => handleDonateClick('one-time')}
              className="w-full group relative overflow-hidden rounded-2xl border-2 border-dashed border-brand-marine/30 bg-brand-marine/5 hover:bg-brand-marine/10 hover:border-brand-marine/50 transition-all duration-300 p-8"
            >
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-marine/10 group-hover:bg-brand-marine/20 transition-colors flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-brand-marine" />
                </div>
                <div className="text-left">
                  <span className="block text-xl font-bold text-slate-900">Donate a Custom Amount</span>
                  <span className="block text-sm text-slate-500">Choose any amount that works for you</span>
                </div>
                <ArrowRight className="w-6 h-6 text-brand-marine/60 group-hover:text-brand-marine group-hover:translate-x-1 transition-all ml-auto" />
              </div>
            </button>
            <TaxDisclosure className="mt-6 justify-center max-w-lg mx-auto" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Become a Monthly Supporter
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Recurring donations provide sustainable support -- and earn you a digital Partner Patch
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {monthlyTiers.map((tier) => (
              <Card key={tier.amount} hover>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <PatchBadge series={tier.series} rank={tier.rank} size={56} />
                  </div>
                  <p className="text-xs font-display tracking-[0.15em] text-brand-gold uppercase mb-1">
                    Earns: {tier.rankLabel} Rank
                  </p>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    ${tier.amount}
                    <span className="text-base font-normal text-slate-500">/mo</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{tier.annual}</p>
                  <h3 className="text-lg font-bold text-brand-marine mb-3">
                    {tier.name}
                  </h3>
                  <p className="text-slate-600 mb-6 text-sm">
                    {tier.impact}
                  </p>
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => handleDonateClick('monthly', tier.amount)}
                  >
                    Give Monthly
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-brand-marine/5 border-2 border-brand-marine/10">
              <div className="flex items-start gap-4">
                <Award className="w-8 h-8 text-brand-gold flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    How the Patch Program Works
                  </h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <span>Your monthly amount determines your starting patch rank</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <span>Continue giving to advance through 6 ranks in 3 unique patch series</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <span>View your patch and track progress in the donor portal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                      <span>Cancel or adjust your donation at any time</span>
                    </li>
                  </ul>
                  <Link
                    to="/partner-patches"
                    className="inline-flex items-center gap-1 mt-4 text-brand-scarlet font-semibold text-sm hover:underline"
                  >
                    See Full Patch Program Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Sponsor a Hero
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose a specific hero to sponsor and follow their journey to success
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-brand-marine/5 to-slate-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-brand-marine/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-brand-marine" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  100+ Heroes Waiting for Assistance
                </h3>
                <p className="text-lg text-slate-600 mb-8">
                  Browse our heroes directory to meet the individuals waiting for your support. See their stories, watch their videos, and choose who to sponsor.
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate('heroes')}
                  className="text-lg"
                >
                  View Heroes Directory
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Other Ways to Help
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Support our mission beyond financial contributions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {otherWays.map((way, index) => (
              <Card key={index} hover>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {way.title}
                </h3>
                <p className="text-slate-600 mb-6">
                  {way.description}
                </p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate(way.page)}
                >
                  {way.action}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Modal
        isOpen={showDonationModal}
        onClose={() => { setShowDonationModal(false); setError(''); }}
        title={`Make a ${donationType === 'one-time' ? 'One-Time' : 'Monthly'} Donation`}
        maxWidth="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select Amount
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all duration-200 ${
                    selectedAmount === amount
                      ? 'border-brand-marine bg-brand-marine/5 text-brand-marine'
                      : 'border-slate-300 hover:border-brand-marine/30'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder={`Custom amount ($${MIN_AMOUNT} minimum)`}
                value={customAmount}
                onChange={handleCustomAmountChange}
                onFocus={() => setSelectedAmount(null)}
                className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-brand-marine focus:ring-2 focus:ring-brand-marine/10 outline-none transition-all text-lg"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-slate-900">
                {donationType === 'one-time' ? 'One-Time Donation' : 'Monthly Donation'}
              </span>
              <span className="text-3xl font-bold text-brand-marine">
                ${getDonationAmount() || 0}
              </span>
            </div>
            {donationType === 'monthly' && getDonationAmount() > 0 && (
              <>
                <p className="text-sm text-slate-600 mb-3">
                  Annual impact: <span className="font-bold">${(getDonationAmount() * 12).toLocaleString()}</span>
                </p>
                {(() => {
                  const amt = getDonationAmount();
                  const matched = monthlyTiers.find((t) => t.amount === amt);
                  if (!matched) return null;
                  return (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-200">
                      <PatchBadge series={matched.series} rank={matched.rank} size={40} />
                      <div>
                        <p className="text-xs font-bold text-brand-gold uppercase tracking-wide">
                          Earns: {matched.rankLabel} Rank
                        </p>
                        <p className="text-xs text-slate-500">{matched.name}</p>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <Button
              className="w-full mb-3"
              size="lg"
              disabled={getDonationAmount() < MIN_AMOUNT || loading}
              loading={loading}
              onClick={handleCompleteDonation}
            >
              {!user ? (
                <>Sign in to Donate</>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  {loading ? 'Processing...' : `Donate $${getDonationAmount()}`}
                  {donationType === 'monthly' && !loading ? '/month' : ''}
                </>
              )}
            </Button>
            <p className="text-xs text-center text-slate-500 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Secure payment processing powered by Stripe
            </p>
            <TaxDisclosure className="mt-3 justify-center" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
