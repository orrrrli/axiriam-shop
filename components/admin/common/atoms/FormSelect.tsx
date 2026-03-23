interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  disabled?: boolean;
  'aria-label'?: string;
}

export function FormSelect({
  value,
  onChange,
  options,
  disabled,
  'aria-label': ariaLabel,
}: FormSelectProps) {
  return (
    <select
      className="w-full bg-white border border-border rounded-[0.4rem] px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-admin-active-border transition-colors duration-150 disabled:bg-body-alt disabled:cursor-not-allowed"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
