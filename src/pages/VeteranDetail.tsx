import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Shield, Target, Heart, Play, Instagram, Share2, Copy, Check, Facebook, Twitter, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { SponsorshipCheckout } from '../components/SponsorshipCheckout';
import { HeroTimeline } from '../components/HeroTimeline';
import { HeroDonorRecognition } from '../components/HeroDonorRecognition';
import { PublicJourneyFeed } from '../components/PublicJourneyFeed';
import { supabase, Database } from '../lib/supabase';
import { formatFundingPercent, fundingBarPercent } from '../lib/funding';

type Veteran = Database['public']['Tables']['veterans']['Row'];
type VeteranProgress = Database['public']['Tables']['veteran_progress']['Row'];

function renderVideoEmbed(url: string) {
  const trimmed = url.trim();

  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        className="w-full h-full"
        title="Veteran video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return (
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
        className="w-full h-full"
        title="Veteran video"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  const isDirectVideo =
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed) ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('blob:') ||
    trimmed.includes('/storage/v1/object/');
  if (isDirectVideo) {
    const isMov = /\.mov(\?.*)?$/i.test(trimmed);
    return (
      <video
        className="w-full h-full"
        controls
        autoPlay
        muted
        playsInline
        preload="metadata"
      >
        <source src={trimmed} type={isMov ? 'video/mp4' : undefined} />
        Your browser does not support embedded videos.
      </video>
    );
  }

  return (
    <iframe
      src={trimmed}
      className="w-full h-full"
      title="Veteran video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

export function VeteranDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [veteran, setVeteran] = useState<Veteran | null>(null);
  const [milestones, setMilestones] = useState<VeteranProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const INSTAGRAM_URL = 'https://www.instagram.com/project22us?igsh=NWwzazFmenJneGpq&utm_source=qr';

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = veteran
      ? `Help sponsor ${veteran.first_name} ${veteran.last_initial}., a ${veteran.military_branch} veteran pursuing a career as a ${veteran.career_goals}. Support their journey with Project 22.`
      : 'Support a veteran with Project 22.';

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Project 22 Hero', text: shareText, url: shareUrl });
        return;
      } catch (err) {
        // user cancelled or share failed, fall through to copy
      }
    }
    handleCopyLink();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  useEffect(() => {
    if (id) fetchVeteran(id);
  }, [id]);

  const fetchVeteran = async (veteranId: string) => {
    try {
      const { data, error } = await supabase
        .from('veterans')
        .select('*')
        .eq('id', veteranId)
        .maybeSingle();

      if (error) throw error;
      setVeteran(data);

      const { data: progressData } = await supabase
        .from('veteran_progress')
        .select('*')
        .eq('veteran_id', veteranId)
        .order('sort_order', { ascending: true });

      if (progressData) setMilestones(progressData);
    } catch (error) {
      console.error('Error fetching veteran:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-marine" />
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!veteran) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="text-center max-w-md mx-auto">
          <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
          <p className="text-slate-600 mb-6">This profile may have been removed or does not exist.</p>
          <Button onClick={() => navigate('/heroes')}>
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Directory
          </Button>
        </Card>
      </div>
    );
  }

  const fundingPercentLabel = formatFundingPercent(
    veteran.sponsorship_amount_raised,
    veteran.sponsorship_amount_needed
  );
  const fundingBarWidth = fundingBarPercent(
    veteran.sponsorship_amount_raised,
    veteran.sponsorship_amount_needed
  );
  const remaining = veteran.sponsorship_amount_needed - veteran.sponsorship_amount_raised;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative bg-brand-marine text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-12">
          <button
            onClick={() => navigate('/heroes')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Directory
          </button>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img
                  src={veteran.photo_url}
                  alt={`${veteran.first_name} ${veteran.last_initial}.`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                {veteran.is_sponsored && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Sponsored
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {veteran.first_name} {veteran.last_initial}.
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-lg mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-gold" />
                  <span className="font-semibold text-white/80">{veteran.military_branch}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-300" />
                  <span className="text-slate-200">{veteran.current_location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-300" />
                  <span className="text-slate-200">{veteran.career_goals}</span>
                </div>
              </div>

              <p className="text-slate-200 text-lg leading-relaxed mb-8 max-w-2xl">
                {veteran.biography}
              </p>

              <div className="flex flex-wrap gap-3">
                {veteran.is_sponsored ? (
                  <Button
                    size="lg"
                    disabled
                    className="flex items-center gap-2 !bg-white/10 !text-white/70 !opacity-70 cursor-not-allowed border border-white/20"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Funded!
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => setShowSponsorModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    Sponsor {veteran.first_name}
                  </Button>
                )}
                {veteran.video_url && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setShowVideoModal(true)}
                    className="flex items-center gap-2 !bg-transparent border-white/30 !text-white hover:!bg-white/10"
                  >
                    <Play className="w-5 h-5" />
                    Watch Video
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Background</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Branch</p>
                    <p className="text-lg font-semibold text-slate-900">{veteran.military_branch}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Stationed At</p>
                    <p className="text-lg font-semibold text-slate-900">{veteran.service_location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Current Location</p>
                    <p className="text-lg font-semibold text-slate-900">{veteran.current_location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Career Goal</p>
                    <p className="text-lg font-semibold text-slate-900">{veteran.career_goals}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About {veteran.first_name}</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{veteran.biography}</p>
              </Card>

              {milestones.length > 0 && (
                <Card>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Journey Progress</h2>
                  <HeroTimeline milestones={milestones} />
                </Card>
              )}

              <PublicJourneyFeed veteranId={veteran.id} firstName={veteran.first_name} />
            </div>

            <div className="space-y-6">
              {!veteran.is_sponsored && (
                <Card className="border-2 border-brand-marine/20">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Funding Progress</h3>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-brand-marine mb-1">{fundingPercentLabel}</div>
                    <p className="text-sm text-slate-500">of goal reached</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-brand-marine h-3 rounded-full transition-all duration-500"
                      style={{ width: `${fundingBarWidth}%` }}
                    />
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Raised</span>
                      <span className="font-bold text-green-600">
                        ${veteran.sponsorship_amount_raised.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Goal</span>
                      <span className="font-bold text-slate-900">
                        ${veteran.sponsorship_amount_needed.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-200">
                      <span className="text-slate-600">Remaining</span>
                      <span className="font-bold text-brand-marine text-lg">
                        ${remaining.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => setShowSponsorModal(true)}
                    className="flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    Sponsor Now
                  </Button>
                </Card>
              )}

              <HeroDonorRecognition
                veteranId={veteran.id}
                veteranFirstName={veteran.first_name}
              />

              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="w-5 h-5 text-brand-marine" />
                  <h3 className="text-lg font-bold text-slate-900">Share {veteran.first_name}'s Story</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Help {veteran.first_name} reach their goal. Share this profile with your network and rally donations.
                </p>
                <div className="space-y-2 mb-4">
                  <Button
                    fullWidth
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Profile
                  </Button>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        Link Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Share On</p>
                  <div className="flex gap-2">
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-lg transition-colors"
                      aria-label="Share on Instagram"
                      title="Tag @project22us on Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Help sponsor ${veteran.first_name} ${veteran.last_initial}., a ${veteran.military_branch} veteran with Project 22.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
                      aria-label="Share on Twitter/X"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(`Support ${veteran.first_name} with Project 22`)}&body=${encodeURIComponent(`I wanted to share this story with you. ${veteran.first_name} ${veteran.last_initial}. is pursuing a career as a ${veteran.career_goals}. You can learn more and support their journey here: ${window.location.href}`)}`}
                      className="flex-1 flex items-center justify-center w-10 h-10 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors"
                      aria-label="Share via Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Posting on Instagram? Tag{' '}
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-marine hover:underline"
                    >
                      @project22us
                    </a>
                  </p>
                </div>
              </Card>

              <Card className="bg-slate-800 text-white">
                <h3 className="text-lg font-bold mb-3">How Sponsorship Works</h3>
                <ol className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-marine rounded-full flex items-center justify-center text-xs font-bold text-white">1</span>
                    <span>Choose your contribution amount -- any amount helps.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-marine rounded-full flex items-center justify-center text-xs font-bold text-white">2</span>
                    <span>Funds go directly toward training and certification costs.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-marine rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>
                    <span>Track progress through regular updates.</span>
                  </li>
                </ol>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <SponsorshipCheckout
        veteran={veteran}
        isOpen={showSponsorModal}
        onClose={() => setShowSponsorModal(false)}
      />

      <Modal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        maxWidth="xl"
      >
        <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
          {veteran.video_url && renderVideoEmbed(veteran.video_url)}
        </div>
      </Modal>
    </div>
  );
}
