# FormModal Usage Examples

## Overview

The `FormModal` component combines the `Modal` organism with form layout capabilities. It wraps the Modal component and provides convenient props for form-specific use cases while maintaining all Modal functionality (Escape key, backdrop clicks, etc.).

## Basic Usage

### Simple Form Modal

```tsx
import { FormModal } from '@/components/admin/common/organisms/FormModal';
import { FormField } from '@/components/admin/common/molecules/FormField';
import { FormInput } from '@/components/admin/common/atoms/FormInput';

function CreateItemModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    console.log('Form submitted:', { name });
    setIsOpen(false);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create Item"
      onSubmit={handleSubmit}
      footer={
        <>
          <button type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </>
      }
    >
      <FormField label="Name" required>
        <FormInput value={name} onChange={setName} />
      </FormField>
    </FormModal>
  );
}
```

## Advanced Usage

### Complete Form with Multiple Field Types

```tsx
import { FormModal } from '@/components/admin/common/organisms/FormModal';
import { FormField } from '@/components/admin/common/molecules/FormField';
import { FormRow } from '@/components/admin/common/molecules/FormRow';
import { FormInput } from '@/components/admin/common/atoms/FormInput';
import { FormTextarea } from '@/components/admin/common/atoms/FormTextarea';
import { FormSelect } from '@/components/admin/common/atoms/FormSelect';
import { FormNumberInput } from '@/components/admin/common/atoms/FormNumberInput';

function CreateProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'electronics',
    price: 0,
    stock: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    console.log('Product created:', form);
    setIsOpen(false);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create Product"
      onSubmit={handleSubmit}
      maxWidth="60rem"
      footer={
        <>
          <button type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button type="submit">Create Product</button>
        </>
      }
    >
      <FormField label="Product Name" required>
        <FormInput
          value={form.name}
          onChange={(value) => setForm({ ...form, name: value })}
          placeholder="Enter product name"
        />
      </FormField>

      <FormField label="Description">
        <FormTextarea
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
          rows={4}
          placeholder="Enter product description"
        />
      </FormField>

      <FormField label="Category">
        <FormSelect
          value={form.category}
          onChange={(value) => setForm({ ...form, category: value })}
          options={[
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'food', label: 'Food' },
          ]}
        />
      </FormField>

      <FormRow columns={2}>
        <FormField label="Price" required>
          <FormNumberInput
            value={form.price}
            onChange={(value) => setForm({ ...form, price: value })}
            min={0}
            step={0.01}
          />
        </FormField>
        <FormField label="Stock" required>
          <FormNumberInput
            value={form.stock}
            onChange={(value) => setForm({ ...form, stock: value })}
            min={0}
          />
        </FormField>
      </FormRow>
    </FormModal>
  );
}
```

### Form with Validation

```tsx
import { FormModal } from '@/components/admin/common/organisms/FormModal';
import { FormField } from '@/components/admin/common/molecules/FormField';
import { FormInput } from '@/components/admin/common/atoms/FormInput';

function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });

  const validate = () => {
    const newErrors = { name: '', email: '' };
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (validate()) {
      console.log('User created:', form);
      setIsOpen(false);
      setForm({ name: '', email: '' });
      setErrors({ name: '', email: '' });
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create User"
      onSubmit={handleSubmit}
      footer={
        <>
          <button type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button type="submit">Create User</button>
        </>
      }
    >
      <FormField label="Name" required error={errors.name}>
        <FormInput
          value={form.name}
          onChange={(value) => {
            setForm({ ...form, name: value });
            setErrors({ ...errors, name: '' });
          }}
        />
      </FormField>

      <FormField label="Email" required error={errors.email}>
        <FormInput
          value={form.email}
          onChange={(value) => {
            setForm({ ...form, email: value });
            setErrors({ ...errors, email: '' });
          }}
          placeholder="user@example.com"
        />
      </FormField>
    </FormModal>
  );
}
```

### Edit Form (Pre-filled Values)

```tsx
import { FormModal } from '@/components/admin/common/organisms/FormModal';
import { FormField } from '@/components/admin/common/molecules/FormField';
import { FormInput } from '@/components/admin/common/atoms/FormInput';
import { FormNumberInput } from '@/components/admin/common/atoms/FormNumberInput';

interface Item {
  id: string;
  name: string;
  price: number;
}

function EditItemModal({ item }: { item: Item | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', price: 0 });

  useEffect(() => {
    if (item) {
      setForm({ name: item.name, price: item.price });
      setIsOpen(true);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    console.log('Item updated:', { id: item?.id, ...form });
    setIsOpen(false);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Edit Item"
      onSubmit={handleSubmit}
      footer={
        <>
          <button type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button type="submit">Save Changes</button>
        </>
      }
    >
      <FormField label="Name" required>
        <FormInput
          value={form.name}
          onChange={(value) => setForm({ ...form, name: value })}
        />
      </FormField>

      <FormField label="Price" required>
        <FormNumberInput
          value={form.price}
          onChange={(value) => setForm({ ...form, price: value })}
          min={0}
          step={0.01}
        />
      </FormField>
    </FormModal>
  );
}
```

### Form with Loading State

```tsx
import { FormModal } from '@/components/admin/common/organisms/FormModal';
import { FormField } from '@/components/admin/common/molecules/FormField';
import { FormInput } from '@/components/admin/common/atoms/FormInput';

function CreateItemModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setSaving(true);
    try {
      await fetch('/api/items', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      setIsOpen(false);
      setName('');
    } catch (error) {
      alert('Failed to create item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create Item"
      onSubmit={handleSubmit}
      footer={
        <>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </>
      }
    >
      <FormField label="Name" required>
        <FormInput
          value={name}
          onChange={setName}
          disabled={saving}
        />
      </FormField>
    </FormModal>
  );
}
```

## Props

### FormModalProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | Yes | - | Controls modal visibility |
| `onClose` | `() => void` | Yes | - | Callback when modal should close |
| `title` | `string` | Yes | - | Modal title displayed in header |
| `children` | `React.ReactNode` | Yes | - | Form content (fields, rows, etc.) |
| `footer` | `React.ReactNode` | No | - | Footer content (typically buttons) |
| `maxWidth` | `string` | No | `'54rem'` | Maximum width of modal |
| `onSubmit` | `(e: React.FormEvent) => void` | No | - | Form submission handler |

## Integration with Other Components

### Works seamlessly with:

- **FormField**: Provides label, error display, and field wrapper
- **FormRow**: Layouts fields in grid columns
- **FormInput**: Text input fields
- **FormNumberInput**: Number input fields
- **FormSelect**: Dropdown select fields
- **FormTextarea**: Multi-line text input fields
- **Button**: Action buttons in footer

## Key Features

1. **Form Submission Handling**: Automatically prevents default form submission and calls `onSubmit`
2. **Proper Spacing**: Applies `gap-[2rem]` between form elements
3. **Modal Functionality**: Inherits all Modal features (Escape key, backdrop clicks)
4. **Accessibility**: Wraps content in semantic `<form>` element
5. **Flexible Layout**: Works with any combination of form components
6. **Custom Width**: Supports custom modal widths via `maxWidth` prop

## Best Practices

1. Always provide a `footer` with Cancel and Submit buttons
2. Use `type="button"` for cancel buttons to prevent form submission
3. Use `type="submit"` for save/create buttons to trigger form submission
4. Implement validation before calling API in `onSubmit`
5. Show loading states during async operations
6. Clear form state when modal closes
7. Use FormRow for side-by-side field layouts
8. Display validation errors using FormField's `error` prop
