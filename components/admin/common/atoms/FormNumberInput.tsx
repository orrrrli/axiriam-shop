import { cn } from '@/lib/utils/helpers';

interface FormNumberInputProps {
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  'aria-label'?: string;
}

export function FormNumberInput({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  className,
  placeholder,
  'aria-label': ariaLabel,
}: FormNumberInputProps) {
  return (
    <input
      type="number"
      className={cn(
        'w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus disabled:bg-body-alt disabled:cursor-not-allowed',
        className
      )}
      value={value}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '') { onChange(''); return; }
        const parsed = parseFloat(raw);
        onChange(isNaN(parsed) ? '' : parsed);
      }}
      onWheel={(e) => (e.target as HTMLInputElement).blur()}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}
