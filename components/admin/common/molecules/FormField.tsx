interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
        {label}
        {required && <span className="text-red-500 ml-[0.4rem]">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-[1.2rem] mt-[0.4rem]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
