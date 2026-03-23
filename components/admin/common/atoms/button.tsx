interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  variant = 'primary',
  disabled = false,
  onClick,
  children,
  type = 'button',
  className = '',
}: ButtonProps) {
  const variantClasses = {
    primary: 'button',
    secondary: 'button button-muted',
    danger: 'button button-danger',
  };

  const baseClass = variantClasses[variant];
  const combinedClassName = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
