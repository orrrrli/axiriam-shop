# Modal Component Usage Examples

## Basic Usage

```tsx
import { Modal } from '@/components/admin/common/organisms/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal Title"
      >
        <p>This is the modal content.</p>
      </Modal>
    </>
  );
}
```

## With Footer Actions

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <button className="button button-muted" onClick={() => setIsOpen(false)}>
        Cancel
      </button>
      <button className="button" onClick={handleSave}>
        Save
      </button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

## With Form Content

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Item"
  footer={
    <>
      <button className="button button-muted" onClick={() => setIsOpen(false)}>
        Cancel
      </button>
      <button className="button" onClick={handleSubmit} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </>
  }
>
  <div className="flex flex-col gap-[2rem]">
    <FormField label="Name" required>
      <FormInput
        value={form.name}
        onChange={(value) => setForm({ ...form, name: value })}
      />
    </FormField>
    
    <FormField label="Description">
      <FormTextarea
        value={form.description}
        onChange={(value) => setForm({ ...form, description: value })}
      />
    </FormField>
  </div>
</Modal>
```

## Custom Width

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Wide Modal"
  maxWidth="80rem"
>
  <p>This modal has a custom maximum width.</p>
</Modal>
```

## Key Features

### Escape Key Handling
The modal automatically closes when the user presses the Escape key.

### Backdrop Click Handling
Clicking outside the modal (on the backdrop) automatically closes it.

### Body Scroll Locking
When the modal is open, the body scroll is locked to prevent background scrolling.

### Accessibility
- Proper ARIA attributes (`role="dialog"`, `aria-modal`, `aria-labelledby`)
- Title is properly linked to the dialog via `aria-labelledby`
- Focus management for screen readers

### Cleanup
Event listeners and body scroll styles are automatically cleaned up when the modal is closed or unmounted.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | Yes | - | Controls modal visibility |
| `onClose` | `() => void` | Yes | - | Callback when modal should close |
| `title` | `string` | Yes | - | Modal title text |
| `children` | `React.ReactNode` | Yes | - | Modal content |
| `footer` | `React.ReactNode` | No | - | Optional footer with action buttons |
| `maxWidth` | `string` | No | `'54rem'` | Maximum width of modal content |
