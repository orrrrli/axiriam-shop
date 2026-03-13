import { ActionButtons } from '../molecules/ActionButtons';

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
  deletingId?: string | null;
}

/**
 * DataTable organism component for displaying tabular data with actions.
 * 
 * Provides a reusable table structure with consistent styling across admin inventory views.
 * Supports custom column rendering, empty states, and row-level actions (edit/delete).
 * Handles loading states for delete operations to prevent duplicate requests.
 * 
 * @param columns - Array of column definitions with header, key, and optional render function
 * @param data - Array of data objects to display (must have id field)
 * @param emptyMessage - Optional message to display when data is empty
 * @param emptyIcon - Optional icon to display in empty state
 * @param onEdit - Optional callback function when edit button is clicked
 * @param onDelete - Optional callback function when delete button is clicked
 * @param deletingId - Optional ID of the item currently being deleted (for loading state)
 * 
 * @example
 * ```tsx
 * const columns = [
 *   { header: 'Name', key: 'name', render: (v) => <strong>{v}</strong> },
 *   { header: 'Price', key: 'price', render: (v) => `$${v.toFixed(2)}` },
 * ];
 * 
 * <DataTable
 *   columns={columns}
 *   data={items}
 *   emptyMessage="No items found"
 *   emptyIcon={<Package className="w-[3rem] h-[3rem] opacity-30" />}
 *   onEdit={(item) => handleEdit(item)}
 *   onDelete={(item) => handleDelete(item.id)}
 *   deletingId={deletingId}
 * />
 * ```
 */
export function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage = 'No hay datos',
  emptyIcon,
  onEdit,
  onDelete,
  deletingId,
}: DataTableProps<T>) {
  // Add actions column if edit or delete handlers are provided
  const hasActions = onEdit || onDelete;
  const displayColumns = hasActions
    ? [...columns, { header: 'Acciones', key: '__actions__' }]
    : columns;

  return (
    <div className="bg-white border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-body-alt">
              {displayColumns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide"
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
                  className="py-[6rem] text-center text-subtle text-[1.4rem]"
                >
                  {emptyIcon && <div className="mx-auto mb-[1rem]">{emptyIcon}</div>}
                  {emptyMessage}
                </td>
              </tr>
            )}
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-b-0 hover:bg-body transition-colors duration-200"
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
