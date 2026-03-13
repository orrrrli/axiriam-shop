# DataTable Component - Usage Examples

## Overview

The `DataTable` organism component provides a reusable table structure with consistent styling across admin inventory views. It supports custom column rendering, empty states, and row-level actions (edit/delete).

## Basic Usage

```tsx
import { DataTable } from '@/components/admin/common/organisms/DataTable';

const columns = [
  { header: 'Name', key: 'name' },
  { header: 'Price', key: 'price' },
  { header: 'Stock', key: 'stock' },
];

const data = [
  { id: '1', name: 'Item 1', price: 10.5, stock: 5 },
  { id: '2', name: 'Item 2', price: 20.0, stock: 10 },
];

<DataTable columns={columns} data={data} />
```

## With Custom Column Rendering

```tsx
const columns = [
  { 
    header: 'Name', 
    key: 'name',
    render: (value) => <strong>{value}</strong>
  },
  { 
    header: 'Price', 
    key: 'price',
    render: (value) => `$${value.toFixed(2)}`
  },
  { 
    header: 'Type', 
    key: 'type',
    render: (value) => TYPE_LABELS[value] ?? value
  },
];

<DataTable columns={columns} data={items} />
```

## With Empty State

```tsx
import { Package } from 'lucide-react';

<DataTable
  columns={columns}
  data={[]}
  emptyMessage="No items found"
  emptyIcon={<Package className="w-[3rem] h-[3rem] opacity-30" />}
/>
```

## With Row Actions

```tsx
const [deletingId, setDeletingId] = useState<string | null>(null);

function handleEdit(item: Item) {
  setEditingItem(item);
  setModalOpen(true);
}

async function handleDelete(item: Item) {
  if (!confirm('Are you sure?')) return;
  setDeletingId(item.id);
  try {
    await deleteItem(item.id);
  } finally {
    setDeletingId(null);
  }
}

<DataTable
  columns={columns}
  data={items}
  onEdit={handleEdit}
  onDelete={handleDelete}
  deletingId={deletingId}
/>
```

## Complete Example (TelasView)

```tsx
import { useState } from 'react';
import { Palette } from 'lucide-react';
import { DataTable } from '@/components/admin/common/organisms/DataTable';
import { TELA_TYPE_LABELS } from '@/lib/constants/admin/telas.constants';

export default function TelasView({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const columns = [
    { 
      header: 'Nombre', 
      key: 'name',
      render: (v) => <strong>{v}</strong>
    },
    { 
      header: 'Tipo', 
      key: 'type',
      render: (v) => TELA_TYPE_LABELS[v] ?? v
    },
    { header: 'Ancho (m)', key: 'width' },
    { header: 'Alto (m)', key: 'height' },
    { header: 'Stock', key: 'quantity' },
    { 
      header: 'Precio', 
      key: 'price',
      render: (v) => `$${v.toFixed(2)}`
    },
    { header: 'Proveedor', key: 'supplier' },
  ];

  async function handleDelete(item) {
    if (!confirm('¿Eliminar esta tela?')) return;
    setDeletingId(item.id);
    try {
      const result = await deleteTela(item.id);
      if (result.success) {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        alert(result.error);
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={items}
        emptyMessage="No hay telas registradas"
        emptyIcon={<Palette className="w-[3rem] h-[3rem] opacity-30" />}
        onEdit={(item) => openEditModal(item)}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `columns` | `Column[]` | Yes | - | Array of column definitions |
| `data` | `T[]` | Yes | - | Array of data objects (must have `id` field) |
| `emptyMessage` | `string` | No | `'No hay datos'` | Message to display when data is empty |
| `emptyIcon` | `React.ReactNode` | No | - | Icon to display in empty state |
| `onEdit` | `(item: T) => void` | No | - | Callback when edit button is clicked |
| `onDelete` | `(item: T) => void` | No | - | Callback when delete button is clicked |
| `deletingId` | `string \| null` | No | - | ID of item currently being deleted (for loading state) |

## Column Definition

```typescript
interface Column<T = any> {
  header: string;           // Column header text
  key: string;              // Key to access value in data object
  render?: (value: any, row: T) => React.ReactNode;  // Optional custom render function
}
```

## Features

- **Consistent Styling**: Matches existing admin table styling
- **Custom Rendering**: Support for custom column render functions
- **Empty States**: Customizable empty state with icon and message
- **Row Actions**: Automatic actions column when handlers provided
- **Loading States**: Shows loading spinner on delete button during operation
- **Responsive**: Horizontal scrolling on small screens
- **Hover Effects**: Row hover effects for better UX
- **Accessibility**: Proper ARIA labels on action buttons

## Requirements Validated

- **5.1**: Accepts props for columns, data, and row actions
- **5.2**: Renders headers with consistent styling
- **5.3**: Displays customizable empty state when data is empty
- **5.4**: Supports row actions (edit, delete) through callbacks
- **5.5**: Handles loading states for row-level operations
- **5.6**: Responsive with horizontal scrolling support
