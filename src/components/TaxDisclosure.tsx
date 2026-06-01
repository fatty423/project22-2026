import { FileText } from 'lucide-react';

interface TaxDisclosureProps {
  variant?: 'default' | 'light';
  className?: string;
}

export function TaxDisclosure({ variant = 'default', className = '' }: TaxDisclosureProps) {
  const isLight = variant === 'light';

  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <FileText className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isLight ? 'text-blue-200' : 'text-slate-400'}`} />
      <p className={`text-xs leading-relaxed ${isLight ? 'text-blue-200' : 'text-slate-500'}`}>
        Contributions to Project 22, a registered 501(c)(3) nonprofit, are tax-deductible to the extent allowed by law.
        Donors receive an annual giving statement at year-end for their tax records.
      </p>
    </div>
  );
}
