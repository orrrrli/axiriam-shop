# FormRow Component Usage Examples

The `FormRow` component provides a grid layout for form fields with responsive column support.

## Basic Usage

### Two-Column Layout (Default)

```tsx
import { FormRow } from '@/components/admin/common/molecules/FormRow';
import { FormField } from '@/components/admin/common/molecules/FormField';
import { FormNumberInput } from '@/components/admin/common/atoms/FormNumberInput';

<FormRow>
  <FormField label="Ancho (m)">
    <FormNumberInput
      value={form.width}
      onChange={(value) => setForm({ ...form, width: value })}
      min={0}
      step={0.01}
    />
  </FormField>
  <FormField label="Alto (m)">
    <FormNumberInput
      value={form.height}
      onChange={(value) => setForm({ ...form, height: value })}
      min={0}
      step={0.01}
    />
  </FormField>
</FormRow>
```

### Three-Column Layout

```tsx
<FormRow columns={3}>
  <FormField label="Completo">
    <FormNumberInput
      value={form.quantityCompleto}
      onChange={(value) => setForm({ ...form, quantityCompleto: value })}
      min={0}
    />
  </FormField>
  <FormField label="Sencillo">
    <FormNumberInput
      value={form.quantitySencillo}
      onChange={(value) => setForm({ ...form, quantitySencillo: value })}
      min={0}
    />
  </FormField>
  <FormField label="Precio">
    <FormNumberInput
      value={form.price}
      onChange={(value) => setForm({ ...form, price: value })}
      min={0}
      step={0.01}
    />
  </FormField>
</FormRow>
```

### Single Column Layout

```tsx
<FormRow columns={1}>
  <FormField label="Description">
    <FormTextarea
      value={form.description}
      onChange={(value) => setForm({ ...form, description: value })}
      rows={3}
    />
  </FormField>
</FormRow>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The form fields to display in the row |
| `columns` | `1 \| 2 \| 3 \| 4` | `2` | Number of columns in the grid layout |

## Features

- **Responsive Grid Layout**: Uses CSS Grid for flexible, responsive layouts
- **Consistent Spacing**: Maintains 2rem gap between fields
- **Multiple Column Support**: Supports 1, 2, 3, or 4 columns
- **Flexible Children**: Works with any React components, especially FormField

## Design Rationale

The FormRow component replaces inline grid layouts like:

```tsx
// Before
<div className="grid grid-cols-2 gap-[2rem]">
  <div>
    <label>Width</label>
    <input type="number" />
  </div>
  <div>
    <label>Height</label>
    <input type="number" />
  </div>
</div>

// After
<FormRow columns={2}>
  <FormField label="Width">
    <FormNumberInput value={width} onChange={setWidth} />
  </FormField>
  <FormField label="Height">
    <FormNumberInput value={height} onChange={setHeight} />
  </FormField>
</FormRow>
```

This provides:
- Consistent spacing across all forms
- Easier maintenance (change gap in one place)
- Better readability
- Type-safe column counts
