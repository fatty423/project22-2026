import { Heart, Star, Shield, Award, Phone, ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppNavigate } from '../hooks/useAppNavigate';

export function DocSclaterMemorial() {
  const navigate = useAppNavigate();

  const credentials = [
    '11.5 Years U.S. Navy FMF Hospital Corpsman',
    'Multiple OIF/OEF Combat Deployments',
    'USMC Scout Sniper Basic Course Graduate',
    'TASA & Executive Protection Specialist',
    'Former Team USA Paralympic Swimmer (9 American Records)',
    'ESS Academy Senior Field Agent & Instructor',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-brand-marine text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0">
          <img
            src="/Jamie_Gardenofthegods2.jpg"
            alt="Jamie 'Doc' Sclater at Garden of the Gods"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-44 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-gold/20 backdrop-blur-sm border border-brand-gold/40 rounded-brand px-5 py-2 mb-8">
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
            <span className="text-sm font-semibold text-brand-gold uppercase tracking-wider">In Memoriam</span>
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-wide mb-4">
            Jamie "Doc" Sclater
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            U.S. Navy FMF Hospital Corpsman &bull; USMC Scout Sniper &bull; ESS Academy Senior Instructor &bull; Fallen Hero
          </p>
        </div>
      </section>

      {/* The Man Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-1 h-8 bg-brand-gold rounded-full" />
                <h2 className="text-sm font-semibold text-brand-gold uppercase tracking-wider">The Man Behind the Name</h2>
              </div>
              <h3 className="text-3xl md:text-4xl font-display text-slate-900 mb-6">
                A Warrior, Healer, and Teacher
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                In the Navy, Hospital Corpsmen who serve alongside Marines earn a title that no certificate can grant -- they are called "Doc." It is a name given by the warriors they keep alive, a title of trust forged under fire. Jamie earned that name across multiple combat deployments in Iraq and Afghanistan as an FMF Hospital Corpsman over 11.5 years of dedicated service.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Beyond the battlefield, Jamie was a world-class athlete. As a member of Team USA's Paralympic swim team, he set 9 American records -- proving that his competitive fire and discipline extended far beyond the military. He brought that same relentless standard to everything he did.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                To those who knew him, Doc was the man who showed up. He was the instructor who stayed late, the teammate who called when things got quiet, the friend who checked in when no one else thought to. He carried others -- it was simply who he was.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-brand overflow-hidden shadow-2xl">
                <img
                  src="/Jamie_HTSO_BIGRED.jpeg"
                  alt="Jamie 'Doc' Sclater portrait"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-brand-gold text-white rounded-brand p-4 shadow-lg">
                <Award className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentials.map((cred, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-brand p-4 border border-slate-200">
                <Shield className="w-5 h-5 text-brand-marine flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">{cred}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* His Mission After Service */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-brand-scarlet rounded-full" />
              <h2 className="text-sm font-semibold text-brand-scarlet uppercase tracking-wider">His Mission After Service</h2>
            </div>
            <h3 className="text-3xl md:text-4xl font-display text-slate-900 mb-6">
              Training the Next Generation
            </h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                After his military service, Jamie brought his expertise to ESS Academy as Senior Field Agent and Instructor. Specializing in Tactical Medicine and Executive Protection, he became one of the most respected instructors in the program -- the kind of teacher who demanded excellence because he lived it.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Doc's military medical training and tactical expertise made him uniquely qualified to train students in the realities of high-threat security operations. He didn't teach from a textbook. He taught from lived experience -- from combat deployments, from protecting lives under pressure, from years of operating where the stakes were life and death.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Through ESS Academy, Jamie helped dozens of veterans and first responders find new purpose after service. He showed them that the skills forged in uniform could become a powerful career -- and a reason to keep moving forward.
              </p>
            </div>
            <div className="space-y-6">
              <Card>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-marine/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-brand-marine" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Senior Field Agent & Instructor</h4>
                    <p className="text-slate-600 text-sm">ESS Academy -- Tactical Medicine & Executive Protection</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-scarlet/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-brand-scarlet" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Trained Dozens of Veterans</h4>
                    <p className="text-slate-600 text-sm">Guided service members into new careers in executive protection and security</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Combat-Proven Expertise</h4>
                    <p className="text-slate-600 text-sm">Real-world experience spanning multiple deployments and high-pressure environments</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* The Hard Truth */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-display mb-6">
              The Hard Truth
            </h3>
            <div className="w-16 h-0.5 bg-brand-gold mx-auto mb-8" />
          </div>
          <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
            <p>
              Jamie died by suicide. We do not soften that truth -- because softening it is part of what kills. The number "22" in our name represents the more than 22 veterans and first responders who take their own lives every single day in this country. Doc became one of them.
            </p>
            <p>
              He spent his life standing for others. On the battlefield, he kept Marines alive. In the classroom, he gave veterans a reason to build something new. And yet, the invisible war that so many carry home -- the one nobody sees, the one that doesn't show up on a scan or earn a medal -- that war took him from us.
            </p>
            <p className="text-white font-medium">
              Now we stand for him. And for every warrior still fighting a battle no one can see.
            </p>
          </div>

          {/* Prayer Hotline Callout */}
          <div className="mt-12 bg-brand-scarlet/10 border border-brand-scarlet/30 rounded-brand p-8 text-center">
            <Phone className="w-8 h-8 text-brand-scarlet mx-auto mb-4" />
            <p className="text-white font-bold text-xl mb-2">
              Need someone to pray with you?
            </p>
            <p className="text-slate-300 mb-4">
              The JoyFM Prayer Center -- Someone is ready to listen and pray, anytime.
            </p>
            <a
              href="tel:8778007729"
              className="inline-flex items-center gap-2 bg-brand-scarlet text-white font-bold text-2xl px-8 py-4 rounded-brand hover:bg-brand-dark-red transition-colors"
            >
              877.800.7729
            </a>
            <p className="text-sm text-slate-400 mt-4">
              Or visit{' '}
              <a
                href="https://www.thejoyfm.com/prayer/prayer-center/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gold hover:text-brand-gold/80 underline"
              >
                thejoyfm.com/prayer
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Continue His Legacy CTA */}
      <section className="py-20 bg-brand-marine text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Star className="w-12 h-12 text-brand-gold mx-auto mb-6 fill-brand-gold" />
          <h2 className="text-3xl md:text-5xl font-display mb-6">
            Continue Doc's Legacy
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            The "Doc" Sclater Scholarship provides full tuition for veterans entering the All-in-One Executive Protection program at ESS Academy -- the same world-class training Doc delivered and believed every veteran deserved access to.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('doc-sclater-scholarship')}
              className="text-lg bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
            >
              <Heart className="w-5 h-5 mr-2" />
              Scholarship Details
            </Button>
            <Link
              to="/doc-sclater-scholarship#donate"
              className="inline-flex items-center justify-center h-12 px-6 text-lg font-semibold rounded-brand border-2 border-white text-white hover:bg-white hover:text-brand-marine transition-colors"
            >
              Donate to the Fund
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
