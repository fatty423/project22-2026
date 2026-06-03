import { Heart, Home, Users, BookOpen, Phone, Shield, ArrowRight, Smile, HandHeart, Baby, DollarSign, Compass, Sparkles, TreePine } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppNavigate } from '../hooks/useAppNavigate';

const services = [
  {
    icon: Heart,
    title: 'Marriage & Couples Intensives',
    description: 'Weekend intensive experiences designed to help couples reconnect, heal, and restore their relationship from the inside out — addressing the heart behind the brokenness.',
  },
  {
    icon: Compass,
    title: 'Faith-Centered Restoration',
    description: 'Guided by the belief that lasting change begins within, our approach tends to the heart first — helping families rediscover purpose, identity, and the sacred simplicity of living together.',
  },
  {
    icon: DollarSign,
    title: 'Financial Guidance',
    description: 'Budgeting workshops, debt management coaching, and financial planning to help families build stability and security for the future.',
  },
  {
    icon: Baby,
    title: 'Childcare Support',
    description: 'Resources and referrals for childcare during training hours so parents can focus fully on their program without added stress.',
  },
  {
    icon: Home,
    title: 'Housing Assistance',
    description: 'On-site housing options during training and referral partnerships for families transitioning into permanent housing solutions.',
  },
  {
    icon: Users,
    title: 'Spouse Support Groups',
    description: 'Regular gatherings where spouses connect with others who understand the unique pressures of supporting a transitioning service member.',
  },
  {
    icon: BookOpen,
    title: 'Educational Resources',
    description: 'Workshops on communication, parenting during transition, managing expectations, and building resilience as a family unit.',
  },
  {
    icon: Sparkles,
    title: 'Scholarship-Backed Retreats',
    description: 'Through generous sponsorship, couples who might not otherwise afford a transformative weekend intensive can attend at no cost — removing financial barriers to healing.',
  },
];

const approach = [
  {
    title: 'Start from the Inside Out',
    description: 'If we look at the brokenness found within the human heart, we can trace it back to the place the heart called home. True restoration begins by tending to what is deepest — not just managing symptoms, but addressing root causes within the family.',
    icon: Heart,
  },
  {
    title: 'Restore the Sacred Simplicity',
    description: 'Families today are overwhelmed by complexity. Our approach strips away the noise and returns to what matters most — genuine connection, honest communication, and a shared sense of purpose rooted in faith.',
    icon: TreePine,
  },
  {
    title: 'Walk Together, Not Alone',
    description: 'No family heals in isolation. Through weekend intensives, support groups, and ongoing mentorship, couples and families journey alongside others who understand the unique weight of service and sacrifice.',
    icon: Users,
  },
];

const journey = [
  {
    phase: 'During Application',
    title: 'Families Are Welcomed In',
    description: 'From day one, we want to understand your family situation. Our intake process identifies how we can support the whole household — not just the individual enrollee.',
  },
  {
    phase: 'During Training',
    title: 'Families Stay Connected',
    description: 'Regular family check-ins, spouse support groups, couples intensives, and open communication help families stay engaged and supported throughout the training period.',
  },
  {
    phase: 'At Graduation',
    title: 'Families Celebrate Together',
    description: 'Graduation is a family milestone. We invite families to celebrate the achievement and recognize the sacrifice and support they provided along the way.',
  },
  {
    phase: 'After Graduation',
    title: 'Families Continue Growing',
    description: 'Alumni family resources, ongoing counseling referrals, retreat opportunities, and community events keep families connected and supported well beyond the training program.',
  },
];

const testimonials = [
  {
    quote: 'When my husband enrolled at Project 22, I was nervous. But they made me feel like part of the process from the very beginning. The spouse group saved me.',
    name: 'Military Spouse',
    role: 'Spouse Support Group Member',
  },
  {
    quote: 'My kids finally got to see their dad confident and happy again. Project 22 did not just change his career — they changed our family.',
    name: 'Program Family',
    role: 'Family Wellness Participant',
  },
];

