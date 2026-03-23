import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from '@/components/admin/common/molecules/form-field';

describe('FormField Integration Tests', () => {
  it('should integrate with text input', () => {
    const onChange = vi.fn();
    
    render(
      <FormField label="Name" required={true}>
        <input
          type="text"
          value=""
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-border px-[1.6rem] py-[1.2rem]"
        />
      </FormField>
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'John Doe' } });
    
    expect(onChange).toHaveBeenCalledWith('John Doe');
  });

  it('should integrate with select dropdown', () => {
    const onChange = vi.fn();
    
    render(
      <FormField label="Category">
        <select
          value="option1"
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-border px-[1.6rem] py-[1.2rem]"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
      </FormField>
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(onChange).toHaveBeenCalledWith('option2');
  });

  it('should integrate with textarea', () => {
    const onChange = vi.fn();
    
    render(
      <FormField label="Description">
        <textarea
          value=""
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-border px-[1.6rem] py-[1.2rem]"
          rows={3}
        />
      </FormField>
    );
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test description' } });
    
    expect(onChange).toHaveBeenCalledWith('Test description');
  });

  it('should display validation error after form submission', () => {
    const { rerender } = render(
      <FormField label="Email" required={true}>
        <input type="email" />
      </FormField>
    );
    
    // Initially no error
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    
    // After validation fails
    rerender(
      <FormField label="Email" required={true} error="Email is required">
        <input type="email" />
      </FormField>
    );
    
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
  });

  it('should work in a complete form scenario', () => {
    const formData = { name: '', email: '' };
    const errors = { name: '', email: '' };
    const setFormData = vi.fn();
    
    render(
      <form>
        <FormField label="Name" required={true} error={errors.name}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </FormField>
        
        <FormField label="Email" required={true} error={errors.email}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </FormField>
      </form>
    );
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getAllByText('*')).toHaveLength(2);
  });

  it('should maintain styling consistency with existing admin forms', () => {
    render(
      <FormField label="Test Field">
        <input type="text" />
      </FormField>
    );
    
    const label = screen.getByText('Test Field');
    
    // Verify it matches the existing admin form styling
    expect(label.className).toBe(
      'block text-[1.2rem] font-medium text-gray-500 mb-[0.4rem]'
    );
  });
});
