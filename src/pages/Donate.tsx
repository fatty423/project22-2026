import { useState } from 'react';
import { Heart, ArrowRight, Shield, CheckCircle, Repeat, Zap } from 'lucide-react';
import { PatchBadge } from '../components/patches/PatchBadge';
import { useAuth } from '../lib/auth';
import { createDonationCheckout } from '../lib/stripe';
import { Button } from '../components/ui/Button';
import { TaxDisclosure } from '../components/TaxDisclosure';
import { TransparencySection } from '../components/TransparencySection';
import { DonorRecognitionSection } from '../components/DonorRecognitionSection';
import { useAppNavigate } from '../hooks/useAppNavigate';

const PRESET_AMOUNTS = [50, 100, 300, 600, 1200, 3000];
const SUGGESTED_MONTHLY = [25, 50, 100, 250, 500, 1000];
const MIN_AMOUNT = 25;

const impactMessages: Record<number, string> = {
  25: 'Recruit — entry-level commitment. The beginning of standing watch.',
  50: 'Pvt 1st Class — the first mark of sustained commitment. Earns physical patch.',
  100: 'Corporal — named recognition in P22 field report.',
  250: 'Sergeant — senior rank. P22 Leadership Summit invitation.',
  300: 'Covers one full year at the Recruit level ($25/mo)',
  500: 'Staff Sergeant — leading others into mission. Named on P22 Partner Wall.',
  600: 'Covers one full year at the Pvt 1st Class level ($50/mo)',
  1000: 'Master Sergeant — the highest individual rank. Board of Advisors.',
  1200: 'Covers one full year at the Corporal level ($100/mo)',
  3000: 'Covers one full year at the Sergeant level ($250/mo)',
};

function getImpactMessage(amount: number, isRecurring: boolean): string {
  if (amount <= 0) return '';

  const exact = impactMessages[amount];
  if (exact) {
    return isRecurring ? `${exact} every month` : exact;
  }

  if (amount < 50) return isRecurring ? 'Building toward Recruit rank ($25/mo)' : 'Helps cover training supplies';
  if (amount < 100) return isRecurring ? 'Building toward Corporal rank ($100/mo)' : 'Covers training materials and resources';
  if (amount < 250) return isRecurring ? 'Building toward Sergeant rank ($250/mo)' : 'Supports career counseling and job placement';
  if (amount < 500) return isRecurring ? 'Building toward Staff Sergeant rank ($500/mo)' : 'Funds certification fees for heroes';
  if (amount < 1000) return isRecurring ? 'Building toward Master Sergeant rank ($1,000/mo)' : 'Sponsors partial training costs';
  return isRecurring ? 'Master Sergeant level — the highest individual honor' : 'Fully sponsors one hero\'s complete program';
}

function getRankForAmount(amount: number, isRecurring: boolean): string {
  if (!isRecurring) {
    if (amount >= 3000) return 'sergeant';
    if (amount >= 1200) return 'corporal';
    if (amount >= 600) return 'pvt-1st-class';
    return 'recruit';
  }
  if (amount >= 1000) return 'master-sergeant';
  if (amount >= 500) return 'staff-sergeant';
  if (amount >= 250) return 'sergeant';
  if (amount >= 100) return 'corporal';
  if (amount >= 50) return 'pvt-1st-class';
  return 'recruit';
}

