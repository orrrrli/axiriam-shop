interface FormNumberInputProps {
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  'aria-label'?: string;
}

export function FormNumberInput({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  'aria-label': ariaLabel,
}: FormNumberInputProps) {
  return (
    <input
      type="number"
      className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus disabled:bg-body-alt disabled:cursor-not-allowed"
      value={value}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '') { onChange(''); return; }
        const parsed = parseFloat(raw);
        onChange(isNaN(parsed) ? '' : parsed);
      }}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  );
}