import { cn } from '@/lib/utils/helpers';

interface FormInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function FormInput({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  'aria-label': ariaLabel,
}: FormInputProps) {
  return (
    <input
      className={cn(
        'w-full bg-white border border-border rounded-[0.4rem] px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-admin-active-border transition-colors duration-150 disabled:bg-body-alt disabled:cursor-not-allowed',
        className
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  );
}