export function Donate() {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const [isRecurring, setIsRecurring] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const isValidAmount = activeAmount >= MIN_AMOUNT;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setCustomAmount(val);
      setSelectedAmount(0);
      setError('');
    }
  };

  const handleDonate = async () => {
    if (!user) {
      const returnPath = encodeURIComponent('/donate');
      navigate('login');
      window.history.replaceState(null, '', `/login?redirect=${returnPath}`);
      return;
    }

    if (!isValidAmount) {
      setError(`Minimum donation is $${MIN_AMOUNT}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { url } = await createDonationCheckout(
        activeAmount,
        isRecurring,
        `${window.location.origin}/success?type=${isRecurring ? 'recurring' : 'one-time'}&amount=${activeAmount}`,
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

  const amounts = isRecurring ? SUGGESTED_MONTHLY : PRESET_AMOUNTS;

  return (
    <div className="min-h-screen">
      <section className="relative brand-gradient-marine text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes text-white pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-brand px-5 py-2 mb-8">
            <Heart className="w-4 h-4 text-brand-scarlet" />
            <span className="text-sm font-medium text-slate-200">100% Tax Deductible</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display mb-6 leading-tight">
            Support a Hero's Future
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your donation directly funds career training, certifications, and job placement for veterans and first responders transitioning to new careers.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-brand border-2 border-slate-200 overflow-hidden">
            <div className="grid grid-cols-2">
              <button
                onClick={() => setIsRecurring(false)}
                className={`relative py-5 text-center font-semibold text-lg transition-all duration-300 ${
                  !isRecurring
                    ? 'bg-white text-slate-900'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  One-Time
                </div>
                {!isRecurring && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-scarlet" />
                )}
              </button>
              <button
                onClick={() => setIsRecurring(true)}
                className={`relative py-5 text-center font-semibold text-lg transition-all duration-300 ${
                  isRecurring
                    ? 'bg-white text-slate-900'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Repeat className="w-5 h-5" />
                  Monthly
                </div>
                {isRecurring && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-scarlet" />
                )}
              </button>
            </div>

            <div className="p-8 lg:p-10">
              {isRecurring && (
                <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-brand p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-800">
                    <span className="font-semibold">Monthly donors</span> provide reliable, ongoing support that helps us plan long-term programs. Cancel or adjust at any time from your donor portal.
                  </div>
                </div>
              )}

              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Select an amount
                </label>
                <div className="grid gap-3 grid-cols-3 sm:grid-cols-6">
                  {amounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`relative rounded-brand border-2 py-4 px-3 font-bold text-lg transition-all duration-200 ${
                        selectedAmount === amount && !customAmount
                          ? 'border-brand-scarlet bg-red-50 text-brand-scarlet ring-2 ring-red-100'
                          : 'border-slate-200 text-slate-700 hover:border-brand-scarlet hover:bg-slate-50'
                      }`}
                    >
                      ${amount}
                      {isRecurring && (
                        <span className="block text-xs font-normal text-slate-500 mt-0.5">/mo</span>
                      )}
                      {amount === 25 && isRecurring && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-scarlet text-white text-[10px] font-bold px-2 py-0.5 rounded-brand whitespace-nowrap">
                          MOST POPULAR
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Or enter a custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder={`${MIN_AMOUNT}.00 minimum`}
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    onFocus={() => setSelectedAmount(0)}
                    className="w-full pl-10 pr-20 py-4 text-xl font-semibold border-2 border-slate-200 rounded-brand focus:border-brand-scarlet focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  />
                  {isRecurring && customAmount && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">
                      per month
                    </span>
                  )}
                </div>
              </div>

              {isValidAmount && (
                <div className="mb-8 bg-slate-50 rounded-brand p-5 border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-600">
                      {isRecurring ? 'Monthly Donation' : 'One-Time Donation'}
                    </span>
                    <span className="text-2xl font-bold text-slate-900">
                      ${activeAmount.toLocaleString('en-US', { minimumFractionDigits: activeAmount % 1 !== 0 ? 2 : 0 })}
                      {isRecurring && <span className="text-sm font-normal text-slate-500">/mo</span>}
                    </span>
                  </div>
                  {isRecurring && (
                    <div className="text-sm text-slate-500 mb-3">
                      Annual impact: <span className="font-semibold text-slate-700">${(activeAmount * 12).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <PatchBadge series="watchman" rank={getRankForAmount(activeAmount, isRecurring)} size={36} />
                    <p className="text-sm text-slate-600">
                      {getImpactMessage(activeAmount, isRecurring)}
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-brand p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                size="lg"
                onClick={handleDonate}
                loading={loading}
                disabled={!isValidAmount || loading}
                className="w-full text-lg py-4 h-auto"
              >
                {!user ? (
                  <>Sign in to Donate</>
                ) : loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    Donate ${isValidAmount ? activeAmount.toLocaleString('en-US', { minimumFractionDigits: activeAmount % 1 !== 0 ? 2 : 0 }) : '0'}
                    {isRecurring ? '/month' : ''}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                <Shield className="w-4 h-4" />
                <span>Secure payment powered by Stripe. Your data is encrypted.</span>
              </div>

              <TaxDisclosure className="mt-4 justify-center max-w-md mx-auto" />
            </div>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-marine/10 rounded-brand flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-brand-marine" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Tax Deductible</h3>
              <p className="text-sm text-slate-600">
                Project 22 is a registered 501(c)(3). You'll receive a receipt for each contribution and an annual giving statement at year-end.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-brand flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Cancel Anytime</h3>
              <p className="text-sm text-slate-600">
                Monthly donations can be canceled or adjusted at any time from your donor portal.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-scarlet/10 rounded-brand flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-brand-scarlet" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Direct Impact</h3>
              <p className="text-sm text-slate-600">
                Our goal is to allocate 90% of every donation directly to career training and placement programs for veterans and first responders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DonorRecognitionSection />

      <TransparencySection />
    </div>
  );
}
