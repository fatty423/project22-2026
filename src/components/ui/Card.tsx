import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  const hoverEffect = hover ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div className={`bg-white rounded-brand border border-slate-200 p-6 transition-all duration-300 ${hoverEffect} ${className}`}>
      {children}
    </div>
  );
}
