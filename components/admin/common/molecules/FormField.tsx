interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-[1.2rem] font-medium text-gray-500 mb-[0.4rem]">
        {label}
        {required && <span className="text-blue-500 ml-[0.2rem]">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-gray-400 text-[1.1rem] mt-[0.4rem]">{hint}</p>
      )}
      {error && (
        <p className="text-red-500 text-[1.2rem] mt-[0.4rem]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
