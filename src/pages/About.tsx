import { Target, Eye, Heart, Users, Shield, Compass } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppNavigate } from '../hooks/useAppNavigate';

export function About() {
  const navigate = useAppNavigate();
  const values = [
    {
      icon: Heart,
      title: 'Love & Support',
      description: 'Every veteran and first responder deserves to feel loved, celebrated, and supported in their journey home',
    },
    {
      icon: Shield,
      title: 'Holistic Care',
      description: 'Addressing spirit, soul, and body to provide complete wellness and restoration',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building trusted relationships and a strong network of support for lasting impact',
    },
    {
      icon: Compass,
      title: 'Clear Pathways',
      description: 'Providing direct routes to education, meaningful work, and family wellness',
    },
  ];

  const approach = [
    {
      title: 'Remove Barriers',
      description: 'We identify and eliminate obstacles preventing veterans and first responders from accessing the care and opportunities they deserve',
    },
    {
      title: 'Practical Support',
      description: 'From training costs to career placement, we provide tangible resources that create real change',
    },
    {
      title: 'Trusted Relationships',
      description: 'Building lasting connections that extend beyond training to lifelong support and mentorship',
    },
    {
      title: 'Career Excellence',
      description: 'Partnering with industry leaders like ESS Academy to deliver world-class training programs',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-marine text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              About Project 22
            </h1>
            <p className="text-xl md:text-2xl text-slate-200">
              Dedicated to restoring hope, belonging, and strength for veterans and first responders through comprehensive support and career opportunities
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Who We Are
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Project 22 is a non-profit organization dedicated to supporting veterans and first responders through career training and placement programs. We believe that every person who served our nation and communities deserves access to opportunities that restore hope, build meaningful careers, and strengthen families.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Through partnerships with industry-leading training venues like ESS Academy, KSA, and Fourth Watch, we provide comprehensive programs in security guard services, executive protection, private investigation, medical training, and overseas contracting. Our holistic approach addresses not just career needs, but the complete wellness of our heroes and their families.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                With over 8 years of experience and more than 1,250 lives impacted, we've built a proven track record of transforming lives through education, career support, and lasting relationships.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-marine rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Our Purpose</h3>
                    <p className="text-slate-600">
                      Restore hope, belonging, and strength for veterans and first responders by removing barriers to care and providing practical support, trusted relationships, and clear pathways home
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-scarlet rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h3>
                    <p className="text-slate-600">
                      Save lives through holistic support addressing spirit, soul, and body with direct pathways to education, meaningful work, and family wellness
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Our Vision</h3>
                    <p className="text-slate-600">
                      A nation where every veteran and first responder knows they are loved, celebrated, supported, equipped, and encouraged
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} hover>
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-marine/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-brand-marine" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Approach
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              How we create lasting impact in the lives of those who serve
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {approach.map((item, index) => (
              <Card key={index}>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Together, we can ensure every veteran and first responder has access to the support, training, and opportunities they deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('help')}
              className="text-lg bg-white hover:bg-slate-50 text-brand-scarlet"
            >
              <Heart className="w-5 h-5 mr-2" />
              Support Our Mission
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('partnership')}
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-brand-scarlet"
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
