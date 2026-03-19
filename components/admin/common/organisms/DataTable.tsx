import { ActionButtons } from '../molecules/ActionButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Column<T = any> {
  header: string;
  key: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRowClick?: (item: T) => void;
  deletingId?: string | null;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage = 'No hay datos',
  emptyIcon,
  onEdit,
  onDelete,
  onRowClick,
  deletingId,
}: DataTableProps<T>): React.ReactElement {
  const hasActions = onEdit || onDelete;
  const displayColumns = hasActions
    ? [...columns, { header: 'Acciones', key: '__actions__' }]
    : columns;

  return (
    <div className="bg-white border border-border rounded-[0.8rem]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {displayColumns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-admin-muted font-semibold uppercase tracking-wide"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={displayColumns.length}
                  className="py-[6rem]"
                >
                  <div className="flex flex-col items-center justify-center gap-[1.2rem] text-admin-muted">
                    {emptyIcon && <div className="opacity-30">{emptyIcon}</div>}
                    <p className="text-[1.4rem]">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-border last:border-b-0 hover:bg-admin-bg transition-colors duration-200${onRowClick ? ' cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph"
                  >
                    {col.render ? col.render(row[col.key as keyof T], row) : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
                {hasActions && (
                  <td className="py-[1.2rem] px-[2rem]">
                    <ActionButtons
                      onEdit={() => onEdit?.(row)}
                      onDelete={() => onDelete?.(row)}
                      isDeleting={deletingId === row.id}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
