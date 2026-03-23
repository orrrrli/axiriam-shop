import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '@/components/admin/common/organisms/data-table';
import { Package } from 'lucide-react';

describe('DataTable Component', () => {
  const mockColumns = [
    { header: 'Name', key: 'name' },
    { header: 'Price', key: 'price', render: (v: number) => `$${v.toFixed(2)}` },
    { header: 'Stock', key: 'stock' },
  ];

  const mockData = [
    { id: '1', name: 'Item 1', price: 10.5, stock: 5 },
    { id: '2', name: 'Item 2', price: 20.0, stock: 10 },
    { id: '3', name: 'Item 3', price: 15.75, stock: 3 },
  ];

  it('should render table with headers and data', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);

    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();

    // Check data
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('$10.50')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display empty state when data is empty', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={[]}
        emptyMessage="No items found"
        emptyIcon={<Package className="w-[3rem] h-[3rem] opacity-30" />}
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('should display default empty message when no custom message provided', () => {
    render(<DataTable columns={mockColumns} data={[]} />);

    expect(screen.getByText('No hay datos')).toBeInTheDocument();
  });

  it('should render actions column when onEdit or onDelete provided', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Acciones')).toBeInTheDocument();
    
    // Should have edit and delete buttons for each row
    const editButtons = screen.getAllByLabelText('Editar');
    const deleteButtons = screen.getAllByLabelText('Eliminar');
    
    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const editButtons = screen.getAllByLabelText('Editar');
    fireEvent.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it('should call onDelete when delete button is clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const deleteButtons = screen.getAllByLabelText('Eliminar');
    fireEvent.click(deleteButtons[1]);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockData[1]);
  });

  it('should show loading state on delete button when deletingId matches', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onEdit={onEdit}
        onDelete={onDelete}
        deletingId="2"
      />
    );

    const deleteButtons = screen.getAllByLabelText('Eliminar');
    
    // Second button should be disabled (deletingId = "2")
    expect(deleteButtons[1]).toBeDisabled();
  });

  it('should apply custom render function to column values', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);

    // Price column has custom render function that formats as currency
    expect(screen.getByText('$10.50')).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument();
    expect(screen.getByText('$15.75')).toBeInTheDocument();
  });

  it('should not render actions column when no handlers provided', () => {
    render(<DataTable columns={mockColumns} data={mockData} />);

    expect(screen.queryByText('Acciones')).not.toBeInTheDocument();
  });

  it('should handle rows with hover effect', () => {
    const { container } = render(<DataTable columns={mockColumns} data={mockData} />);

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveClass('hover:bg-admin-bg');
  });

  it('should apply responsive overflow styling', () => {
    const { container } = render(<DataTable columns={mockColumns} data={mockData} />);

    const overflowContainer = container.querySelector('.overflow-x-auto');
    expect(overflowContainer).toBeInTheDocument();
  });
});
