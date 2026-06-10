import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-white text-gray-950 hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]",
      secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 shadow-sm",
      outline: "border border-gray-700 hover:bg-gray-800 text-gray-200 backdrop-blur-sm",
      ghost: "hover:bg-gray-800/60 text-gray-200",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6",
      lg: "h-12 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
