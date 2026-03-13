interface FormRowProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function FormRow({ children, columns = 2 }: FormRowProps) {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridColsClass} gap-[2rem]`}>
      {children}
    </div>
  );
}
