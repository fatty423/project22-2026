import { useState, useEffect } from 'react';
import { Clock, Users, Heart, ArrowRight, Shield, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { supabase } from '../lib/supabase';

interface WaitingVeteran {
  id: string;
  full_name: string;
  branch: string;
  program_interest: string;
  created_at: string;
}

export function WaitingList() {
  const [veterans, setVeterans] = useState<WaitingVeteran[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalWaiting, setTotalWaiting] = useState(0);
  const navigateTo = useAppNavigate();

  useEffect(() => {
    async function fetchWaitingVeterans() {
      try {
        const { data, error, count } = await supabase
          .from('veteran_applications')
          .select('id, full_name, branch, program_interest, created_at', { count: 'exact' })
          .eq('status', 'pending')
          .order('created_at', { ascending: true })
          .limit(12);

        if (!error && data) {
          setVeterans(data);
          setTotalWaiting(count ?? data.length);
        }
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    }

    fetchWaitingVeterans();
  }, []);

  const getBranchColor = (branch: string) => {
    const colors: Record<string, string> = {
      'Army': 'bg-green-100 text-green-800',
      'Navy': 'bg-blue-100 text-blue-800',
      'Air Force': 'bg-sky-100 text-sky-800',
      'Marines': 'bg-red-100 text-red-800',
      'Coast Guard': 'bg-orange-100 text-orange-800',
    };
    return colors[branch] || 'bg-gray-100 text-gray-800';
  };

  const getTimeSinceApplied = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-200">Heroes Awaiting Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Waiting List
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            These veterans and first responders have applied for training programs and are waiting for sponsorship.
            Your support can help move them from waiting to training.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-400">{totalWaiting}</div>
              <div className="text-sm text-slate-400 mt-1">Heroes Waiting</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400">$500</div>
              <div className="text-sm text-slate-400 mt-1">Avg. Cost to Train</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400">94%</div>
              <div className="text-sm text-slate-400 mt-1">Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Heroes Ready for Training</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each person on this list has served our country and communities and is ready to build a new career.
              They just need someone to believe in them.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-marine" />
            </div>
          ) : veterans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {veterans.map((veteran, index) => (
                <Card key={veteran.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg">
                        {veteran.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{veteran.full_name}</h3>
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${getBranchColor(veteran.branch)}`}>
                          {veteran.branch}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">#{index + 1}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-brand-marine flex-shrink-0" />
                      <span>{veteran.program_interest || 'General Training'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <span>Applied {getTimeSinceApplied(veteran.created_at)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Heroes Currently Waiting</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                All current applicants have been matched with sponsors. Check back soon or help us
                spread the word to reach more heroes.
              </p>
            </div>
          )}

          <div className="bg-gradient-to-r from-brand-scarlet to-brand-scarlet/90 rounded-2xl p-8 md:p-12 text-white text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-white/80" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Help a Hero Start Their New Career
            </h3>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
              Your sponsorship directly funds training, certification, and job placement
              for a hero on this waiting list. Every contribution makes a difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigateTo('sponsor')}
                className="bg-white text-brand-scarlet hover:bg-slate-50 px-8 py-3 text-lg font-semibold"
              >
                <span className="flex items-center gap-2">
                  Sponsor a Hero <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
              <Button
                onClick={() => navigateTo('apply')}
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
