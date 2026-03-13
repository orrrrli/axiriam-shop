interface FormInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export function FormInput({
  value,
  onChange,
  placeholder,
  disabled,
  'aria-label': ariaLabel,
}: FormInputProps) {
  return (
    <input
      className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus disabled:bg-body-alt disabled:cursor-not-allowed"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  );
}
