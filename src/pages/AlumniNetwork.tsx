import { useState } from 'react';
import { Network, Users, Briefcase, Calendar, MessageCircle, Award, ArrowRight, CheckCircle, Loader2, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { supabase } from '../lib/supabase';

const benefits = [
  {
    icon: Users,
    title: 'Peer Mentorship',
    description: 'Connect with graduates who understand your journey. Mentors offer guidance on career advancement, life transitions, and staying on track.',
  },
  {
    icon: Briefcase,
    title: 'Job Referrals',
    description: 'Alumni regularly share job openings within their companies. Many of our best placements come through the network itself.',
  },
  {
    icon: Calendar,
    title: 'Exclusive Events',
    description: 'Regional meetups, annual gatherings, training refreshers, and networking events designed to keep the community strong.',
  },
  {
    icon: MessageCircle,
    title: 'Private Community',
    description: 'Access to a private alumni group where graduates share resources, advice, and support with one another year-round.',
  },
  {
    icon: Award,
    title: 'Continued Education',
    description: 'Discounted access to advanced certifications, refresher courses, and new program offerings as they become available.',
  },
  {
    icon: Shield,
    title: 'Lifetime Support',
    description: 'Once you are part of the Project 22 family, you always have a place to turn. Our support does not expire at graduation.',
  },
];

const communityStats = [
  { number: '500+', label: 'Active Alumni Members' },
  { number: '45', label: 'States Represented' },
  { number: '12+', label: 'Annual Events' },
  { number: '85%', label: 'Stay Connected After 1 Year' },
];

const BRANCH_OPTIONS = [
  'Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force',
  'Law Enforcement', 'Fire Department', 'EMS/EMT', 'Dispatch', 'Corrections',
];

const INTEREST_OPTIONS = [
  { value: 'mentoring', label: 'Mentoring New Students' },
  { value: 'networking', label: 'Networking Events' },
  { value: 'job_referrals', label: 'Job Referrals' },
  { value: 'speaking', label: 'Speaking Opportunities' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'continued_education', label: 'Continued Education' },
];

export function AlumniNetwork() {
  const navigate = useAppNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    military_branch: '',
    graduation_year: '',
    job_title: '',
    employer: '',
    interests: [] as string[],
    message: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleInterestToggle(value: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: insertError } = await supabase
      .from('alumni_registrations')
      .insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        military_branch: form.military_branch,
        graduation_year: form.graduation_year,
        job_title: form.job_title,
        employer: form.employer,
        interests: form.interests,
        message: form.message,
      });

    setSubmitting(false);

    if (insertError) {
      setError('Something went wrong. Please try again or contact us directly.');
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-marine/20 rounded-2xl mb-8 backdrop-blur-sm border border-brand-marine/30">
              <Network className="w-10 h-10 text-brand-gold" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Alumni Network
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              A thriving community of graduates who support, uplift, and create opportunities for one another long after graduation
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-brand-marine mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Network Benefits
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Graduation is just the beginning. The alumni network keeps you connected, supported, and growing throughout your career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} hover className="border border-slate-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-brand-marine/10 rounded-2xl flex items-center justify-center mb-5">
                    <benefit.icon className="w-7 h-7 text-brand-marine" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" id="alumni-form">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Join the Network
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Are you a Project 22 graduate? Register below to connect with the alumni community and access exclusive benefits.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Welcome to the Network!</h3>
              <p className="text-slate-600 leading-relaxed max-w-lg mx-auto mb-6">
                Your registration has been received. Our team will review your information and reach out with next steps to get you connected with the alumni community.
              </p>
              <Button
                onClick={() => navigate('home')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Back to Home
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl border border-slate-200 p-8 md:p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={form.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-marine focus:border-brand-marine transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-marine focus:border-brand-marine transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-marine focus:border-brand-marine transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="military_branch" className="block text-sm font-semibold text-slate-700 mb-2">Branch of Service *</label>
                  <select
                    id="military_branch"
                    name="military_branch"
                    required
                    value={form.military_branch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select branch...</option>
                    {BRANCH_OPTIONS.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="graduation_year" className="block text-sm font-semibold text-slate-700 mb-2">Graduation Year *</label>
                  <input
                    id="graduation_year"
                    name="graduation_year"
                    type="text"
                    required
                    placeholder="e.g. 2024"
                    value={form.graduation_year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-marine focus:border-brand-marine transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="job_title" className="block text-sm font-semibold text-slate-700 mb-2">Current Job Title</label>
                  <input
                    id="job_title"
                    name="job_title"
                    type="text"
                    value={form.job_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-marine focus:border-brand-marine transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="employer" className="block text-sm font-semibold text-slate-700 mb-2">Current Employer</label>
                  <input
                    id="employer"
                    name="employer"
                    type="text"
                    value={form.employer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-marine focus:border-brand-marine transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Interested In</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INTEREST_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInterestToggle(option.value)}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left ${
                        form.interests.includes(option.value)
                          ? 'bg-brand-marine border-brand-marine text-white'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-brand-marine/30'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Anything Else?</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your experience, what you are doing now, or how you would like to contribute to the network..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full bg-brand-marine hover:bg-brand-marine/90 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Join the Alumni Network
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Not Yet a Graduate?
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Start your journey today and become part of this incredible community. Apply for a scholarship and take the first step toward a new career and a lifelong network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('apply')}
              className="text-lg bg-white hover:bg-slate-50 text-brand-scarlet flex items-center justify-center gap-2"
            >
              Apply for Scholarship
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('programs')}
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-brand-scarlet"
            >
              View Programs
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
