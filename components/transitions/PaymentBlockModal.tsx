'use client';

interface PaymentBlockModalProps {
  onDismiss: () => void;
}

export default function PaymentBlockModal({ onDismiss }: PaymentBlockModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="payment-block-title"
      aria-describedby="payment-block-desc"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 text-center">
        <h2 id="payment-block-title" className="text-lg font-semibold text-gray-900 mb-2">
          Payment in progress
        </h2>
        <p id="payment-block-desc" className="text-sm text-gray-600 mb-6">
          Please don&apos;t leave this page. Your payment is being processed.
        </p>
        <button
          onClick={onDismiss}
          className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Stay on page
        </button>
      </div>
    </div>
  );
}
