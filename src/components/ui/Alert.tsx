import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface AlertProps {
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Alert({ children, variant = 'info', className }: AlertProps) {
  const variants = {
    info: 'border-brand-marine/20 bg-brand-marine/5 text-brand-marine',
    success: 'border-green-200 bg-green-50 text-green-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    error: 'border-red-200 bg-red-50 text-red-800',
  };

  return (
    <div className={cn('border rounded-md p-4', variants[variant], className)}>
      {children}
    </div>
  );
}