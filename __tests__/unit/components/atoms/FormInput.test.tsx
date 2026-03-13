import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormInput } from '@/components/admin/common/atoms/FormInput';

describe('FormInput Component', () => {
  it('should render with value', () => {
    render(<FormInput value="test value" onChange={vi.fn()} />);
    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const onChange = vi.fn();
    render(<FormInput value="" onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(onChange).toHaveBeenCalledWith('new value');
  });

  it('should render with placeholder', () => {
    render(<FormInput value="" onChange={vi.fn()} placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<FormInput value="" onChange={vi.fn()} disabled={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should have aria-label when provided', () => {
    render(<FormInput value="" onChange={vi.fn()} aria-label="Test input" />);
    const input = screen.getByLabelText('Test input');
    expect(input).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    render(<FormInput value="" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('border');
    expect(input).toHaveClass('border-border');
    expect(input).toHaveClass('px-[1.6rem]');
    expect(input).toHaveClass('py-[1.2rem]');
    expect(input).toHaveClass('text-[1.4rem]');
    expect(input).toHaveClass('text-heading');
    expect(input).toHaveClass('focus:outline-none');
    expect(input).toHaveClass('focus:border-border-focus');
  });

  it('should have disabled styling classes when disabled', () => {
    render(<FormInput value="" onChange={vi.fn()} disabled={true} />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveClass('disabled:bg-body-alt');
    expect(input).toHaveClass('disabled:cursor-not-allowed');
  });

  it('should have disabled attribute when disabled', () => {
    render(<FormInput value="" onChange={vi.fn()} disabled={true} />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveAttribute('disabled');
  });
});
