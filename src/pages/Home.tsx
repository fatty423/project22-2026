import { useState, useEffect } from 'react';
import { Heart, Award, Users, TrendingUp, Shield, Briefcase, GraduationCap, UserCheck, Network, Star, Quote, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PartnersSection } from '../components/PartnersSection';
import { DonorRecognitionSection } from '../components/DonorRecognitionSection';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

export function Home() {
  const navigate = useAppNavigate();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const rotatingPhrases = [
    'RESTORING HOPE',
    'BUILDING FUTURES',
    'CREATING PURPOSE',
    'SAVING LIVES'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
        setIsAnimating(false);
      }, 500);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: '95%', sublabel: 'Job Placement Rate', icon: TrendingUp },
    { label: '5-Star', sublabel: 'Training Reviews', icon: Award },
    { label: '500+', sublabel: 'Heroes Trained', icon: Users },
    { label: '100+', sublabel: 'Heroes Need Your Help', icon: Heart },
  ];

  const programHighlights = [
    {
      icon: Shield,
      title: 'Advanced Training',
      description: 'Industry-leading security guard, executive protection, and overseas contracting programs',
      link: '/advanced-training',
    },
    {
      icon: GraduationCap,
      title: 'Expert Instructors',
      description: 'Learn from experienced professionals with decades of combined field experience',
      link: '/expert-instructors',
    },
    {
      icon: Briefcase,
      title: 'Career Support',
      description: 'Job placement assistance with average starting salaries of $55,000',
      link: '/career-support',
    },
    {
      icon: UserCheck,
      title: 'Personal Development',
      description: 'Holistic support addressing spirit, soul, and body for complete wellness',
      link: '/personal-development',
    },
    {
      icon: Network,
      title: 'Alumni Network',
      description: 'Join a thriving community of successful graduates supporting each other',
      link: '/alumni-network',
    },
    {
      icon: Heart,
      title: 'Family Wellness',
      description: 'Resources and support for heroes and their families throughout the journey',
      link: '/family-wellness',
    },
  ];

  const impactStats = [
    { number: '1,250+', label: 'Lives Impacted' },
    { number: '8+', label: 'Years Experience' },
    { number: '$55k', label: 'Average Starting Salary' },
    { number: '95%', label: 'Career Placement Rate' },
  ];

  const [successStories, setSuccessStories] = useState<Testimonial[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('page', 'home')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (data) {
        setSuccessStories(data.filter((t) => t.type === 'success_story'));
        setTestimonials(data.filter((t) => t.type === 'testimonial'));
      }
      setTestimonialsLoading(false);
    }
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative text-white overflow-hidden" style={{ minHeight: '90vh' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.65)' }}
        >
          <source src="/Project22_1.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col justify-center" style={{ minHeight: '90vh' }}>
          <div className="text-center max-w-5xl mx-auto">
            <h1
              className="text-4xl md:text-5xl lg:text-7xl font-display mb-6 leading-tight uppercase tracking-tight"
              style={{
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)'
              }}
            >
              <span
                className={`inline-block transition-all duration-500 ${
                  isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
                aria-live="polite"
                aria-atomic="true"
              >
                {rotatingPhrases[currentPhraseIndex]}
              </span>
            </h1>

            <p
              className="text-lg md:text-xl lg:text-2xl mb-10 leading-relaxed font-medium max-w-4xl mx-auto"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
              }}
            >
              Supporting veterans and first responders through career training
              <br />
              programs in Security, Executive Protection, Private Investigation, and Beyond!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => navigate('heroes')}
                className="text-lg font-bold flex items-center justify-center gap-2 px-8 py-6 shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-6 h-6" />
                Sponsor a Hero
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('help')}
                className="text-lg font-bold flex items-center justify-center gap-2 px-8 py-6 shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Users className="w-6 h-6" />
                Join the Mission
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('apply')}
                className="text-lg font-bold flex items-center justify-center gap-2 px-8 py-6 bg-white/95 hover:bg-white text-brand-marine hover:text-brand-marine border-2 border-white shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Get Started — Apply Now
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Doc Sclater Memorial Banner */}
      <Link
        to="/doc-sclater"
        className="block bg-slate-900 hover:bg-slate-800 transition-colors duration-200 border-b border-brand-gold/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center gap-3">
          <Star className="w-6 h-6 text-brand-gold fill-brand-gold flex-shrink-0" />
          <span className="text-lg font-semibold text-white">
            In Memory of Jamie "Doc" Sclater
          </span>
          <span className="text-sm text-slate-300">
            USMC Scout Sniper &bull; Navy Corpsman &bull; ESS Academy Instructor &bull; Fallen Hero
          </span>
          <span className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-brand-gold hover:text-brand-gold/80 transition-colors">
            Learn More About the Doc Sclater Scholarship
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>

      <section className="py-16 bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-marine/10 rounded-brand mb-4">
                  <stat.icon className="w-8 h-8 text-brand-marine" />
                </div>
                <div className="text-4xl font-display uppercase text-brand-marine mb-2">
                  {stat.label}
                </div>
                <div className="text-slate-600 font-medium">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-brand-scarlet mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              To save lives through holistic support addressing spirit, soul, and body with direct pathways to education, meaningful work, and family wellness for veterans and first responders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programHighlights.map((highlight, index) => (
              <Link key={index} to={highlight.link} className="block group">
                <Card hover className="h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-brand-marine/10 rounded-brand flex items-center justify-center mb-4 group-hover:bg-brand-scarlet/10 transition-colors duration-300">
                      <highlight.icon className="w-8 h-8 text-brand-marine group-hover:text-brand-scarlet transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-display uppercase text-brand-marine mb-3 group-hover:text-brand-scarlet transition-colors duration-300">
                      {highlight.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {highlight.description}
                    </p>
                    <span className="mt-4 text-brand-scarlet font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-brand-scarlet mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Over 8 years of dedicated service to those who served and protected our communities
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-display text-brand-scarlet mb-3">
                  {stat.number}
                </div>
                <div className="text-lg text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnersSection />

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-brand-scarlet mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real heroes, real transformations, real impact
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-scarlet animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story) => (
                <Card key={story.id} hover>
                  <div className="flex flex-col h-full">
                    {story.photo_url && (
                      <div className="mb-4">
                        <img
                          src={story.photo_url}
                          alt={story.name}
                          className="w-full h-64 object-cover rounded-brand"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-xl font-display uppercase text-brand-marine mb-1">
                        {story.name}
                      </h3>
                      <p className="text-brand-scarlet font-semibold mb-1">
                        {story.role}
                      </p>
                      <p className="text-sm text-slate-500 mb-4">
                        {story.military_branch}
                      </p>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        {story.story}
                      </p>
                    </div>
                    {story.outcome && (
                      <div className="mt-auto pt-4 border-t border-slate-200">
                        <div className="flex items-start gap-2">
                          <Award className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-semibold text-slate-700">
                            {story.outcome}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('impact')}
            >
              Read More Success Stories
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-brand-scarlet mb-4">
              Graduate Testimonials
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Hear directly from graduates whose lives were transformed
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-scarlet animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} hover>
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <Quote className="w-12 h-12 text-brand-gold/40" />
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-6 flex-grow italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="pt-4 border-t border-slate-200">
                      <p className="font-bold text-brand-marine">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {testimonial.military_branch}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-lg text-slate-600 mb-6">
              Join hundreds of veterans and first responders who have transformed their lives through Project 22
            </p>
            <Button
              size="lg"
              onClick={() => navigate('apply')}
            >
              Apply for Scholarship
            </Button>
          </div>
        </div>
      </section>

      <DonorRecognitionSection />

      <section className="py-20 brand-gradient-marine text-white relative overflow-hidden">
        <div className="absolute inset-0 diagonal-stripes text-white pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-slate-300">
            Your support can change a life. Help us provide world-class training and career opportunities to veterans and first responders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('help')}
              className="text-lg bg-brand-scarlet hover:bg-brand-dark-red text-white"
            >
              <Heart className="w-5 h-5 mr-2" />
              Donate Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('heroes')}
              className="text-lg border-2 border-white text-white hover:bg-white hover:text-brand-marine"
            >
              Sponsor a Hero
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
