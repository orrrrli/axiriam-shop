import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormModal } from '@/components/admin/common/organisms/form-modal';

describe('FormModal Component', () => {
  describe('Basic Rendering', () => {
    it('should render with title and content when open', () => {
      render(
        <FormModal isOpen={true} onClose={vi.fn()} title="Test Form Modal">
          <div>Form content</div>
        </FormModal>
      );

      expect(screen.getByText('Test Form Modal')).toBeInTheDocument();
      expect(screen.getByText('Form content')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(
        <FormModal isOpen={false} onClose={vi.fn()} title="Test Form Modal">
          <div>Form content</div>
        </FormModal>
      );

      expect(screen.queryByText('Test Form Modal')).not.toBeInTheDocument();
    });

    it('should render footer with default Spanish labels', () => {
      render(
        <FormModal
          isOpen={true}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
          title="Test Form Modal"
        >
          <div>Form content</div>
        </FormModal>
      );

      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Guardar')).toBeInTheDocument();
    });
  });

  describe('Modal Functionality', () => {
    it('should call onClose when backdrop is clicked', () => {
      const onClose = vi.fn();
      render(
        <FormModal isOpen={true} onClose={onClose} title="Test Form Modal">
          <div>Form content</div>
        </FormModal>
      );

      const backdrop = screen.getByRole('dialog');
      fireEvent.click(backdrop);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Escape key is pressed', () => {
      const onClose = vi.fn();
      render(
        <FormModal isOpen={true} onClose={onClose} title="Test Form Modal">
          <div>Form content</div>
        </FormModal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not close when clicking inside the modal content', () => {
      const onClose = vi.fn();
      render(
        <FormModal isOpen={true} onClose={onClose} title="Test Form Modal">
          <div>Form content</div>
        </FormModal>
      );

      const content = screen.getByText('Form content');
      fireEvent.click(content);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit when form is submitted', () => {
      const onSubmit = vi.fn();
      render(
        <FormModal
          isOpen={true}
          onClose={vi.fn()}
          title="Test Form Modal"
          onSubmit={onSubmit}
        >
          <input type="text" />
        </FormModal>
      );

      const submitButton = screen.getByText('Guardar');
      fireEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should prevent default form submission behavior', () => {
      const onSubmit = vi.fn();
      const { container } = render(
        <FormModal
          isOpen={true}
          onClose={vi.fn()}
          title="Test Form Modal"
          onSubmit={onSubmit}
        >
          <input type="text" />
        </FormModal>
      );

      const form = container.querySelector('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form?.dispatchEvent(submitEvent);

      expect(submitEvent.defaultPrevented).toBe(true);
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should call onSubmit when clicking submit button', () => {
      const onSubmit = vi.fn();
      render(
        <FormModal
          isOpen={true}
          onClose={vi.fn()}
          title="Test Form Modal"
          onSubmit={onSubmit}
        >
          <input type="text" />
        </FormModal>
      );

      const submitButton = screen.getByText('Guardar');
      fireEvent.click(submitButton);
      
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Layout', () => {
    it('should apply proper spacing between form fields', () => {
      render(
        <FormModal isOpen={true} onClose={vi.fn()} title="Test Form Modal">
          <div data-testid="field-1">Field 1</div>
          <div data-testid="field-2">Field 2</div>
        </FormModal>
      );

      const form = screen.getByTestId('field-1').parentElement;
      expect(form).toHaveClass('flex', 'flex-col', 'gap-[2rem]');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <FormModal isOpen={true} onClose={vi.fn()} title="Test Form Modal">
          <div>Form content</div>
        </FormModal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should render form element for screen readers', () => {
      const { container } = render(
        <FormModal isOpen={true} onClose={vi.fn()} title="Test Form Modal">
          <input type="text" aria-label="Test input" />
        </FormModal>
      );

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Custom Width', () => {
    it('should accept custom maxWidth prop', () => {
      const { container } = render(
        <FormModal
          isOpen={true}
          onClose={vi.fn()}
          title="Test Form Modal"
          maxWidth="80rem"
        >
          <div>Form content</div>
        </FormModal>
      );

      const modalContent = container.querySelector('.bg-white');
      expect(modalContent).toHaveStyle({ maxWidth: '80rem' });
    });

    it('should use default maxWidth when not specified', () => {
      const { container } = render(
        <FormModal isOpen={true} onClose={vi.fn()} title="Test Form Modal">
          <div>Form content</div>
        </FormModal>
      );

      const modalContent = container.querySelector('.bg-white');
      expect(modalContent).toHaveStyle({ maxWidth: '54rem' });
    });
  });
});
