import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormRow } from '@/components/admin/common/molecules/FormRow';
import { FormField } from '@/components/admin/common/molecules/FormField';
import { FormInput } from '@/components/admin/common/atoms/FormInput';
import { FormNumberInput } from '@/components/admin/common/atoms/FormNumberInput';

describe('FormRow Integration Tests', () => {
  it('should integrate with FormField and FormInput components', () => {
    render(
      <FormRow columns={2}>
        <FormField label="First Name" required>
          <FormInput value="" onChange={() => {}} placeholder="Enter first name" />
        </FormField>
        <FormField label="Last Name">
          <FormInput value="" onChange={() => {}} placeholder="Enter last name" />
        </FormField>
      </FormRow>
    );
    
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter first name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter last name')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument(); // Required indicator
  });

  it('should integrate with FormField and FormNumberInput for dimensions', () => {
    render(
      <FormRow columns={2}>
        <FormField label="Ancho (m)">
          <FormNumberInput value={0} onChange={() => {}} min={0} step={0.01} />
        </FormField>
        <FormField label="Alto (m)">
          <FormNumberInput value={0} onChange={() => {}} min={0} step={0.01} />
        </FormField>
      </FormRow>
    );
    
    expect(screen.getByText('Ancho (m)')).toBeInTheDocument();
    expect(screen.getByText('Alto (m)')).toBeInTheDocument();
    
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);
  });

  it('should integrate with FormField showing errors in a row', () => {
    render(
      <FormRow columns={2}>
        <FormField label="Width" error="Width is required">
          <FormNumberInput value={0} onChange={() => {}} />
        </FormField>
        <FormField label="Height" error="Height must be positive">
          <FormNumberInput value={0} onChange={() => {}} />
        </FormField>
      </FormRow>
    );
    
    expect(screen.getByText('Width is required')).toBeInTheDocument();
    expect(screen.getByText('Height must be positive')).toBeInTheDocument();
    
    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(2);
  });

  it('should support 3-column layout for stock and pricing fields', () => {
    render(
      <FormRow columns={3}>
        <FormField label="Completo">
          <FormNumberInput value={0} onChange={() => {}} min={0} />
        </FormField>
        <FormField label="Sencillo">
          <FormNumberInput value={0} onChange={() => {}} min={0} />
        </FormField>
        <FormField label="Precio">
          <FormNumberInput value={0} onChange={() => {}} min={0} step={0.01} />
        </FormField>
      </FormRow>
    );
    
    expect(screen.getByText('Completo')).toBeInTheDocument();
    expect(screen.getByText('Sencillo')).toBeInTheDocument();
    expect(screen.getByText('Precio')).toBeInTheDocument();
    
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(3);
  });

  it('should maintain proper spacing between fields in a row', () => {
    const { container } = render(
      <FormRow columns={2}>
        <FormField label="Field 1">
          <FormInput value="" onChange={() => {}} />
        </FormField>
        <FormField label="Field 2">
          <FormInput value="" onChange={() => {}} />
        </FormField>
      </FormRow>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('gap-[2rem]');
  });

  it('should work with mixed field types in a row', () => {
    render(
      <FormRow columns={2}>
        <FormField label="Name">
          <FormInput value="" onChange={() => {}} />
        </FormField>
        <FormField label="Quantity">
          <FormNumberInput value={0} onChange={() => {}} />
        </FormField>
      </FormRow>
    );
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('should handle single field in a row', () => {
    render(
      <FormRow columns={1}>
        <FormField label="Description">
          <FormInput value="" onChange={() => {}} />
        </FormField>
      </FormRow>
    );
    
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should support responsive layouts with different column counts', () => {
    const { container, rerender } = render(
      <FormRow columns={2}>
        <FormField label="Field 1">
          <FormInput value="" onChange={() => {}} />
        </FormField>
        <FormField label="Field 2">
          <FormInput value="" onChange={() => {}} />
        </FormField>
      </FormRow>
    );
    
    let gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-2');
    
    rerender(
      <FormRow columns={1}>
        <FormField label="Field 1">
          <FormInput value="" onChange={() => {}} />
        </FormField>
        <FormField label="Field 2">
          <FormInput value="" onChange={() => {}} />
        </FormField>
      </FormRow>
    );
    
    gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-1');
  });
});
