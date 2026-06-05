import { Briefcase, TrendingUp, FileText, Users, Phone, ArrowRight, Building, Handshake, Target, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppNavigate } from '../hooks/useAppNavigate';

const processSteps = [
  {
    number: '01',
    icon: Target,
    title: 'Career Assessment',
    description: 'We work with you one-on-one to understand your skills, interests, and career goals. Your military or first responder experience translates directly to high-demand roles.',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Resume & Portfolio Building',
    description: 'Our team helps you create a professional resume that translates your service experience into civilian-sector language that employers value and understand.',
  },
  {
    number: '03',
    icon: Users,
    title: 'Interview Preparation',
    description: 'Practice mock interviews with industry professionals. Learn how to communicate your strengths, handle tough questions, and present yourself with confidence.',
  },
  {
    number: '04',
    icon: Handshake,
    title: 'Direct Job Placement',
    description: 'We connect you directly with hiring partners in security, executive protection, investigations, and contracting. No job boards, real introductions to real employers.',
  },
];

const services = [
  { icon: FileText, title: 'Resume Writing', description: 'Professional resume development tailored to security industry standards' },
  { icon: Users, title: 'Mock Interviews', description: 'Practice sessions with feedback from hiring managers in the field' },
  { icon: Building, title: 'Employer Introductions', description: 'Direct connections to vetted companies actively hiring our graduates' },
  { icon: TrendingUp, title: 'Salary Negotiation', description: 'Guidance on market rates and negotiation strategies for top compensation' },
  { icon: Briefcase, title: 'Career Coaching', description: 'Ongoing mentorship to navigate your first 90 days and beyond' },
  { icon: Award, title: 'Credential Support', description: 'Help with licensing paperwork, background checks, and additional certifications' },
];

const salaryRanges = [
  { role: 'Security Officer', range: '$35,000 - $50,000', growth: 'Entry Level' },
  { role: 'Armed Security Specialist', range: '$45,000 - $65,000', growth: 'Mid Level' },
  { role: 'Private Investigator', range: '$50,000 - $85,000', growth: 'Mid Level' },
  { role: 'Executive Protection Agent', range: '$60,000 - $120,000', growth: 'Advanced' },
  { role: 'Overseas Security Contractor', range: '$80,000 - $200,000+', growth: 'Specialized' },
];

export function CareerSupport() {
  const navigate = useAppNavigate();

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-marine/20 rounded-2xl mb-8 backdrop-blur-sm border border-brand-marine/30">
              <Briefcase className="w-10 h-10 text-brand-gold" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Career Support
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              From training to employment, we walk beside you every step of the way with hands-on job placement assistance
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-marine mb-2">95%</div>
              <div className="text-slate-600 font-medium">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-marine mb-2">$55k</div>
              <div className="text-slate-600 font-medium">Avg Starting Salary</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-marine mb-2">30</div>
              <div className="text-slate-600 font-medium">Days Avg to Hire</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-marine mb-2">50+</div>
              <div className="text-slate-600 font-medium">Employer Partners</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Path to Employment
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A structured, proven process that has placed hundreds of graduates into meaningful careers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 h-full border border-slate-100 shadow-lg">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-4xl font-black text-brand-marine leading-none">{step.number}</span>
                    <div className="w-10 h-10 bg-brand-marine/10 rounded-full flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-brand-marine" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive career services designed specifically for veterans and first responders entering the security industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-marine/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-brand-marine" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Salary Potential
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Security industry careers offer competitive compensation with strong growth trajectories
            </p>
          </div>

          <div className="space-y-4">
            {salaryRanges.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-marine/10 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-brand-marine" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.role}</h3>
                    <span className="text-xs font-medium text-brand-marine bg-brand-marine/5 px-2 py-0.5 rounded-full">{item.growth}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-600">{item.range}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Salary ranges are estimates based on industry averages and graduate outcomes. Actual compensation varies by location, experience, and employer.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Career Starts Here
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Do not just train, launch a career. Apply today and let our career support team connect you with employers who value your service.
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
