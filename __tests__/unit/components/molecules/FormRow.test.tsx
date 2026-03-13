import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormRow } from '@/components/admin/common/molecules/FormRow';

describe('FormRow Component', () => {
  it('should render children', () => {
    render(
      <FormRow>
        <div>Field 1</div>
        <div>Field 2</div>
      </FormRow>
    );
    
    expect(screen.getByText('Field 1')).toBeInTheDocument();
    expect(screen.getByText('Field 2')).toBeInTheDocument();
  });

  it('should use 2 columns by default', () => {
    const { container } = render(
      <FormRow>
        <div>Field 1</div>
        <div>Field 2</div>
      </FormRow>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid');
    expect(gridElement).toHaveClass('grid-cols-2');
    expect(gridElement).toHaveClass('gap-[2rem]');
  });

  it('should support 1 column layout', () => {
    const { container } = render(
      <FormRow columns={1}>
        <div>Field 1</div>
      </FormRow>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-1');
  });

  it('should support 2 column layout', () => {
    const { container } = render(
      <FormRow columns={2}>
        <div>Field 1</div>
        <div>Field 2</div>
      </FormRow>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-2');
  });

  it('should support 3 column layout', () => {
    const { container } = render(
      <FormRow columns={3}>
        <div>Field 1</div>
        <div>Field 2</div>
        <div>Field 3</div>
      </FormRow>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-3');
  });

  it('should support 4 column layout', () => {
    const { container } = render(
      <FormRow columns={4}>
        <div>Field 1</div>
        <div>Field 2</div>
        <div>Field 3</div>
        <div>Field 4</div>
      </FormRow>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-4');
  });

  it('should have consistent gap spacing', () => {
    const { container } = render(
      <FormRow>
        <div>Field 1</div>
        <div>Field 2</div>
      </FormRow>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('gap-[2rem]');
  });

  it('should render single child correctly', () => {
    render(
      <FormRow columns={1}>
        <div>Single Field</div>
      </FormRow>
    );
    
    expect(screen.getByText('Single Field')).toBeInTheDocument();
  });

  it('should render multiple children correctly', () => {
    render(
      <FormRow columns={3}>
        <input placeholder="Field 1" />
        <input placeholder="Field 2" />
        <input placeholder="Field 3" />
      </FormRow>
    );
    
    expect(screen.getByPlaceholderText('Field 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Field 2')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Field 3')).toBeInTheDocument();
  });

  it('should work with FormField components as children', () => {
    render(
      <FormRow columns={2}>
        <div>
          <label>Width</label>
          <input type="number" />
        </div>
        <div>
          <label>Height</label>
          <input type="number" />
        </div>
      </FormRow>
    );
    
    expect(screen.getByText('Width')).toBeInTheDocument();
    expect(screen.getByText('Height')).toBeInTheDocument();
  });

  it('should maintain grid layout with different numbers of children', () => {
    const { container } = render(
      <FormRow columns={3}>
        <div>Field 1</div>
        <div>Field 2</div>
      </FormRow>
    );
    
    const gridElement = container.firstChild as HTMLElement;
    // Should still have 3 columns even with only 2 children
    expect(gridElement).toHaveClass('grid-cols-3');
  });
});
