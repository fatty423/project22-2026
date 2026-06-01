import { Eye, Keyboard, Volume2, Smartphone, Monitor, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppNavigate } from '../hooks/useAppNavigate';

export function Accessibility() {
  const navigate = useAppNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Eye className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Accessibility Statement</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We are committed to ensuring digital accessibility for everyone
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12">
            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment</h2>
              <p className="text-slate-600 mb-4">
                Project 22 is committed to ensuring that our website is accessible to all users, including those with disabilities. We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards to provide an inclusive experience for everyone.
              </p>
              <p className="text-slate-600">
                We believe that everyone, regardless of ability, should have equal access to information about our support programs and services for veterans and first responders.
              </p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Keyboard className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Keyboard Navigation</h3>
                <p className="text-slate-600">
                  Full keyboard navigation support for users who cannot use a mouse
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Screen Reader Compatible</h3>
                <p className="text-slate-600">
                  Optimized for screen readers with proper ARIA labels and semantic HTML
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Monitor className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">High Contrast</h3>
                <p className="text-slate-600">
                  Sufficient color contrast ratios for improved readability
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Responsive Design</h3>
                <p className="text-slate-600">
                  Fully responsive across all devices and screen sizes
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Volume2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Alt Text</h3>
                <p className="text-slate-600">
                  Descriptive alternative text for all images and media
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Clear Language</h3>
                <p className="text-slate-600">
                  Simple, clear language and logical content structure
                </p>
              </div>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Accessibility Features</h2>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Keyboard Navigation:</strong> Navigate our entire site using only your keyboard with Tab, Enter, and arrow keys</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Screen Reader Support:</strong> Semantic HTML structure and ARIA labels for assistive technologies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Color Contrast:</strong> WCAG AA compliant color contrast ratios throughout the site</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Resizable Text:</strong> Text can be resized up to 200% without loss of functionality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Focus Indicators:</strong> Clear visual indicators when navigating with keyboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Skip Links:</strong> Skip navigation links to jump to main content</span>
                </li>
              </ul>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Ongoing Efforts</h2>
              <p className="text-slate-600 mb-4">
                We continuously work to improve the accessibility of our website. Our ongoing efforts include:
              </p>
              <ul className="space-y-2 text-slate-600 mb-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Regular accessibility audits and testing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>User testing with individuals who use assistive technologies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Staff training on accessibility best practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Continuous updates to meet evolving accessibility standards</span>
                </li>
              </ul>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Feedback and Assistance</h2>
              <p className="text-slate-600 mb-4">
                We welcome feedback on the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
              </p>
              <div className="bg-slate-50 p-6 rounded-lg mb-6">
                <p className="text-slate-700 mb-4">
                  <strong>Project 22 Accessibility Team</strong><br />
                  425 E. Spruce St.<br />
                  Tarpon Springs, FL 34689<br />
                  Email: <a href="mailto:info@project22.org" className="text-blue-600 hover:text-blue-700">info@project22.org</a><br />
                  Phone: <a href="tel:+17272224325" className="text-blue-600 hover:text-blue-700">727.222.4325</a>
                </p>
                <p className="text-sm text-slate-600">
                  We aim to respond to accessibility feedback within 3 business days.
                </p>
              </div>
              <Button
                onClick={() => navigate('contact')}
                className="w-full md:w-auto"
              >
                Contact Us About Accessibility
              </Button>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Technical Specifications</h2>
              <p className="text-slate-600 mb-4">
                Our website's accessibility relies on the following technologies:
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>HTML5 for semantic structure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>WAI-ARIA for enhanced accessibility</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>CSS for visual presentation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>JavaScript for enhanced functionality (with graceful degradation)</span>
                </li>
              </ul>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitations and Alternatives</h2>
              <p className="text-slate-600 mb-4">
                Despite our efforts, some content on our website may not yet be fully accessible. We are actively working to address these issues. Known limitations include:
              </p>
              <ul className="space-y-2 text-slate-600 mb-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Some third-party embedded content may have accessibility limitations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Legacy documents may not meet current accessibility standards</span>
                </li>
              </ul>
              <p className="text-slate-600">
                If you need information in an alternative format, please contact us and we will work with you to provide the information in a format that meets your needs.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
