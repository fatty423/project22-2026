import { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, DollarSign, Briefcase, Heart, CheckCircle, Play, Loader2, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TransparencySection } from '../components/TransparencySection';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

export function Impact() {
  const navigate = useAppNavigate();
  const metrics = [
    { icon: Users, number: '1,250+', label: 'Lives Impacted', color: 'marine' },
    { icon: TrendingUp, number: '95%', label: 'Job Placement Rate', color: 'green' },
    { icon: Star, number: '5-Star', label: 'Training Reviews', color: 'yellow' },
    { icon: DollarSign, number: '$55k', label: 'Avg Starting Salary', color: 'emerald' },
    { icon: Briefcase, number: '500+', label: 'Heroes Trained', color: 'marine' },
    { icon: Heart, number: '100+', label: 'Heroes Need Your Help', color: 'red' },
  ];

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [successStories, setSuccessStories] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [expandedTestimonials, setExpandedTestimonials] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchTestimonials() {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('page', 'impact')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (data) {
        setTestimonials(data.filter((t) => t.type === 'testimonial'));
        setSuccessStories(data.filter((t) => t.type === 'success_story'));
      }
      setTestimonialsLoading(false);
    }
    fetchTestimonials();
  }, []);

  const outcomes = [
    { label: 'Complete Career Training', percentage: 95 },
    { label: 'Secure Employment Within 90 Days', percentage: 87 },
    { label: 'Report Improved Life Satisfaction', percentage: 92 },
    { label: 'Continue Career Growth', percentage: 88 },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Our Impact
            </h1>
            <p className="text-xl md:text-2xl text-slate-200">
              Real results, transformed lives, and lasting success for veterans, first responders, and their families
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Impact by the Numbers
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Over 8 years of proven success supporting veterans and first responders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <Card key={index} hover>
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    metric.color === 'marine' ? 'bg-brand-marine/10' :
                    metric.color === 'green' ? 'bg-green-100' :
                    metric.color === 'yellow' ? 'bg-yellow-100' :
                    metric.color === 'emerald' ? 'bg-emerald-100' :
                    'bg-red-100'
                  }`}>
                    <metric.icon className={`w-8 h-8 ${
                      metric.color === 'marine' ? 'text-brand-marine' :
                      metric.color === 'green' ? 'text-green-600' :
                      metric.color === 'yellow' ? 'text-yellow-600' :
                      metric.color === 'emerald' ? 'text-emerald-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div className="text-5xl font-bold text-slate-900 mb-2">
                    {metric.number}
                  </div>
                  <div className="text-lg text-slate-600 font-medium">
                    {metric.label}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Success Outcomes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Percentage of participants who achieve key milestones
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {outcomes.map((outcome, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-slate-900">
                    {outcome.label}
                  </span>
                  <span className="text-2xl font-bold text-brand-marine">
                    {outcome.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-brand-marine h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${outcome.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TransparencySection />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real transformations from heroes in our program
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-marine animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {successStories.map((story) => (
                <Card key={story.id} hover>
                  {story.video_placeholder_url && (
                    <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden mb-4">
                      <img
                        src={story.video_placeholder_url}
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {story.name}
                    </h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    {story.quote}
                  </p>
                  {story.impact && (
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-sm font-semibold text-brand-marine">
                        {story.impact}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Graduate Testimonials
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Hear directly from graduates whose lives were transformed
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-marine animate-spin" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => {
                const isExpanded = expandedTestimonials[testimonial.id];
                const storyText = testimonial.story || '';
                const paragraphs = storyText.split('\n\n').filter(Boolean);
                const previewParagraphs = paragraphs.slice(0, 3);
                const hasMore = paragraphs.length > 3;
                const displayParagraphs = isExpanded ? paragraphs : previewParagraphs;

                return (
                  <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-5 mb-6">
                        {testimonial.photo_url && (
                          <img
                            src={testimonial.photo_url}
                            alt={testimonial.name}
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-marine/10 flex-shrink-0"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{testimonial.name}</h3>
                          <p className="text-sm text-slate-500 mb-2">{testimonial.military_branch}</p>
                          <div className="flex gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>

                      {testimonial.quote && (
                        <div className="relative bg-brand-marine/5 rounded-xl p-5 mb-6 border-l-4 border-brand-marine">
                          <Quote className="absolute top-3 right-3 w-8 h-8 text-brand-marine/20" />
                          <p className="text-slate-800 font-medium italic leading-relaxed pr-10">
                            "{testimonial.quote}"
                          </p>
                        </div>
                      )}

                      {storyText && (
                        <div className="space-y-4 flex-1">
                          {displayParagraphs.map((paragraph, i) => (
                            <p key={i} className="text-slate-600 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                          {!isExpanded && hasMore && (
                            <div className="relative pt-2">
                              <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                              <button
                                onClick={() => setExpandedTestimonials(prev => ({ ...prev, [testimonial.id]: true }))}
                                className="inline-flex items-center gap-1.5 text-brand-scarlet font-semibold hover:text-brand-dark-red transition-colors"
                              >
                                Read Full Story
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {isExpanded && hasMore && (
                            <button
                              onClick={() => setExpandedTestimonials(prev => ({ ...prev, [testimonial.id]: false }))}
                              className="inline-flex items-center gap-1.5 text-brand-scarlet font-semibold hover:text-brand-dark-red transition-colors"
                            >
                              Show Less
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}

                      {testimonial.role && (
                        <div className="mt-6 pt-4 border-t border-slate-200">
                          <p className="text-sm text-brand-marine font-medium">
                            {testimonial.role}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Be Part of the Impact
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Your support creates these life-changing results. Help us continue transforming lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('help')}
              className="text-lg bg-white hover:bg-slate-50 text-brand-scarlet"
            >
              <Heart className="w-5 h-5 mr-2" />
              Donate Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('heroes')}
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-brand-scarlet"
            >
              Sponsor a Hero
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
