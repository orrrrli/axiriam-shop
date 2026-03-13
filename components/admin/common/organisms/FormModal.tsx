'use client';

import { Modal } from './Modal';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  maxWidth?: string;
}

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  isSubmitting = false,
  maxWidth = '54rem',
}: FormModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      footer={
        <>
          <button
            type="button"
            className="button button-muted"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : submitLabel}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-[2rem]">
        {children}
      </form>
    </Modal>
  );
}
