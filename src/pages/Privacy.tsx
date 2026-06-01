import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Privacy() {
  const lastUpdated = 'January 11, 2026';

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your privacy and security are our top priorities
          </p>
          <p className="text-sm text-blue-200 mt-4">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900">Secure</h3>
                <p className="text-sm text-slate-600 mt-1">Data encrypted and protected</p>
              </div>
            </Card>

            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900">Transparent</h3>
                <p className="text-sm text-slate-600 mt-1">Clear data practices</p>
              </div>
            </Card>

            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900">Compliant</h3>
                <p className="text-sm text-slate-600 mt-1">Following all regulations</p>
              </div>
            </Card>
          </div>

          <div className="prose prose-slate max-w-none">
            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
              <p className="text-slate-600 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                <li>Name, email address, and contact information</li>
                <li>Donation and payment information</li>
                <li>Application and eligibility information</li>
                <li>Communications you send to us</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">2. How We Use Your Information</h2>
              <p className="text-slate-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                <li>Process donations and provide receipts</li>
                <li>Communicate about our programs and services</li>
                <li>Process applications and provide support</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">3. Information Sharing</h2>
              <p className="text-slate-600 mb-6">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                <li>With service providers who assist in our operations</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">4. Data Security</h2>
              <p className="text-slate-600 mb-6">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">5. Your Rights</h2>
              <p className="text-slate-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">6. Cookies and Tracking</h2>
              <p className="text-slate-600 mb-6">
                We use cookies and similar tracking technologies to improve your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">7. Children's Privacy</h2>
              <p className="text-slate-600 mb-6">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">8. Changes to This Policy</h2>
              <p className="text-slate-600 mb-6">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">9. Contact Us</h2>
              <p className="text-slate-600 mb-2">
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg mt-4">
                <p className="text-slate-700">
                  <strong>Project 22</strong><br />
                  425 E. Spruce St.<br />
                  Tarpon Springs, FL 34689<br />
                  Email: <a href="mailto:info@project22.org" className="text-blue-600 hover:text-blue-700">info@project22.org</a><br />
                  Phone: <a href="tel:+17272224325" className="text-blue-600 hover:text-blue-700">727.222.4325</a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
