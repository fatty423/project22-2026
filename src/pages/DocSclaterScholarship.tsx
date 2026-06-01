import { useState } from 'react';
import { Heart, Star, Shield, GraduationCap, Award, CheckCircle, Users, ArrowRight, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { createDonationCheckout } from '../lib/stripe';

const SCHOLARSHIP_COST = 8650;

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000, SCHOLARSHIP_COST];

const whatRecipientGets = [
  'Full tuition for the 24-day All-in-One Executive Protection Advanced program ($8,650 value)',
  'Training materials, uniforms, and equipment',
  'FL Class D, G, and Executive Protection certifications',
  'Direct job placement assistance upon graduation',
  'Project 22 holistic wellness support (spiritual, mental, family)',
  'Alumni network access and ongoing career support',
];

const eligibility = [
  'U.S. military veteran or first responder (active or retired)',
  'Demonstrate financial need or hardship',
  'Committed to completing the full 24-day program',
  'Able to travel to the training location in Florida',
  'Willing to share your story to inspire future scholarship recipients',
];

export function DocSclaterScholarship() {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const isValidAmount = activeAmount >= 25;

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
      const returnPath = encodeURIComponent('/doc-sclater-scholarship');
      navigate('login');
      window.history.replaceState(null, '', `/login?redirect=${returnPath}`);
      return;
    }

    if (!isValidAmount) {
      setError('Minimum donation is $25');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { url } = await createDonationCheckout(
        activeAmount,
        false,
        `${window.location.origin}/success?type=one-time&amount=${activeAmount}&fund=doc-sclater`,
        window.location.href,
        undefined,
        'doc-sclater'
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
      {/* Hero */}
      <section className="relative bg-brand-marine text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-gold/20 backdrop-blur-sm border border-brand-gold/40 rounded-brand px-5 py-2 mb-8">
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
            <span className="text-sm font-semibold text-brand-gold uppercase tracking-wider">Named Scholarship</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-wide mb-6">
            The "Doc" Sclater Scholarship
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-4">
            Full tuition for the All-in-One Executive Protection Advanced program at ESS Academy -- honoring Doc's legacy by continuing what he did best.
          </p>
          <p className="text-base text-slate-400">
            Hosted by Project 22 &bull; Provided by ESS Academy
          </p>
        </div>
      </section>

      {/* About the Scholarship */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-brand-gold rounded-full" />
                <h2 className="text-sm font-semibold text-brand-gold uppercase tracking-wider">About the Scholarship</h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-display text-slate-900 mb-6">
                Carrying Forward Doc's Mission
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Jamie "Doc" Sclater believed that every veteran deserved access to world-class training and a clear path to a meaningful career after service. As a senior instructor at ESS Academy, he spent his days turning that belief into reality -- training veterans in executive protection, tactical medicine, and the full spectrum of professional security.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                The "Doc" Sclater Scholarship honors his legacy by providing full tuition for the All-in-One Executive Protection Advanced program -- ESS Academy's most comprehensive course. This is the caliber of training Doc delivered and the opportunity he fought to give others.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Each scholarship covers $8,650 in tuition for one veteran or first responder to complete the 24-day immersive program and graduate with the certifications, skills, and job placement support to build a career in executive protection.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-brand overflow-hidden shadow-2xl">
                <img
                  src="/JamieHTSO.png"
                  alt="Jamie 'Doc' Sclater instructing at ESS Academy"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-brand shadow-xl p-6 border border-slate-200">
                <div className="text-center">
                  <p className="text-3xl font-display text-brand-scarlet">$8,650</p>
                  <p className="text-sm text-slate-600 mt-1">Full Scholarship Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Recipients Receive */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-display text-slate-900 mb-4">
              What Scholarship Recipients Receive
            </h3>
            <p className="text-lg text-slate-600">
              Everything needed to complete the program and launch a career in executive protection
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {whatRecipientGets.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-brand p-5 border border-slate-200">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>

          {/* Program Details Card */}
          <div className="mt-12 bg-white rounded-brand border-2 border-brand-marine/20 p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-brand-marine rounded-full flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl font-display text-slate-900 mb-2">All-in-One Executive Protection Advanced</h4>
                <p className="text-slate-600 mb-3">ESS Academy's most comprehensive program -- full immersion training covering every aspect of executive protection.</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  <span className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-4 h-4 text-brand-marine" /> 24 Days
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <DollarSign className="w-4 h-4 text-brand-marine" /> $8,650 Tuition
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Award className="w-4 h-4 text-brand-marine" /> D, G, EP Certifications
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-brand-scarlet rounded-full" />
                <h2 className="text-sm font-semibold text-brand-scarlet uppercase tracking-wider">Eligibility</h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-display text-slate-900 mb-6">
                Who Can Apply
              </h3>
              <div className="space-y-4">
                {eligibility.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-brand-marine flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-brand-marine rounded-full" />
                <h2 className="text-sm font-semibold text-brand-marine uppercase tracking-wider">How to Apply</h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-display text-slate-900 mb-6">
                Take the First Step
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Apply through Project 22's scholarship application. Select the All-in-One Executive Protection Advanced program and mention the "Doc" Sclater Scholarship in your application.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Our team will review your background, service history, and goals. Recipients are selected based on need, commitment, and readiness to complete the program.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('apply')}
              >
                <Users className="w-5 h-5 mr-2" />
                Apply for Scholarship
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section id="donate" className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Star className="w-10 h-10 text-brand-gold mx-auto mb-4 fill-brand-gold" />
            <h3 className="text-3xl md:text-4xl font-display mb-4">
              Fund Doc's Legacy
            </h3>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Every dollar donated goes directly to funding scholarships for veterans entering the AIO Executive Protection program. One full scholarship is ${SCHOLARSHIP_COST.toLocaleString()}.
            </p>
          </div>

          <div className="bg-white rounded-brand p-8 text-slate-900">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`relative py-4 px-4 rounded-brand border-2 text-center font-semibold transition-all duration-200 ${
                    selectedAmount === amount && !customAmount
                      ? 'border-brand-scarlet bg-brand-scarlet/5 text-brand-scarlet'
                      : 'border-slate-200 text-slate-700 hover:border-brand-scarlet/50'
                  }`}
                >
                  <span className="text-lg">${amount.toLocaleString()}</span>
                  {amount === SCHOLARSHIP_COST && (
                    <span className="block text-xs mt-1 text-brand-gold font-medium">Full Scholarship</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Or enter a custom amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Custom amount"
                  className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-brand text-lg focus:outline-none focus:border-brand-scarlet transition-colors"
                />
              </div>
            </div>

            {activeAmount > 0 && (
              <div className="mb-6 bg-brand-marine/5 rounded-brand p-4">
                <p className="text-sm text-slate-600">
                  {activeAmount >= SCHOLARSHIP_COST
                    ? 'Your donation funds one complete scholarship for a veteran.'
                    : `Your donation covers ${Math.round((activeAmount / SCHOLARSHIP_COST) * 100)}% of a full scholarship.`}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-brand p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              size="lg"
              fullWidth
              onClick={handleDonate}
              loading={loading}
              disabled={!isValidAmount}
            >
              <Heart className="w-5 h-5 mr-2" />
              {user
                ? `Donate $${activeAmount.toLocaleString()} to Doc's Scholarship`
                : 'Sign In to Donate'}
            </Button>

            <p className="text-center text-sm text-slate-500 mt-4">
              100% tax deductible &bull; Processed securely via Stripe &bull; Project 22 is a 501(c)(3) organization
            </p>
          </div>
        </div>
      </section>

      {/* Memorial Link */}
      <section className="py-16 bg-brand-marine text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-slate-300 mb-4">
            Learn more about the man behind the scholarship
          </p>
          <Link
            to="/doc-sclater"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-white font-semibold text-lg transition-colors"
          >
            Read Jamie's Memorial Tribute
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
