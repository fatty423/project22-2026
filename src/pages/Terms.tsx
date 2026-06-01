import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAppNavigate } from '../hooks/useAppNavigate';

export function Terms() {
  const navigate = useAppNavigate();
  const lastUpdated = 'January 11, 2026';

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-blue-200 mt-4">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Fair Use</h3>
                  <p className="text-sm text-slate-600">Use our services responsibly and ethically</p>
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Important</h3>
                  <p className="text-sm text-slate-600">Review all terms before proceeding</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="prose prose-slate max-w-none">
            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 mb-6">
                By accessing and using the Project 22 website and services, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">2. Description of Services</h2>
              <p className="text-slate-600 mb-4">
                Project 22 provides:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                <li>Career training and placement programs for veterans and first responders</li>
                <li>Donation processing and management</li>
                <li>Information about support services for veterans and first responders</li>
                <li>Online portal for donors and program participants</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">3. User Responsibilities</h2>
              <p className="text-slate-600 mb-4">
                As a user of our services, you agree to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the services in compliance with all applicable laws</li>
                <li>Not misuse or attempt to harm our systems</li>
                <li>Respect the intellectual property rights of Project 22</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">4. Donations</h2>
              <p className="text-slate-600 mb-4">
                All donations are:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                <li>Final and non-refundable except as required by law</li>
                <li>Tax-deductible to the extent allowed by law</li>
                <li>Used to support Project 22's mission and programs</li>
                <li>Processed securely through our payment partners</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">5. Intellectual Property</h2>
              <p className="text-slate-600 mb-6">
                All content on this website, including text, graphics, logos, images, and software, is the property of Project 22 or its content suppliers and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">6. Privacy</h2>
              <p className="text-slate-600 mb-6">
                Your use of our services is also governed by our Privacy Policy. Please review our{' '}
                <button
                  onClick={() => navigate('privacy')}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Privacy Policy
                </button>{' '}
                to understand our practices.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">7. Limitation of Liability</h2>
              <p className="text-slate-600 mb-6">
                To the fullest extent permitted by law, Project 22 shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services. Our total liability shall not exceed the amount you paid to us in the past twelve months.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">8. Disclaimer of Warranties</h2>
              <p className="text-slate-600 mb-6">
                Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, secure, or error-free.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">9. Termination</h2>
              <p className="text-slate-600 mb-6">
                We reserve the right to terminate or suspend your access to our services at any time, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">10. Changes to Terms</h2>
              <p className="text-slate-600 mb-6">
                We may modify these Terms of Service at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">11. Governing Law</h2>
              <p className="text-slate-600 mb-6">
                These Terms of Service are governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">12. Contact Information</h2>
              <p className="text-slate-600 mb-2">
                If you have questions about these Terms of Service, please contact us:
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
