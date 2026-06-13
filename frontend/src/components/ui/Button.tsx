import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-velare-panel disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-velare-gold text-velare-bg hover:bg-velare-gold-light focus:ring-velare-gold',
      secondary: 'bg-transparent border border-velare-border text-velare-text hover:bg-velare-panel hover:border-velare-gold focus:ring-velare-gold',
      danger: 'bg-velare-error text-white hover:bg-red-600 focus:ring-velare-error',
      ghost: 'bg-transparent text-velare-text-muted hover:text-velare-text hover:bg-velare-panel',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
