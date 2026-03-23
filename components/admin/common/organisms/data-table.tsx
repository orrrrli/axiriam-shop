import { ActionButtons } from '../molecules/action-buttons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Column<T = any> {
  header: string;
  key: string;
  render?: (value: unknown, row: T) => React.ReactNode;
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
  selectionMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
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
  selectionMode = false,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: DataTableProps<T>): React.ReactElement {
  const hasActions = (onEdit || onDelete) && !selectionMode;
  const allSelected = data.length > 0 && selectedIds?.size === data.length;
  const someSelected = (selectedIds?.size ?? 0) > 0 && !allSelected;

  const displayColumns = hasActions
    ? [...columns, { header: 'Acciones', key: '__actions__' }]
    : columns;

  return (
    <div className="bg-white border border-border rounded-[0.8rem]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {selectionMode && (
                <th className="py-[1.2rem] px-[2rem] w-[4rem]">
                  <button
                    type="button"
                    onClick={onToggleSelectAll}
                    className="flex items-center justify-center w-[1.8rem] h-[1.8rem] rounded-[0.4rem] border-[1.5px] border-border hover:border-heading transition-colors duration-150 relative"
                    aria-label="Seleccionar todo"
                  >
                    {allSelected && (
                      <span className="block w-[1rem] h-[1rem] bg-heading rounded-[0.2rem]" />
                    )}
                    {someSelected && (
                      <span className="block w-[1rem] h-[0.2rem] bg-heading rounded-full" />
                    )}
                  </button>
                </th>
              )}
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
                  colSpan={displayColumns.length + (selectionMode ? 1 : 0)}
                  className="py-[6rem]"
                >
                  <div className="flex flex-col items-center justify-center gap-[1.2rem] text-admin-muted">
                    {emptyIcon && <div className="opacity-30">{emptyIcon}</div>}
                    <p className="text-[1.4rem]">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
            {data.map((row) => {
              const isSelected = selectedIds?.has(row.id) ?? false;
              return (
                <tr
                  key={row.id}
                  onClick={
                    selectionMode
                      ? () => onToggleSelect?.(row.id)
                      : onRowClick
                      ? () => onRowClick(row)
                      : undefined
                  }
                  className={`border-b border-border last:border-b-0 transition-colors duration-150 ${
                    selectionMode
                      ? isSelected
                        ? 'bg-[#f0f4ff] cursor-pointer'
                        : 'hover:bg-[#fafafa] cursor-pointer'
                      : onRowClick
                      ? 'hover:bg-admin-bg cursor-pointer'
                      : 'hover:bg-admin-bg'
                  }`}
                >
                  {selectionMode && (
                    <td className="py-[1.2rem] px-[2rem] w-[4rem]">
                      <div
                        className={`flex items-center justify-center w-[1.8rem] h-[1.8rem] rounded-[0.4rem] border-[1.5px] transition-all duration-150 ${
                          isSelected
                            ? 'bg-heading border-heading'
                            : 'border-border'
                        }`}
                      >
                        {isSelected && (
                          <svg viewBox="0 0 10 8" className="w-[1rem] h-[0.8rem] fill-none stroke-white stroke-[1.5]">
                            <path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </td>
                  )}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
