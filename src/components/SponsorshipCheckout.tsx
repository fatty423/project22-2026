import { useState } from 'react';
import { Heart, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { TaxDisclosure } from './TaxDisclosure';
import { useAuth } from '../lib/auth';
import { createDonationCheckout } from '../lib/stripe';
import { Database } from '../lib/supabase';
import { fundingBarPercent } from '../lib/funding';

type Veteran = Database['public']['Tables']['veterans']['Row'];

const PRESET_AMOUNTS = [250, 500, 1000, 1500];
const MIN_AMOUNT = 5;

interface SponsorshipCheckoutProps {
  veteran: Veteran;
  isOpen: boolean;
  onClose: () => void;
}

export function SponsorshipCheckout({ veteran, isOpen, onClose }: SponsorshipCheckoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const isValidAmount = activeAmount >= MIN_AMOUNT;
  const remaining = veteran.sponsorship_amount_needed - veteran.sponsorship_amount_raised;

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

  const handleCheckout = async () => {
    if (veteran.is_sponsored) {
      return;
    }

    if (!user) {
      onClose();
      navigate(`/login?redirect=${encodeURIComponent(`/heroes/${veteran.id}`)}`);
      return;
    }

    if (!isValidAmount) {
      setError(`Minimum amount is $${MIN_AMOUNT}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const veteranLabel = `${veteran.first_name} ${veteran.last_initial}.`;
      const successUrl = `${window.location.origin}/success?type=sponsorship&amount=${activeAmount}&veteran_name=${encodeURIComponent(veteranLabel)}`;
      const cancelUrl = `${window.location.origin}/heroes/${veteran.id}`;

      const { url } = await createDonationCheckout(
        activeAmount,
        false,
        successUrl,
        cancelUrl,
        veteran.id
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Sponsor ${veteran.first_name}`} maxWidth="lg">
      <div className="space-y-6">
        <div className="flex items-start gap-5">
          <img
            src={veteran.photo_url}
            alt={`${veteran.first_name} ${veteran.last_initial}.`}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {veteran.first_name} {veteran.last_initial}.
            </h3>
            <p className="text-slate-600 text-sm mb-1">
              {veteran.military_branch} | {veteran.current_location}
            </p>
            <p className="text-sm text-slate-500">
              <span className="font-medium">Career Goal:</span> {veteran.career_goals}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3">Funding Progress</h4>
          <div className="w-full bg-slate-200 rounded-full h-2.5 mb-3 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-brand-marine rounded-full transition-all"
              style={{ width: `${fundingBarPercent(veteran.sponsorship_amount_raised, veteran.sponsorship_amount_needed)}%` }}
            />
            {isValidAmount && (
              <div
                className="absolute inset-y-0 left-0 bg-brand-marine/30 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(fundingBarPercent(veteran.sponsorship_amount_raised + activeAmount, veteran.sponsorship_amount_needed), 100)}%` }}
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Raised</p>
              <p className="font-bold text-green-600">${veteran.sponsorship_amount_raised.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-slate-500">Goal</p>
              <p className="font-bold text-slate-900">${veteran.sponsorship_amount_needed.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-slate-500">Remaining</p>
              <p className="font-bold text-brand-marine">${remaining.toFixed(0)}</p>
            </div>
          </div>
          {isValidAmount && (
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
              <span className="text-slate-500">With your contribution</span>
              <span className="font-bold text-brand-marine">
                {Math.min(Math.round(((veteran.sponsorship_amount_raised + activeAmount) / veteran.sponsorship_amount_needed) * 100), 100)}% funded
              </span>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Choose Your Sponsorship Amount</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {PRESET_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`rounded-xl border-2 py-3.5 px-3 font-bold text-lg transition-all duration-200 ${
                  selectedAmount === amount && !customAmount
                    ? 'border-brand-marine bg-brand-marine/5 text-brand-marine ring-2 ring-brand-marine/20'
                    : 'border-slate-200 text-slate-700 hover:border-brand-marine/30 hover:bg-slate-50'
                }`}
              >
                ${amount.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">$</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Or enter a custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              onFocus={() => setSelectedAmount(0)}
              className="w-full pl-10 pr-4 py-3 text-lg font-semibold border-2 border-slate-200 rounded-xl focus:border-brand-marine focus:ring-2 focus:ring-brand-marine/20 outline-none transition-all"
            />
          </div>
        </div>

        {isValidAmount && (
          <div className="bg-brand-marine/5 border border-brand-marine/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Sponsorship for {veteran.first_name}</span>
              <span className="text-xl font-bold text-brand-marine">${activeAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <Heart className="w-4 h-4 text-brand-scarlet flex-shrink-0 mt-0.5" />
              <span>Your contribution goes directly toward {veteran.first_name}'s career training and certification costs.</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <Button
            fullWidth
            size="lg"
            onClick={handleCheckout}
            loading={loading}
            disabled={!isValidAmount || loading}
            className="flex items-center justify-center gap-2"
          >
            {!user ? (
              'Sign In to Sponsor'
            ) : loading ? (
              'Processing...'
            ) : (
              <>
                <Heart className="w-5 h-5" />
                {isValidAmount ? `Sponsor $${activeAmount.toLocaleString()}` : 'Select an Amount'}
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Secure payment via Stripe
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              100% tax-deductible
            </span>
          </div>
          <TaxDisclosure className="mt-3 justify-center" />
        </div>
      </div>
    </Modal>
  );
}
