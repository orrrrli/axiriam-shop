import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/admin/common/atoms/Button';

describe('Button Component', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button');
    expect(button).not.toHaveClass('button-muted');
    expect(button).not.toHaveClass('button-danger');
  });

  it('should render secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button-muted');
  });

  it('should render danger variant', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button-danger');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled={true}>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled={true}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should have type="button" by default', () => {
    render(<Button>Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should support custom type prop', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should support additional className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should combine variant and custom className', () => {
    render(<Button variant="secondary" className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button-muted');
    expect(button).toHaveClass('custom-class');
  });
});
