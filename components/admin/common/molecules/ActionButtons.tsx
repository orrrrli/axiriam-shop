import { Pencil, Trash2, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

/**
 * ActionButtons molecule component for edit/delete button groups in admin tables.
 * 
 * Provides consistent styling and behavior for row-level actions across admin inventory views.
 * Handles loading states for delete operations to prevent duplicate requests.
 * 
 * @param onEdit - Callback function when edit button is clicked
 * @param onDelete - Callback function when delete button is clicked
 * @param isDeleting - Optional boolean to show loading state on delete button
 * 
 * @example
 * ```tsx
 * <ActionButtons
 *   onEdit={() => handleEdit(item)}
 *   onDelete={() => handleDelete(item.id)}
 *   isDeleting={deletingId === item.id}
 * />
 * ```
 */
export function ActionButtons({ onEdit, onDelete, isDeleting = false }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-[0.8rem]">
      <button
        onClick={onEdit}
        className="button button-muted button-small flex items-center gap-[0.4rem]"
        aria-label="Editar"
      >
        <Pencil className="w-[1.2rem] h-[1.2rem]" /> Editar
      </button>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="button button-danger button-small flex items-center gap-[0.4rem]"
        aria-label="Eliminar"
      >
        {isDeleting ? (
          <Loader2 className="w-[1.2rem] h-[1.2rem] animate-spin" />
        ) : (
          <Trash2 className="w-[1.2rem] h-[1.2rem]" />
        )}
        Eliminar
      </button>
    </div>
  );
}
