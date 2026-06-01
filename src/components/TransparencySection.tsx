import { Eye, ShieldCheck } from 'lucide-react';
import { AllocationChart } from './AllocationChart';

interface TransparencySectionProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
}

export function TransparencySection({ variant = 'light', compact = false }: TransparencySectionProps) {
  const isLight = variant === 'light';

  return (
    <section className={`py-16 lg:py-20 ${isLight ? 'bg-slate-50' : 'bg-slate-900'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {!compact && (
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-sm font-medium ${
              isLight
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-emerald-900/30 text-emerald-300 border border-emerald-800'
            }`}>
              <Eye className="w-4 h-4" />
              Financial Transparency
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Where Your Donations Go
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Our goal is to allocate 90% of every donation directly to programs that serve veterans and first responders. Here is how your contribution is put to work.
            </p>
          </div>
        )}

        <div className={`rounded-2xl p-8 lg:p-10 ${
          isLight
            ? 'bg-white border border-slate-200 shadow-lg'
            : 'bg-slate-800 border border-slate-700'
        }`}>
          {compact && (
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-emerald-100' : 'bg-emerald-900/40'
              }`}>
                <Eye className={`w-5 h-5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
              </div>
              <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Where Your Donations Go
              </h3>
            </div>
          )}

          <AllocationChart compact={compact} />

          <div className={`mt-8 pt-6 border-t flex items-start gap-3 ${
            isLight ? 'border-slate-200' : 'border-slate-600'
          }`}>
            <ShieldCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              isLight ? 'text-emerald-600' : 'text-emerald-400'
            }`} />
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Project 22 is a registered 501(c)(3) nonprofit organization. Financial records are available upon request. Our goal is to maximize the impact of every dollar donated by keeping administrative costs as low as possible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
