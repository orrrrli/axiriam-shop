import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from '@/components/admin/common/molecules/form-field';

describe('FormField Component', () => {
  it('should render label and children', () => {
    render(
      <FormField label="Test Label">
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should display required indicator when required is true', () => {
    render(
      <FormField label="Required Field" required={true}>
        <input type="text" />
      </FormField>
    );
    
    const label = screen.getByText('Required Field');
    expect(label).toBeInTheDocument();
    
    // Check for the asterisk
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-blue-500');
    expect(asterisk).toHaveClass('ml-[0.2rem]');
  });

  it('should not display required indicator when required is false', () => {
    render(
      <FormField label="Optional Field" required={false}>
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText('Optional Field')).toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should not display required indicator when required is undefined', () => {
    render(
      <FormField label="Optional Field">
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText('Optional Field')).toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    render(
      <FormField label="Field with Error" error="This field is required">
        <input type="text" />
      </FormField>
    );
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-500');
    expect(errorMessage).toHaveClass('text-[1.2rem]');
    expect(errorMessage).toHaveClass('mt-[0.4rem]');
  });

  it('should have role="alert" on error message for accessibility', () => {
    render(
      <FormField label="Field with Error" error="Error message">
        <input type="text" />
      </FormField>
    );
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Error message');
  });

  it('should not display error message when error is undefined', () => {
    render(
      <FormField label="Field without Error">
        <input type="text" />
      </FormField>
    );
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should not display error message when error is empty string', () => {
    render(
      <FormField label="Field without Error" error="">
        <input type="text" />
      </FormField>
    );
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should have correct label styling classes', () => {
    render(
      <FormField label="Styled Label">
        <input type="text" />
      </FormField>
    );
    
    const label = screen.getByText('Styled Label');
    expect(label).toHaveClass('block');
    expect(label).toHaveClass('text-[1.2rem]');
    expect(label).toHaveClass('font-medium');
    expect(label).toHaveClass('text-gray-500');
    expect(label).toHaveClass('mb-[0.4rem]');
  });

  it('should render complex children correctly', () => {
    render(
      <FormField label="Complex Field">
        <div>
          <input type="text" placeholder="First input" />
          <input type="text" placeholder="Second input" />
        </div>
      </FormField>
    );
    
    expect(screen.getByPlaceholderText('First input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Second input')).toBeInTheDocument();
  });

  it('should display both required indicator and error message', () => {
    render(
      <FormField label="Field" required={true} error="Invalid value">
        <input type="text" />
      </FormField>
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Invalid value')).toBeInTheDocument();
  });
});
