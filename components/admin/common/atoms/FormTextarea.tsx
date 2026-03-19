import { cn } from '@/lib/utils/helpers';

interface FormTextareaProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function FormTextarea({
  value,
  onChange,
  rows = 3,
  placeholder,
  disabled,
  className,
  'aria-label': ariaLabel,
}: FormTextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus disabled:bg-body-alt disabled:cursor-not-allowed resize-vertical',
        className
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  );
}
