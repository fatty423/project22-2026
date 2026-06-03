import { useState, useEffect } from 'react';
import { Shield, Award, Search, Home, Heart, GraduationCap, Users, Briefcase, ChevronRight, Clock, DollarSign, BadgeCheck, Phone, ArrowRight, Loader2, Monitor, MapPin, Package } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import type { LucideIcon } from 'lucide-react';

type Program = Database['public']['Tables']['programs']['Row'];
type ProgramCourse = Database['public']['Tables']['program_courses']['Row'];

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  Award,
  Search,
  BadgeCheck,
  GraduationCap,
  Briefcase,
  Heart,
  Users,
};

const steps = [
  {
    number: '01',
    title: 'Reach Out',
    description: 'Contact us by phone or fill out the form below. We will listen to your story and understand your goals.',
    icon: Phone,
  },
  {
    number: '02',
    title: 'Get Matched',
    description: 'Our team assesses your background, needs, and career goals to recommend the right training program for you.',
    icon: Users,
  },
  {
    number: '03',
    title: 'Train & Grow',
    description: 'Enroll in your program with access to housing, spiritual support, and hands-on training from experienced professionals.',
    icon: GraduationCap,
  },
  {
    number: '04',
    title: 'Launch Your Career',
    description: 'Graduate with industry certifications and receive direct job placement assistance with ongoing alumni support.',
    icon: Briefcase,
  },
];

const holisticPillars = [
  {
    title: 'Spiritual Wellness',
    description: 'Faith-based encouragement, community connection, and purpose-driven mentorship to rebuild your foundation from the inside out.',
    icon: Heart,
    color: 'rose',
  },
  {
    title: 'Career Training',
    description: 'World-class instruction in security, executive protection, and contracting with industry-recognized certifications.',
    icon: GraduationCap,
    color: 'marine',
  },
  {
    title: 'Family & Life Stability',
    description: 'Housing assistance, family wellness resources, and ongoing support so you and your loved ones can thrive together.',
    icon: Home,
    color: 'emerald',
  },
];

