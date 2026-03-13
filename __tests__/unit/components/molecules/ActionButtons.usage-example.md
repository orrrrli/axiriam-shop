# ActionButtons Component - Usage Example

## Overview

The `ActionButtons` molecule component provides a consistent edit/delete button group for admin table rows. It handles loading states during delete operations and maintains consistent styling across all admin inventory views.

## Basic Usage

```tsx
import { ActionButtons } from '@/components/admin/common/molecules/ActionButtons';

function MyTableRow({ item, deletingId, onEdit, onDelete }) {
  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td>
        <ActionButtons
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
          isDeleting={deletingId === item.id}
        />
      </td>
    </tr>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onEdit` | `() => void` | Yes | - | Callback function when edit button is clicked |
| `onDelete` | `() => void` | Yes | - | Callback function when delete button is clicked |
| `isDeleting` | `boolean` | No | `false` | Shows loading spinner on delete button when true |

## Complete Example with State Management

```tsx
'use client';

import { useState } from 'react';
import { ActionButtons } from '@/components/admin/common/molecules/ActionButtons';

export default function InventoryTable({ items }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState(null);

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este elemento?')) return;
    
    setDeletingId(id);
    try {
      await fetch(`/api/admin/inventory/items/${id}`, { 
        method: 'DELETE' 
      });
      // Update state or refresh
    } finally {
      setDeletingId(null);
    }
  }

  function handleEdit(item) {
    setEditingItem(item);
    // Open modal or navigate to edit page
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>
              <ActionButtons
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
                isDeleting={deletingId === item.id}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Styling

The component uses the following CSS classes from the design system:

- `button` - Base button styling
- `button-muted` - Muted styling for edit button
- `button-danger` - Danger styling for delete button
- `button-small` - Small button size for table rows

## Accessibility

The component includes proper accessibility attributes:

- `aria-label="Editar"` on edit button
- `aria-label="Eliminar"` on delete button
- `disabled` attribute on delete button during loading state

## Icons

The component uses Lucide React icons:

- `Pencil` - Edit button icon
- `Trash2` - Delete button icon (default state)
- `Loader2` - Delete button icon (loading state with spin animation)

## Requirements Validation

This component validates the following requirements:

- **Requirement 3.1**: Form components accept props for value, onChange handler, label, and validation state
- **Requirement 3.2**: Consistent styling across all admin inventory views
- **Requirement 3.4**: Self-contained atomic components with their own styling and behavior
