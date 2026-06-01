import { GraduationCap, Award, Users, Star, CheckCircle, ArrowRight, Briefcase, Target, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppNavigate } from '../hooks/useAppNavigate';

const instructors = [
  {
    name: 'Theo Billiris',
    title: 'Founder & Lead Instructor',
    organization: 'ESS Academy',
    photo: '/theobilliris.jpg',
    specialty: 'Executive Protection & Tactical Operations',
    experience: '15+ Years',
    credentials: [
      'University of Florida Graduate',
      'EP Details in 30+ Countries',
      'ASI EP Training Program Graduate',
      'Active Shooter/Killer Threat Instructor (CQC Inc.)',
      'Certified Krav Maga Instructor',
      'FL Class D, DI, G, W Licenses',
      'NRA Basic Pistol / ASP / Taser / MACE Certified',
    ],
    bio: 'Founded ESS Academy to bridge the gap between classroom theory and real-world security operations. With executive protection experience spanning more than 30 countries, Theo brings an unmatched global perspective to every lesson he teaches.',
  },
  {
    name: 'Jamie "Doc" Sclater',
    title: 'Senior Field Agent & Instructor',
    organization: 'ESS Academy',
    photo: '/Jamie-Sclater.jpg',
    specialty: 'Tactical Medicine & Executive Protection',
    experience: '15+ Years',
    memorial: true,
    credentials: [
      '11.5 Years U.S. Navy FMF Hospital Corpsman',
      'Multiple OIF/OEF Combat Deployments',
      'USMC Scout Sniper Basic Course Graduate',
      'TASA & Executive Protection Specialist',
      'Former Team USA Paralympic Swimmer (9 American Records)',
      'FL Class D & G Licenses',
    ],
    bio: 'A decorated Navy combat veteran and former Team USA Paralympic athlete, Jamie combined elite military medical training with tactical expertise. His legacy lives on through the Doc Sclater Scholarship and the countless students he trained.',
  },
  {
    name: 'Tim Ratcliffe',
    title: 'Founder',
    organization: 'Fourth Watch',
    photo: '/Tim.png',
    specialty: 'Emergency Medicine & Defensive Tactics',
    experience: '15+ Years',
    credentials: [
      'Certified EMT-B & Paramedic',
      'Firefighter & Medical First Responder',
      'CPR/BLS & Trauma Instructor',
      '150-Hour EP Program Graduate (KCM)',
      'Active Shooter Response Instructor (FLETC & CQC Inc.)',
      'Black Belt in Krav Maga (KMMA USA)',
      'FL Class D & G Licenses',
      'Defensive Tactics Instructor',
    ],
    bio: 'As the founder of Fourth Watch, Tim built his career on the frontlines of emergency medicine and first response. His extensive certifications in both medical care and defensive tactics make him uniquely qualified to train students in the full spectrum of protective services.',
  },
  {
    name: 'Nathan Strong',
    title: 'Founder',
    organization: 'KSA',
    photo: '/Nathan-Strong.png',
    specialty: 'Investigations & Firearms Training',
    experience: '10+ Years',
    credentials: [
      'Criminal Justice Degree',
      'U.S. Marines Veteran (2 Combat Deployments)',
      'Certified EMT-B',
      'ESS Academy 300-Hour EP Graduate',
      'Licensed Private Investigator',
      'Certified Firearms Instructor',
      'FL DI License Holder',
    ],
    bio: 'A Marine combat veteran with a criminal justice background, Nathan brings disciplined methodology and investigative expertise to his instruction. His diverse certifications across medical, firearms, and protective services give students a well-rounded education.',
  },
];

const methodology = [
  {
    icon: Target,
    title: 'Scenario-Based Learning',
    description: 'Every concept is reinforced through realistic scenarios that mirror actual job conditions. Students practice decision-making under pressure.',
  },
  {
    icon: Users,
    title: 'Mentorship Model',
    description: 'Instructors serve as mentors, not just teachers. They invest personally in each student\'s growth and career trajectory beyond graduation.',
  },
  {
    icon: BookOpen,
    title: 'Current Curriculum',
    description: 'Course material is continuously updated to reflect the latest industry standards, legal requirements, and emerging security technologies.',
  },
  {
    icon: Briefcase,
    title: 'Industry Connections',
    description: 'Instructors leverage their professional networks to create direct pathways to employment for graduates across multiple security sectors.',
  },
];

const stats = [
  { value: '55+', label: 'Years Combined Experience' },
  { value: '2,240+', label: 'Students Trained' },
  { value: '5.0', label: 'Average Instructor Rating' },
  { value: '12:1', label: 'Student-to-Instructor Ratio' },
];

const orgColors: Record<string, { bg: string; text: string; border: string }> = {
  'ESS Academy': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Fourth Watch': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'KSA': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export function ExpertInstructors() {
  const navigate = useAppNavigate();

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-marine/20 rounded-2xl mb-8 backdrop-blur-sm border border-brand-marine/30">
              <GraduationCap className="w-10 h-10 text-brand-gold" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Expert Instructors
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              Learn from seasoned professionals who have lived the career paths they teach -- bringing decades of real-world experience into every lesson
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-brand-marine mb-2">{stat.value}</div>
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
              Meet Your Instructors
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our team combines military, law enforcement, and private sector expertise to deliver unmatched instruction
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {instructors.map((instructor, index) => {
              const colors = orgColors[instructor.organization] || orgColors['ESS Academy'];
              return (
                <Card key={index} className="border border-slate-200 h-full overflow-hidden group">
                  <div className="flex flex-col h-full">
                    <div className="relative w-full aspect-[3/4] -mt-6 -mx-6 mb-5 overflow-hidden" style={{ width: 'calc(100% + 3rem)' }}>
                      <img
                        src={instructor.photo}
                        alt={instructor.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
                          {instructor.organization}
                        </span>
                        {instructor.memorial && (
                          <Link
                            to="/doc-sclater"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/90 text-slate-900 border border-brand-gold hover:bg-brand-gold transition-colors"
                          >
                            <Star className="w-3 h-3 fill-current" />
                            In Memoriam
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-slate-900">
                        {instructor.memorial ? (
                          <Link to="/doc-sclater" className="hover:text-brand-scarlet transition-colors">
                            {instructor.name}
                          </Link>
                        ) : (
                          instructor.name
                        )}
                      </h3>
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{instructor.title}</p>
                    <p className="text-blue-600 font-semibold text-sm mb-1">{instructor.specialty}</p>
                    <div className="flex items-center gap-1 mb-4">
                      <Award className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">{instructor.experience}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm mb-6">{instructor.bio}</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
                      {instructor.credentials.map((credential, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{credential}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Teaching Philosophy
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We believe the best training comes from those who have been there and combines rigorous academics with real-world application
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {methodology.map((method, index) => (
              <div key={index} className="flex gap-5 bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <div className="w-14 h-14 bg-brand-marine/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <method.icon className="w-7 h-7 text-brand-marine" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-xl text-slate-700 leading-relaxed italic mb-6">
              "The instructors at Project 22 are not just teachers -- they are mentors who genuinely care about your success. Their real-world experience made every lesson relevant and every scenario feel authentic. I walked out of training ready to work, not just with a piece of paper."
            </p>
            <div className="pt-4 border-t border-slate-100">
              <p className="font-bold text-slate-900">Program Graduate</p>
              <p className="text-sm text-slate-500">Security Operations Professional</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Learn From the Best
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Our instructors are ready to guide you toward a successful career. Apply today and start training with professionals who understand your journey.
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
