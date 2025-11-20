import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none outline-none focus:ring-2 focus:ring-offset-1";
  
  const variants = {
    primary: "bg-suit-black text-white hover:bg-gray-800 focus:ring-gray-900 dark:bg-midnight-accent dark:text-black dark:hover:bg-yellow-500",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700",
    ghost: "bg-transparent text-gray-700 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10",
    danger: "bg-suit-red text-white hover:bg-red-800 focus:ring-red-500",
    gold: "bg-yellow-500 text-black hover:bg-yellow-400 focus:ring-yellow-500 shadow-lg shadow-yellow-500/20",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};