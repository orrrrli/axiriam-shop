import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormTextarea } from '@/components/admin/common/atoms/FormTextarea';

describe('FormTextarea Component', () => {
  it('should render with value', () => {
    render(<FormTextarea value="test value" onChange={vi.fn()} />);
    const textarea = screen.getByDisplayValue('test value');
    expect(textarea).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const onChange = vi.fn();
    render(<FormTextarea value="" onChange={onChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'new value' } });
    
    expect(onChange).toHaveBeenCalledWith('new value');
  });

  it('should render with placeholder', () => {
    render(<FormTextarea value="" onChange={vi.fn()} placeholder="Enter text" />);
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toBeInTheDocument();
  });

  it('should render with custom rows', () => {
    render(<FormTextarea value="" onChange={vi.fn()} rows={5} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('should default to 3 rows when rows prop is not provided', () => {
    render(<FormTextarea value="" onChange={vi.fn()} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<FormTextarea value="" onChange={vi.fn()} disabled={true} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('should have aria-label when provided', () => {
    render(<FormTextarea value="" onChange={vi.fn()} aria-label="Test textarea" />);
    const textarea = screen.getByLabelText('Test textarea');
    expect(textarea).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    render(<FormTextarea value="" onChange={vi.fn()} />);
    const textarea = screen.getByRole('textbox');
    
    expect(textarea).toHaveClass('w-full');
    expect(textarea).toHaveClass('border');
    expect(textarea).toHaveClass('border-border');
    expect(textarea).toHaveClass('px-[1.6rem]');
    expect(textarea).toHaveClass('py-[1.2rem]');
    expect(textarea).toHaveClass('text-[1.4rem]');
    expect(textarea).toHaveClass('text-heading');
    expect(textarea).toHaveClass('focus:outline-none');
    expect(textarea).toHaveClass('focus:border-border-focus');
    expect(textarea).toHaveClass('resize-vertical');
  });

  it('should have disabled styling classes when disabled', () => {
    render(<FormTextarea value="" onChange={vi.fn()} disabled={true} />);
    const textarea = screen.getByRole('textbox');
    
    expect(textarea).toHaveClass('disabled:bg-body-alt');
    expect(textarea).toHaveClass('disabled:cursor-not-allowed');
  });

  it('should have disabled attribute when disabled', () => {
    render(<FormTextarea value="" onChange={vi.fn()} disabled={true} />);
    const textarea = screen.getByRole('textbox');
    
    expect(textarea).toHaveAttribute('disabled');
  });
});
