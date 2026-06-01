import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { sendNotificationEmail } from '../lib/email';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (error) throw error;

      sendNotificationEmail({
        type: 'contact',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setSubmitError('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-20 bg-brand-scarlet text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We'd love to hear from you. Reach out with any questions or to learn more about how you can help veterans and first responders.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-marine/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-brand-marine" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Visit Us</h3>
                <p className="text-slate-600">
                  425 E. Spruce St.<br />
                  Tarpon Springs, FL 34689
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-marine/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-brand-marine" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
                <a
                  href="mailto:info@project22.org"
                  className="text-brand-marine hover:text-brand-scarlet"
                >
                  info@project22.org
                </a>
              </div>
            </Card>

            <Card hover>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-marine/10 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-brand-marine" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
                <a
                  href="tel:+17272224325"
                  className="text-brand-marine hover:text-brand-scarlet"
                >
                  727.222.4325
                </a>
              </div>
            </Card>
          </div>

          <Card>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 555-5555"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-scarlet focus:border-transparent transition-all duration-200"
                  />
                </div>

                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {submitError}
                  </div>
                )}

                {isSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <p className="text-emerald-800 font-semibold text-lg mb-1">Message Sent</p>
                    <p className="text-emerald-600 text-sm">Thank you for reaching out. We will get back to you soon.</p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 text-sm text-brand-marine hover:text-brand-scarlet underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                )}
              </form>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
