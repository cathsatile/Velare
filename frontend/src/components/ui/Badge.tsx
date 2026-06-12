import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'gold';
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-900/50 text-emerald-400 border-emerald-800',
    warning: 'bg-amber-900/50 text-amber-400 border-amber-800',
    danger: 'bg-red-900/50 text-red-400 border-red-800',
    neutral: 'bg-velare-panel text-velare-text-muted border-velare-border',
    gold: 'bg-velare-gold/20 text-velare-gold border-velare-gold/50',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
