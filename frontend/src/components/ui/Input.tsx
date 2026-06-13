import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-velare-text-muted mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 bg-velare-panel border rounded-lg text-velare-text placeholder-velare-text-muted/50 focus:outline-none focus:ring-2 focus:ring-velare-gold focus:border-transparent transition-all ${
            error ? 'border-velare-error' : 'border-velare-border'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-velare-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
