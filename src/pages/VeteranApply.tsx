import { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  GraduationCap,
  Briefcase,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Loader2,
  Heart,
  Award,
  Globe,
  Search,
  BadgeCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FileUpload } from '../components/FileUpload';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { sendNotificationEmail } from '../lib/email';
import { useAppNavigate } from '../hooks/useAppNavigate';

type ProgramRow = Database['public']['Tables']['programs']['Row'];

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, Award, Search, BadgeCheck, GraduationCap, Briefcase, Heart, Globe,
};

const SERVICE_BACKGROUNDS = [
  'Army',
  'Navy',
  'Air Force',
  'Marines',
  'Coast Guard',
  'Space Force',
  'Law Enforcement',
  'Fire Department',
  'EMS/EMT',
  'Dispatch',
  'Corrections',
] as const;

const TIMELINES = [
  'Immediately / Within 30 days',
  '1 - 3 months',
  '3 - 6 months',
  '6+ months',
  'Not sure yet',
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  serviceBackground: string;
  programs: string[];
  timeline: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  serviceBackground?: string;
  programs?: string;
  timeline?: string;
  photo?: string;
  video?: string;
}

export function VeteranApply() {
  const navigate = useAppNavigate();
  const [availablePrograms, setAvailablePrograms] = useState<ProgramRow[]>([]);
  const [form, setForm] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    serviceBackground: '',
    programs: [],
    timeline: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [video, setVideo] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    async function fetchPrograms() {
      const { data } = await supabase
        .from('programs')
        .select('*')
        .eq('is_active', true)
        .eq('is_coming_soon', false)
        .order('sort_order', { ascending: true });
      if (data) setAvailablePrograms(data);
    }
    fetchPrograms();
  }, []);

  const handlePhotoSelect = useCallback((file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Photo must be under 10MB' }));
      return;
    }
    setPhoto(file);
    setErrors((prev) => ({ ...prev, photo: undefined }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview('');
    }
  }, []);

  const handleVideoSelect = useCallback((file: File | null) => {
    if (file && file.size > 100 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, video: 'Video must be under 100MB' }));
      return;
    }
    setVideo(file);
    setErrors((prev) => ({ ...prev, video: undefined }));
  }, []);

  const toggleProgram = useCallback((programId: string) => {
    setForm((prev) => ({
      ...prev,
      programs: prev.programs.includes(programId)
        ? prev.programs.filter((p) => p !== programId)
        : [...prev.programs, programId],
    }));
    setErrors((prev) => ({ ...prev, programs: undefined }));
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!form.serviceBackground) newErrors.serviceBackground = 'Please select your service background';
    if (form.programs.length === 0) newErrors.programs = 'Please select at least one program';
    if (!form.timeline) newErrors.timeline = 'Please select a timeline';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFile = async (
    file: File,
    folder: string
  ): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage
      .from('veteran-uploads')
      .upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage
      .from('veteran-uploads')
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let photoUrl = '';
      let videoUrl = '';

      if (photo) {
        setUploadProgress('Uploading photo...');
        photoUrl = await uploadFile(photo, 'photos');
      }

      if (video) {
        setUploadProgress('Uploading video...');
        videoUrl = await uploadFile(video, 'videos');
      }

      setUploadProgress('Submitting application...');

      const { error } = await supabase.from('veteran_applications').insert({
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        state: form.state,
        military_branch: form.serviceBackground,
        photo_url: photoUrl,
        video_url: videoUrl,
        programs_interested: form.programs,
        desired_start_timeline: form.timeline,
      });

      if (error) throw error;

      try {
        await sendNotificationEmail({
          type: 'application',
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          serviceBackground: form.serviceBackground,
          programs: form.programs,
          timeline: form.timeline,
        });
      } catch {
        // Application saved successfully; email notification is non-critical
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({
        fullName:
          'Something went wrong submitting your application. Please try again or contact us directly.',
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <section className="relative bg-gradient-to-br from-brand-marine via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-14 h-14 text-emerald-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Application Received
            </h1>
            <p className="text-xl text-slate-200 mb-4 leading-relaxed">
              Thank you for taking this step. Our team will review your application and reach out to you within 48 hours to discuss your scholarship and next steps.
            </p>
            <p className="text-blue-300 mb-10">
              Keep an eye on your email for updates from Project 22.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('home')}
                className="bg-white hover:bg-slate-50 text-brand-marine"
              >
                Back to Home
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('programs')}
                className="bg-brand-scarlet hover:bg-brand-scarlet/90 border border-brand-scarlet"
              >
                Explore Programs
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-white/80 font-semibold text-lg mb-4 tracking-wide uppercase">
              Scholarship Application
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your New Career Starts Here
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed mb-8">
              Apply for a scholarship that covers your full training and job placement. No cost to you — just commitment, courage, and the willingness to take the next step.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <GraduationCap className="w-8 h-8 text-white/90 mx-auto mb-3" />
                <p className="font-semibold text-sm">Full Education</p>
                <p className="text-xs text-slate-300 mt-1">
                  Tuition, materials, and certifications covered
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <Briefcase className="w-8 h-8 text-white/90 mx-auto mb-3" />
                <p className="font-semibold text-sm">Job Placement</p>
                <p className="text-xs text-slate-300 mt-1">
                  Direct career placement after graduation
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <Heart className="w-8 h-8 text-white/90 mx-auto mb-3" />
                <p className="font-semibold text-sm">Holistic Support</p>
                <p className="text-xs text-slate-300 mt-1">
                  Counseling, housing, and family resources
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-marine/20 flex items-center justify-center">
                  <span className="text-brand-marine font-bold text-sm">1</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Personal Information
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Input
                    label="Full Name"
                    placeholder="First and last name"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    error={errors.fullName}
                  />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  error={errors.email}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 555-1234"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  error={errors.phone}
                />
                <Input
                  label="City"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, city: e.target.value }))
                  }
                  error={errors.city}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State
                  </label>
                  <div className="relative">
                    <select
                      value={form.state}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, state: e.target.value }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-brand-marine focus:border-transparent transition-all duration-200 ${
                        errors.state ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-marine/20 flex items-center justify-center">
                  <span className="text-brand-marine font-bold text-sm">2</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Service Background
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Background
                  </label>
                  <div className="relative">
                    <select
                      value={form.serviceBackground}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          serviceBackground: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-brand-marine focus:border-transparent transition-all duration-200 ${
                        errors.serviceBackground
                          ? 'border-red-500'
                          : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select your background</option>
                      <optgroup label="Military">
                        {SERVICE_BACKGROUNDS.filter(b => ['Army','Navy','Air Force','Marines','Coast Guard','Space Force'].includes(b)).map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="First Responder">
                        {SERVICE_BACKGROUNDS.filter(b => ['Law Enforcement','Fire Department','EMS/EMT','Dispatch','Corrections'].includes(b)).map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                  {errors.serviceBackground && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.serviceBackground}
                    </p>
                  )}
                </div>

                <FileUpload
                  accept="image/*"
                  label="Service Photo"
                  hint="Upload a photo from your time in service (JPG, PNG)"
                  icon="photo"
                  maxSizeMB={10}
                  file={photo}
                  preview={photoPreview}
                  onFileSelect={handlePhotoSelect}
                  error={errors.photo}
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-marine/20 flex items-center justify-center">
                  <span className="text-brand-marine font-bold text-sm">3</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Program Interest
                </h2>
              </div>
              <p className="text-slate-600 mb-5">
                Select all programs you are interested in. Your scholarship can cover any of these tracks.
              </p>

              <div className="space-y-3">
                {availablePrograms.map((program) => {
                  const isSelected = form.programs.includes(program.slug);
                  const IconComponent = ICON_MAP[program.icon_name] || Shield;
                  return (
                    <button
                      key={program.slug}
                      type="button"
                      onClick={() => toggleProgram(program.slug)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                        isSelected
                          ? 'border-brand-marine bg-brand-marine/5 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          isSelected
                            ? 'bg-brand-marine border-brand-marine'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <IconComponent
                          className={`w-5 h-5 flex-shrink-0 ${
                            isSelected ? 'text-brand-marine' : 'text-slate-400'
                          }`}
                        />
                        <div>
                          <p
                            className={`font-semibold ${
                              isSelected ? 'text-brand-marine' : 'text-slate-900'
                            }`}
                          >
                            {program.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {program.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.programs && (
                <p className="mt-2 text-sm text-red-600">{errors.programs}</p>
              )}
            </div>

            <div className="border-t border-slate-200 pt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-marine/20 flex items-center justify-center">
                  <span className="text-brand-marine font-bold text-sm">4</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Timeline</h2>
              </div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                How soon would you like to start your training?
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {TIMELINES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, timeline: option }));
                      setErrors((prev) => ({ ...prev, timeline: undefined }));
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      form.timeline === option
                        ? 'border-brand-marine bg-brand-marine/5 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          form.timeline === option
                            ? 'border-brand-marine'
                            : 'border-slate-300'
                        }`}
                      >
                        {form.timeline === option && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-marine" />
                        )}
                      </div>
                      <span
                        className={`font-medium text-sm ${
                          form.timeline === option
                            ? 'text-brand-marine'
                            : 'text-slate-700'
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.timeline && (
                <p className="mt-2 text-sm text-red-600">{errors.timeline}</p>
              )}
            </div>

            <div className="border-t border-slate-200 pt-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-marine/20 flex items-center justify-center">
                  <span className="text-brand-marine font-bold text-sm">5</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Sponsorship Video
                </h2>
                <span className="text-sm text-slate-400 font-normal ml-1">
                  (Optional)
                </span>
              </div>
              <div className="bg-brand-marine/5 border border-brand-marine/20 rounded-xl p-5 mb-5">
                <p className="text-slate-700 text-sm leading-relaxed">
                  A short personal video greatly increases your chances of receiving sponsorship. Tell potential sponsors who you are, what your service experience means to you, and what this scholarship would change in your life. Even 60 seconds can make a powerful impression.
                </p>
              </div>
              <FileUpload
                accept="video/*"
                label="Upload Your Video"
                hint="MP4, MOV, or WebM — 1-2 minutes recommended"
                icon="video"
                maxSizeMB={100}
                file={video}
                onFileSelect={handleVideoSelect}
                error={errors.video}
              />
            </div>

            <div className="border-t border-slate-200 pt-10">
              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    Our team reviews your application within 48 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    We connect you with a sponsor who covers your training
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    You enroll in your program with education and job placement included
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    Graduate with certifications and step into a new career
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                className="bg-brand-scarlet hover:bg-brand-scarlet/90 flex items-center justify-center gap-2 text-lg py-5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploadProgress || 'Submitting...'}
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-slate-400 mt-4">
                By submitting, you agree to our{' '}
                <button
                  type="button"
                  onClick={() => navigate('privacy')}
                  className="underline hover:text-slate-600"
                >
                  Privacy Policy
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => navigate('terms')}
                  className="underline hover:text-slate-600"
                >
                  Terms of Service
                </button>
                .
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