export function FamilyWellness() {
  const navigate = useAppNavigate();

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-marine/20 rounded-2xl mb-8 backdrop-blur-sm border border-brand-marine/30">
              <Heart className="w-10 h-10 text-brand-gold" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Family Wellness
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              When a hero heals, the whole family heals. In partnership with A Place for Family, we tend to the heart of every household — restoring families to the sacred simplicity of living life from the inside out.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Tending to the Heart of the Family
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                If we look at the brokenness found within the human heart, we can trace it back to the place the heart called home. Behind every veteran and first responder is a family that has also sacrificed — spouses who held things together, children who missed birthdays, parents who worried every day.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Through our partnership with <span className="font-semibold text-slate-900">A Place for Family</span>, we bring a restoration-focused, faith-centered approach to family wellness. Their philosophy is simple yet profound: lasting transformation starts from the inside out, addressing the root of brokenness rather than just the symptoms.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Together, we provide couples intensives, family support resources, and scholarship-backed retreats so that no family walks this road alone.
              </p>
              <div className="flex items-center gap-4 bg-rose-50 border border-rose-100 rounded-xl p-5">
                <HandHeart className="w-8 h-8 text-rose-500 flex-shrink-0" />
                <span className="text-slate-700 font-medium">Every family receives a dedicated support coordinator during enrollment</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center">
                <Smile className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-slate-900 mb-1">89%</div>
                <p className="text-sm text-slate-600">Families report improved relationships</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center">
                <Shield className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-slate-900 mb-1">94%</div>
                <p className="text-sm text-slate-600">Feel more financially stable</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-center">
                <Users className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-slate-900 mb-1">200+</div>
                <p className="text-sm text-slate-600">Families supported to date</p>
              </div>
              <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 text-center">
                <Heart className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
                <p className="text-sm text-slate-600">Families welcomed & included</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-2 flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-sm" />
                <img
                  src="/theo-koulianos-photo.jpeg"
                  alt="Theo Koulianos, Founder of A Place for Family"
                  className="relative w-64 h-72 object-cover rounded-2xl shadow-xl border-2 border-white"
                />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-xl font-bold text-slate-900">Theo Koulianos</h3>
                <p className="text-sm text-blue-600 font-semibold tracking-wide mt-1">Founder, A Place for Family</p>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/APFF_logo.jpg"
                  alt="A Place for Family logo"
                  className="w-12 h-12 rounded-lg object-contain border border-slate-200 bg-white p-1"
                />
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Partnership Spotlight</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5">
                Meet Theo Koulianos
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Theo Koulianos is the founder of <span className="font-semibold text-slate-900">A Place for Family</span> — a ministry dedicated to restoring families from the inside out. His heart for healing is rooted in the belief that the brokenness we see in the world can be traced back to the brokenness within the home.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Through his partnership with Project 22, Theo brings couples intensives, faith-centered restoration, and scholarship-backed retreats to veteran and first responder families — ensuring that healing reaches every member of the household.
              </p>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <p className="text-slate-700 italic leading-relaxed">
                  "If we tend to the heart of the family, we tend to the heart of everything. Lasting change does not begin with programs — it begins at home."
                </p>
                <p className="text-sm font-semibold text-slate-500 mt-3">-- Theo Koulianos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Approach to Restoration
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Guided by A Place for Family's philosophy, we believe healing begins at the deepest level — in the heart, in the home, in the family
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {approach.map((item, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-brand-marine/10 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-brand-marine" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Family Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Practical resources and heart-level support designed to strengthen the entire family during and after the training journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} hover className="border border-slate-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-brand-marine/10 rounded-xl flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-brand-marine" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Families Throughout the Journey
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Support is not a one-time event. Families are integrated into every stage of the program.
            </p>
          </div>

          <div className="space-y-6">
            {journey.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 bg-brand-marine text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  {index < journey.length - 1 && (
                    <div className="w-px h-full min-h-[48px] bg-brand-marine/20 mt-2" />
                  )}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 flex-1 pb-8 shadow-sm">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{step.phase}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What Families Are Saying</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-lg">
                <p className="text-lg text-slate-700 leading-relaxed italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Family Matters to Us
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            When you apply to Project 22, you are not just enrolling yourself — you are bringing your whole family into a community that tends to the heart. Reach out today.
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
              Call Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
