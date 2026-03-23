import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormModal } from '@/components/admin/common/organisms/form-modal';
import { FormField } from '@/components/admin/common/molecules/form-field';
import { FormRow } from '@/components/admin/common/molecules/form-row';
import { FormInput } from '@/components/admin/common/atoms/form-input';
import { FormNumberInput } from '@/components/admin/common/atoms/form-number-input';
import { FormSelect } from '@/components/admin/common/atoms/form-select';
import { FormTextarea } from '@/components/admin/common/atoms/form-textarea';

describe('FormModal Integration Tests', () => {
  describe('Integration with FormField', () => {
    it('should render FormField components correctly', () => {
      render(
        <FormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Test Form">
          <FormField label="Name" required>
            <FormInput value="" onChange={vi.fn()} />
          </FormField>
          <FormField label="Description">
            <FormTextarea value="" onChange={vi.fn()} />
          </FormField>
        </FormModal>
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument(); // Required indicator
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should display validation errors from FormField', () => {
      render(
        <FormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Test Form">
          <FormField label="Email" error="Invalid email format">
            <FormInput value="invalid" onChange={vi.fn()} />
          </FormField>
        </FormModal>
      );

      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Integration with Form Atoms', () => {
    it('should work with FormInput', () => {
      const onChange = vi.fn();
      render(
        <FormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Test Form">
          <FormField label="Name">
            <FormInput value="test" onChange={onChange} />
          </FormField>
        </FormModal>
      );

      const input = screen.getByDisplayValue('test');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(onChange).toHaveBeenCalledWith('new value');
    });

    it('should work with FormNumberInput', () => {
      const onChange = vi.fn();
      render(
        <FormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Test Form">
          <FormField label="Price">
            <FormNumberInput value={10} onChange={onChange} />
          </FormField>
        </FormModal>
      );

      const input = screen.getByDisplayValue('10');
      fireEvent.change(input, { target: { value: '20' } });

      expect(onChange).toHaveBeenCalledWith(20);
    });

    it('should work with FormSelect', () => {
      const onChange = vi.fn();
      render(
        <FormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Test Form">
          <FormField label="Category">
            <FormSelect
              value="option1"
              onChange={onChange}
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
              ]}
            />
          </FormField>
        </FormModal>
      );

      const select = screen.getByDisplayValue('Option 1');
      fireEvent.change(select, { target: { value: 'option2' } });

      expect(onChange).toHaveBeenCalledWith('option2');
    });

    it('should work with FormTextarea', () => {
      const onChange = vi.fn();
      render(
        <FormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Test Form">
          <FormField label="Description">
            <FormTextarea value="test description" onChange={onChange} />
          </FormField>
        </FormModal>
      );

      const textarea = screen.getByDisplayValue('test description');
      fireEvent.change(textarea, { target: { value: 'new description' } });

      expect(onChange).toHaveBeenCalledWith('new description');
    });
  });

  describe('Integration with FormRow', () => {
    it('should layout fields in rows using FormRow', () => {
      render(
        <FormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Test Form">
          <FormRow columns={2}>
            <FormField label="Width">
              <FormNumberInput value={10} onChange={vi.fn()} />
            </FormField>
            <FormField label="Height">
              <FormNumberInput value={20} onChange={vi.fn()} />
            </FormField>
          </FormRow>
        </FormModal>
      );

      expect(screen.getByText('Width')).toBeInTheDocument();
      expect(screen.getByText('Height')).toBeInTheDocument();
      
      const row = screen.getByText('Width').parentElement?.parentElement;
      expect(row).toHaveClass('grid', 'grid-cols-2', 'gap-[2rem]');
    });

    it('should support multiple FormRows', () => {
      render(
        <FormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Test Form">
          <FormField label="Name">
            <FormInput value="" onChange={vi.fn()} />
          </FormField>
          <FormRow columns={2}>
            <FormField label="Width">
              <FormNumberInput value={10} onChange={vi.fn()} />
            </FormField>
            <FormField label="Height">
              <FormNumberInput value={20} onChange={vi.fn()} />
            </FormField>
          </FormRow>
          <FormRow columns={2}>
            <FormField label="Price">
              <FormNumberInput value={100} onChange={vi.fn()} />
            </FormField>
            <FormField label="Stock">
              <FormNumberInput value={50} onChange={vi.fn()} />
            </FormField>
          </FormRow>
        </FormModal>
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Width')).toBeInTheDocument();
      expect(screen.getByText('Height')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Stock')).toBeInTheDocument();
    });
  });

  describe('Complete Form Example', () => {
    it('should handle a complete form submission workflow', () => {
      const onSubmit = vi.fn();
      const onClose = vi.fn();
      
      const TestForm = () => {
        return (
          <FormModal
            isOpen={true}
            onClose={onClose}
            title="Create Item"
            onSubmit={onSubmit}
          >
            <FormField label="Name" required>
              <FormInput value="Test Item" onChange={vi.fn()} />
            </FormField>
            <FormField label="Description">
              <FormTextarea value="Test description" onChange={vi.fn()} />
            </FormField>
            <FormField label="Category">
              <FormSelect
                value="category1"
                onChange={vi.fn()}
                options={[
                  { value: 'category1', label: 'Category 1' },
                  { value: 'category2', label: 'Category 2' },
                ]}
              />
            </FormField>
            <FormRow columns={2}>
              <FormField label="Price">
                <FormNumberInput value={100} onChange={vi.fn()} />
              </FormField>
              <FormField label="Stock">
                <FormNumberInput value={50} onChange={vi.fn()} />
              </FormField>
            </FormRow>
          </FormModal>
        );
      };

      render(<TestForm />);

      // Verify all fields are rendered
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Stock')).toBeInTheDocument();

      // Test cancel button
      const cancelButton = screen.getByText('Cancelar');
      fireEvent.click(cancelButton);
      expect(onClose).toHaveBeenCalledTimes(1);

      // Test submit button
      const saveButton = screen.getByText('Guardar');
      fireEvent.click(saveButton);
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Spacing and Layout', () => {
    it('should maintain proper spacing between form elements', () => {
      const { container } = render(
        <FormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Test Form">
          <FormField label="Field 1">
            <FormInput value="" onChange={vi.fn()} />
          </FormField>
          <FormField label="Field 2">
            <FormInput value="" onChange={vi.fn()} />
          </FormField>
          <FormRow columns={2}>
            <FormField label="Field 3">
              <FormInput value="" onChange={vi.fn()} />
            </FormField>
            <FormField label="Field 4">
              <FormInput value="" onChange={vi.fn()} />
            </FormField>
          </FormRow>
        </FormModal>
      );

      const form = container.querySelector('form');
      expect(form).toHaveClass('flex', 'flex-col', 'gap-[2rem]');
    });
  });

  describe('Error Handling', () => {
    it('should display multiple validation errors', () => {
      render(
        <FormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} title="Test Form">
          <FormField label="Name" error="Name is required">
            <FormInput value="" onChange={vi.fn()} />
          </FormField>
          <FormField label="Email" error="Invalid email format">
            <FormInput value="invalid" onChange={vi.fn()} />
          </FormField>
          <FormRow columns={2}>
            <FormField label="Price" error="Price must be positive">
              <FormNumberInput value={-10} onChange={vi.fn()} />
            </FormField>
            <FormField label="Stock" error="Stock cannot be negative">
              <FormNumberInput value={-5} onChange={vi.fn()} />
            </FormField>
          </FormRow>
        </FormModal>
      );

      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      expect(screen.getByText('Price must be positive')).toBeInTheDocument();
      expect(screen.getByText('Stock cannot be negative')).toBeInTheDocument();
    });
  });
});
