import { UserCheck, Heart, Brain, Dumbbell, BookOpen, Sun, Users, Coffee, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppNavigate } from '../hooks/useAppNavigate';

const pillars = [
  {
    icon: Heart,
    title: 'Spirit',
    color: 'rose',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-600',
    description: 'Faith-based encouragement, chaplain support, and purpose-driven mentorship that helps you reconnect with meaning and hope.',
    elements: ['Weekly fellowship gatherings', 'One-on-one chaplain sessions', 'Purpose & identity workshops', 'Community prayer support'],
  },
  {
    icon: Brain,
    title: 'Soul',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    description: 'Mental health resources, counseling, mindset training, and emotional resilience building for lasting psychological wellness.',
    elements: ['Professional counseling access', 'Stress management techniques', 'Mindset & resilience training', 'Peer support groups'],
  },
  {
    icon: Dumbbell,
    title: 'Body',
    color: 'emerald',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-600',
    description: 'Physical fitness programs, nutrition guidance, and health assessments that rebuild your physical foundation and energy.',
    elements: ['Structured fitness programs', 'Nutrition planning', 'Health & wellness assessments', 'Active lifestyle coaching'],
  },
];

const dailySchedule = [
  { time: '0600', activity: 'Morning Formation & Motivation', icon: Sun },
  { time: '0630', activity: 'Physical Training & Fitness', icon: Dumbbell },
  { time: '0800', activity: 'Breakfast & Fellowship', icon: Coffee },
  { time: '0900', activity: 'Classroom Instruction', icon: BookOpen },
  { time: '1200', activity: 'Lunch & Peer Connection', icon: Users },
  { time: '1300', activity: 'Practical Exercises & Scenarios', icon: UserCheck },
  { time: '1600', activity: 'Personal Development Sessions', icon: Brain },
  { time: '1800', activity: 'Evening Activities & Reflection', icon: Heart },
];

const outcomes = [
  { stat: '92%', label: 'Report improved mental wellness' },
  { stat: '88%', label: 'Report stronger sense of purpose' },
  { stat: '95%', label: 'Report improved physical fitness' },
  { stat: '90%', label: 'Maintain progress at 6-month check-in' },
];

export function PersonalDevelopment() {
  const navigate = useAppNavigate();

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-marine/20 rounded-2xl mb-8 backdrop-blur-sm border border-brand-marine/30">
              <UserCheck className="w-10 h-10 text-brand-gold" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Personal Development
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              Holistic support addressing spirit, soul, and body -- because lasting transformation goes far beyond career training
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              The Three Pillars
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              True restoration requires caring for the whole person. Our approach integrates three essential dimensions of wellness.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className={`h-2 ${
                  pillar.color === 'rose' ? 'bg-rose-500' :
                  pillar.color === 'blue' ? 'bg-blue-500' :
                  'bg-emerald-500'
                }`} />
                <div className="p-8">
                  <div className={`w-16 h-16 ${pillar.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                    <pillar.icon className={`w-8 h-8 ${pillar.textColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{pillar.description}</p>
                  <div className="space-y-3">
                    {pillar.elements.map((element, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${pillar.textColor}`} />
                        <span className="text-slate-700">{element}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              A Day in the Life
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every day is structured with intention -- building discipline, community, and growth from morning to evening
            </p>
          </div>

          <div className="space-y-4">
            {dailySchedule.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-5 border border-slate-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-16 text-center flex-shrink-0">
                  <span className="text-lg font-mono font-bold text-blue-600">{item.time}</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="w-10 h-10 bg-brand-marine/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-brand-marine" />
                </div>
                <span className="text-slate-800 font-medium">{item.activity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-10 md:p-14">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              Outcomes That Matter
            </h3>
            <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
              Based on follow-up surveys with program graduates
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {outcomes.map((outcome, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-brand-gold mb-2">{outcome.stat}</div>
                  <div className="text-slate-400 text-sm font-medium">{outcome.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                More Than Training -- Transformation
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Many of our participants arrive carrying the invisible weight of service -- PTSD, depression, loss of identity, broken relationships. Our personal development program does not just teach skills. It helps rebuild lives.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Through a combination of professional counseling, peer mentorship, physical fitness, and spiritual support, we create an environment where healing happens naturally alongside career preparation. You are not just becoming employable -- you are becoming whole again.
              </p>
              <div className="flex items-center gap-3 bg-brand-marine/5 border border-brand-marine/10 rounded-xl p-4">
                <Clock className="w-6 h-6 text-brand-marine flex-shrink-0" />
                <span className="text-slate-700 font-medium">Support continues after graduation through our alumni network and follow-up program</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border border-slate-200 text-center">
                <Heart className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 mb-1">Counseling</h4>
                <p className="text-sm text-slate-600">Professional, confidential sessions</p>
              </Card>
              <Card className="border border-slate-200 text-center">
                <Users className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 mb-1">Peer Groups</h4>
                <p className="text-sm text-slate-600">Shared experiences, shared strength</p>
              </Card>
              <Card className="border border-slate-200 text-center">
                <Dumbbell className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 mb-1">Fitness</h4>
                <p className="text-sm text-slate-600">Structured physical training</p>
              </Card>
              <Card className="border border-slate-200 text-center">
                <Sun className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 mb-1">Mindfulness</h4>
                <p className="text-sm text-slate-600">Stress reduction & clarity</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Journey to Wholeness
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            You have served others your whole career. Now let someone serve you. Apply today and experience the transformation that comes from being truly supported.
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
              onClick={() => navigate('contact')}
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-brand-scarlet"
            >
              Talk to Someone
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
