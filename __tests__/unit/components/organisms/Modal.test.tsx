import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Modal } from '@/components/admin/common/organisms/modal';

describe('Modal Component', () => {
  beforeEach(() => {
    // Reset body overflow before each test
    document.body.style.overflow = '';
  });

  afterEach(() => {
    cleanup();
    // Clean up body overflow after each test
    document.body.style.overflow = '';
  });

  it('should render with title and content when open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when modal content is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    const content = screen.getByText('Content');
    fireEvent.click(content);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when other keys are pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Tab' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    
    const title = screen.getByText('Test Modal');
    expect(title).toHaveAttribute('id', 'modal-title');
  });

  it('should lock body scroll when open', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('');
  });

  it('should render footer when provided', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Test Modal"
        footer={
          <>
            <button>Cancel</button>
            <button>Save</button>
          </>
        }
      >
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should not render footer when not provided', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    // Check that there's no footer div with border-t class
    const footerDiv = container.querySelector('.border-t');
    expect(footerDiv).not.toBeInTheDocument();
  });

  it('should apply custom maxWidth', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal" maxWidth="80rem">
        <p>Content</p>
      </Modal>
    );

    const modalContent = container.querySelector('.bg-white');
    expect(modalContent).toHaveStyle({ maxWidth: '80rem' });
  });

  it('should apply default maxWidth when not specified', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    const modalContent = container.querySelector('.bg-white');
    expect(modalContent).toHaveStyle({ maxWidth: '54rem' });
  });

  it('should clean up event listeners on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    unmount();

    // After unmount, pressing Escape should not call onClose
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();

    // Body overflow should be restored
    expect(document.body.style.overflow).toBe('');
  });
});