export function Programs() {
  const navigate = useAppNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [coursesByProgram, setCoursesByProgram] = useState<Record<string, ProgramCourse[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [programsResult, coursesResult] = await Promise.all([
        supabase
          .from('programs')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('program_courses')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
      ]);

      if (!programsResult.error && programsResult.data) {
        setPrograms(programsResult.data);
      }
      if (!coursesResult.error && coursesResult.data) {
        const grouped: Record<string, ProgramCourse[]> = {};
        for (const course of coursesResult.data) {
          if (!grouped[course.program_id]) grouped[course.program_id] = [];
          grouped[course.program_id].push(course);
        }
        setCoursesByProgram(grouped);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const getIcon = (iconName: string): LucideIcon => ICON_MAP[iconName] || Shield;

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-brand-gold font-semibold text-lg mb-4 tracking-wide uppercase">For Those Who Serve</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Your Next Chapter Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              We save lives through holistic support, spirit, soul, and body, with direct pathways to education, meaningful work, and family wellness for veterans and first responders.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From first contact to career launch, here is what your journey looks like
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-slate-50 rounded-2xl p-8 h-full border border-slate-100 hover:border-brand-gold/40 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-4xl font-black text-brand-marine leading-none">{step.number}</span>
                    <div className="w-10 h-10 bg-brand-marine/10 rounded-full flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-brand-marine" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-brand-gold" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              More Than a Job, A New Life
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We help the whole family, spiritually and practically, through training, job placement, and ongoing support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {holisticPillars.map((pillar, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  pillar.color === 'rose' ? 'bg-rose-100' :
                  pillar.color === 'marine' ? 'bg-brand-marine/10' :
                  'bg-emerald-100'
                }`}>
                  <pillar.icon className={`w-8 h-8 ${
                    pillar.color === 'rose' ? 'text-rose-600' :
                    pillar.color === 'marine' ? 'text-brand-marine' :
                    'text-emerald-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                <p className="text-slate-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Training Programs
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Industry-recognized certifications with hands-on instruction from experienced professionals
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-brand-marine animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => {
                const IconComponent = getIcon(program.icon_name);
                const courses = coursesByProgram[program.id] || [];
                const hasCourses = courses.length > 0;

                return (
                  <div
                    key={program.id}
                    className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                      hasCourses ? 'lg:col-span-2 md:col-span-2' : ''
                    } ${
                      program.is_coming_soon
                        ? 'bg-slate-50 border-slate-200 opacity-75'
                        : program.is_featured
                          ? 'bg-white border-brand-gold shadow-xl ring-2 ring-brand-gold/20 hover:shadow-2xl hover:-translate-y-1'
                          : 'bg-white border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    {program.is_featured && (
                      <div className="bg-brand-marine text-white text-center py-2 text-sm font-bold tracking-wide uppercase">
                        Most Comprehensive
                      </div>
                    )}
                    {program.is_coming_soon && (
                      <div className="bg-slate-400 text-white text-center py-2 text-sm font-bold tracking-wide uppercase">
                        Coming Soon
                      </div>
                    )}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          program.is_coming_soon
                            ? 'bg-slate-200'
                            : program.tier === 'premium'
                              ? 'bg-brand-marine/10'
                              : program.tier === 'mid'
                                ? 'bg-brand-gold/10'
                                : 'bg-slate-100'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            program.is_coming_soon
                              ? 'text-slate-400'
                              : program.tier === 'premium'
                                ? 'text-brand-marine'
                                : program.tier === 'mid'
                                  ? 'text-brand-gold'
                                  : 'text-slate-600'
                          }`} />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-1">{program.name}</h3>
                      <p className={`text-sm font-medium mb-4 ${program.is_coming_soon ? 'text-slate-400' : 'text-brand-marine'}`}>
                        {program.subtitle}
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {program.description}
                      </p>

                      {hasCourses && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Individual Courses</h4>
                          <div className="space-y-3">
                            {courses.map((course) => (
                              <div key={course.id} className="flex items-center justify-between gap-4 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    course.format === 'Online' ? 'bg-teal-100' : 'bg-amber-100'
                                  }`}>
                                    {course.format === 'Online' ? (
                                      <Monitor className="w-4 h-4 text-teal-600" />
                                    ) : (
                                      <MapPin className="w-4 h-4 text-amber-600" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{course.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                        course.format === 'Online'
                                          ? 'bg-teal-50 text-teal-700'
                                          : 'bg-amber-50 text-amber-700'
                                      }`}>
                                        {course.format}
                                      </span>
                                      <span className="text-xs text-slate-500">{course.duration}</span>
                                    </div>
                                  </div>
                                </div>
                                <span className="text-sm font-bold text-slate-900 flex-shrink-0">{course.price}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 bg-brand-marine/5 rounded-xl px-4 py-3 border border-brand-marine/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-brand-marine/10 flex items-center justify-center">
                                <Package className="w-4 h-4 text-brand-marine" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-brand-marine">Full Pathway Bundle</p>
                                <p className="text-xs text-brand-marine/70">{program.duration}</p>
                              </div>
                            </div>
                            <span className="text-lg font-bold text-brand-marine">{program.price}</span>
                          </div>
                        </div>
                      )}

                      {!program.is_coming_soon && !hasCourses && (
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-3 text-sm">
                            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-600">{program.duration}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-900 font-semibold">{program.price}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-emerald-700 font-medium">{program.salary_range}</span>
                          </div>
                        </div>
                      )}

                      {!program.is_coming_soon && hasCourses && (
                        <div className="pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-3 text-sm">
                            <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-emerald-700 font-medium">{program.salary_range}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-center text-sm text-slate-500 mt-8 max-w-2xl mx-auto">
            Salary ranges are estimates based on industry averages and graduate outcomes. Actual compensation varies based on location, experience, employer, and additional certifications.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border border-slate-200">
            <div className="flex flex-col md:flex-row items-center gap-8 p-4 md:p-8">
              <div className="w-20 h-20 bg-brand-marine/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Home className="w-10 h-10 text-brand-marine" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Housing Available</h3>
                <p className="text-slate-600 leading-relaxed">
                  Need a place to stay during your training? We offer on-site housing for those enrolled in our programs at <span className="font-bold text-slate-900">$75 per night</span>. Focus on your training, we will take care of the rest.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  size="lg"
                  onClick={() => navigate('contact')}
                >
                  Inquire
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Take the First Step?
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            It does not matter where you are right now. What matters is where you are headed. Reach out today and let us walk this journey with you.
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
              onClick={() => {
                window.location.href = 'tel:+17275551212';
              }}
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-brand-scarlet flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Us Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
