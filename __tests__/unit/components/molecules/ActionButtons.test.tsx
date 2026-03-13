import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionButtons } from '@/components/admin/common/molecules/ActionButtons';

describe('ActionButtons Component', () => {
  it('should render edit and delete buttons', () => {
    render(
      <ActionButtons
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(
      <ActionButtons
        onEdit={onEdit}
        onDelete={vi.fn()}
      />
    );

    const editButton = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(
      <ActionButtons
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('should show loading state on delete button when isDeleting is true', () => {
    render(
      <ActionButtons
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        isDeleting={true}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    expect(deleteButton).toBeDisabled();
    
    // Check for spinner icon (Loader2 component)
    const spinner = deleteButton.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should not show loading state when isDeleting is false', () => {
    render(
      <ActionButtons
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        isDeleting={false}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    expect(deleteButton).not.toBeDisabled();
    
    // Check for trash icon instead of spinner
    const spinner = deleteButton.querySelector('.animate-spin');
    expect(spinner).not.toBeInTheDocument();
  });

  it('should have proper button styling classes', () => {
    render(
      <ActionButtons
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const editButton = screen.getByRole('button', { name: /editar/i });
    const deleteButton = screen.getByRole('button', { name: /eliminar/i });

    // Edit button should have muted styling
    expect(editButton).toHaveClass('button', 'button-muted', 'button-small');
    
    // Delete button should have danger styling
    expect(deleteButton).toHaveClass('button', 'button-danger', 'button-small');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <ActionButtons
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const editButton = screen.getByRole('button', { name: /editar/i });
    const deleteButton = screen.getByRole('button', { name: /eliminar/i });

    expect(editButton).toHaveAttribute('aria-label', 'Editar');
    expect(deleteButton).toHaveAttribute('aria-label', 'Eliminar');
  });
});
