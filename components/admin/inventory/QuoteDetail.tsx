import { Quote } from '@/types/inventory';

interface QuoteDetailProps {
  quote: Quote;
  onClose: () => void;
  onDownloadPDF: (quote: Quote) => void;
}

// TODO: Implement full quote detail view with client info, items breakdown, totals, status
export default function QuoteDetail({ quote, onClose }: QuoteDetailProps): React.ReactElement {
  return (
    <div className="p-[2rem] text-center text-gray-400 text-[1.4rem]">
      <p>Detalle de cotización <strong>{quote.quoteNumber}</strong> pendiente de implementar</p>
      <button
        type="button"
        className="button button-muted mt-[1.6rem]"
        onClick={onClose}
      >
        Cerrar
      </button>
    </div>
  );
}
