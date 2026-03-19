import jsPDF from 'jspdf';
import { Quote, QuoteFormData, QuoteItem, SaleExtra } from '@/types/inventory';

// ─── Brand constants ────────────────────────────────────────────────────────

const BRAND = {
  name: 'AXIRIAM',
  tagline: 'Gorros Quirúrgicos',
  location: 'Ensenada, Baja California',
  instagram: '@axiriam',
} as const;

const COLOR = {
  primary: [16, 16, 16] as const,       // #101010
  accent: [26, 143, 227] as const,       // #1A8FE3
  dark: [42, 42, 42] as const,           // #2a2a2a
  heading: [26, 26, 26] as const,        // #1a1a1a
  paragraph: [74, 74, 74] as const,      // #4a4a4a
  subtle: [129, 129, 129] as const,      // #818181
  border: [225, 225, 225] as const,      // #e1e1e1
  bgAlt: [245, 247, 250] as const,       // #F5F7FA
  white: [255, 255, 255] as const,
  success: [46, 125, 50] as const,       // #2e7d32
  warning: [228, 165, 31] as const,      // #e4a51f
  danger: [198, 40, 40] as const,        // #c62828
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function getItemDescription(item: QuoteItem): string {
  if (item.description) return item.description;
  const name = item.manualName || item.itemId;
  const details = [item.manualCategory, item.manualType].filter(Boolean).join(' · ');
  return details ? `${name} (${details})` : name;
}

function fmt(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function setColor(doc: jsPDF, color: readonly [number, number, number], type: 'text' | 'fill' | 'draw'): void {
  if (type === 'text') doc.setTextColor(color[0], color[1], color[2]);
  else if (type === 'fill') doc.setFillColor(color[0], color[1], color[2]);
  else doc.setDrawColor(color[0], color[1], color[2]);
}

// ─── Page footer (called on every page) ─────────────────────────────────────

function addPageFooter(doc: jsPDF, pageNum: number, totalPages: number): void {
  const pw = doc.internal.pageSize.width;
  const ph = doc.internal.pageSize.height;
  const m = 20;

  // Separator line
  setColor(doc, COLOR.border, 'draw');
  doc.setLineWidth(0.3);
  doc.line(m, ph - 22, pw - m, ph - 22);

  // Brand name left
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLOR.primary, 'text');
  doc.text(BRAND.name, m, ph - 16);

  // Contact info
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLOR.subtle, 'text');
  doc.setFontSize(7);
  doc.text(`${BRAND.tagline} | ${BRAND.location} | Instagram: ${BRAND.instagram}`, m, ph - 11);

  // Page number right
  doc.text(`Página ${pageNum} de ${totalPages}`, pw - m, ph - 16, { align: 'right' });

  // Disclaimer
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Esta cotización es válida hasta la fecha indicada. Los precios pueden estar sujetos a cambios.',
    pw / 2, ph - 6,
    { align: 'center' }
  );
}

// ─── Section header helper ──────────────────────────────────────────────────

function sectionHeader(doc: jsPDF, text: string, y: number, margin: number, pw: number): number {
  setColor(doc, COLOR.accent, 'draw');
  doc.setLineWidth(1.5);
  doc.line(margin, y, margin + 24, y);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLOR.heading, 'text');
  doc.text(text, margin + 28, y + 0.5);

  setColor(doc, COLOR.border, 'draw');
  doc.setLineWidth(0.3);
  doc.line(margin + 28 + doc.getTextWidth(text) + 4, y, pw - margin, y);

  return y + 10;
}

// ─── Main generator ─────────────────────────────────────────────────────────

function generatePDF(
  data: QuoteFormData | Quote,
  quoteNumber?: string
): void {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.width;
  const ph = doc.internal.pageSize.height;
  const m = 20;
  const contentWidth = pw - 2 * m;
  let y = m;
  const displayNumber = quoteNumber || ('quoteNumber' in data ? data.quoteNumber : 'DRAFT');

  // Helper: check page break
  function checkPageBreak(needed: number): void {
    if (y + needed > ph - 30) {
      doc.addPage();
      y = m;
    }
  }

  // ═══ HEADER ═══════════════════════════════════════════════════════════════

  // Top accent bar
  setColor(doc, COLOR.primary, 'fill');
  doc.rect(0, 0, pw, 4, 'F');

  // Accent line under bar
  setColor(doc, COLOR.accent, 'fill');
  doc.rect(0, 4, pw, 1.5, 'F');

  y = 20;

  // Brand name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLOR.primary, 'text');
  doc.text(BRAND.name, m, y);

  // Tagline
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLOR.subtle, 'text');
  doc.text(`${BRAND.tagline} | ${BRAND.location}`, m, y + 6);

  // Right side: COTIZACIÓN label
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLOR.heading, 'text');
  doc.text('COTIZACIÓN', pw - m, y, { align: 'right' });

  y += 14;

  // Quote info (right side)
  const infoRightX = pw - m;
  doc.setFontSize(8);

  doc.setFont('helvetica', 'bold');
  setColor(doc, COLOR.paragraph, 'text');
  doc.text('Folio:', infoRightX - 68, y + 3);
  doc.text('Fecha:', infoRightX - 68, y + 10);
  doc.text('Válida hasta:', infoRightX - 68, y + 17);

  doc.setFont('helvetica', 'normal');
  setColor(doc, COLOR.heading, 'text');
  doc.text(displayNumber, infoRightX, y + 3, { align: 'right' });
  doc.text(new Date().toLocaleDateString('es-MX'), infoRightX, y + 10, { align: 'right' });
  doc.text(new Date(data.validUntil).toLocaleDateString('es-MX'), infoRightX, y + 17, { align: 'right' });

  y += 26;

  // Separator
  setColor(doc, COLOR.border, 'draw');
  doc.setLineWidth(0.3);
  doc.line(m, y, pw - m, y);
  y += 8;

  // ═══ CLIENT INFO ══════════════════════════════════════════════════════════

  y = sectionHeader(doc, 'INFORMACIÓN DEL CLIENTE', y, m, pw);

  const clientFields: [string, string | undefined][] = [
    ['Nombre', data.clientName],
    ['Empresa', data.clientCompany],
    ['Email', data.clientEmail],
    ['Teléfono', data.clientPhone],
    ['Forma de pago', data.paymentMethod],
  ];

  doc.setFontSize(9);
  for (const [label, value] of clientFields) {
    if (!value) continue;
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLOR.paragraph, 'text');
    doc.text(`${label}:`, m + 2, y);
    doc.setFont('helvetica', 'normal');
    setColor(doc, COLOR.heading, 'text');
    doc.text(value, m + 36, y);
    y += 6;
  }

  y += 6;

  // ═══ ITEMS TABLE ══════════════════════════════════════════════════════════

  y = sectionHeader(doc, 'PRODUCTOS Y SERVICIOS', y, m, pw);

  // Column positions
  const cols = {
    desc: m,
    qty: m + 80,
    price: m + 100,
    disc: m + 126,
    total: m + 148,
  };

  // Table header row
  setColor(doc, COLOR.primary, 'fill');
  doc.roundedRect(m, y - 5, contentWidth, 9, 1.5, 1.5, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLOR.white, 'text');
  doc.text('DESCRIPCIÓN', cols.desc + 4, y);
  doc.text('CANT.', cols.qty + 2, y);
  doc.text('P. UNIT.', cols.price + 2, y);
  doc.text('DESC.', cols.disc + 2, y);
  doc.text('TOTAL', cols.total + 2, y);
  y += 8;

  // Item rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const rowPad = 3; // vertical padding inside each row
  data.items.forEach((item, index) => {
    const description = getItemDescription(item);
    const lineDiscount = Math.max(0, item.discount ?? 0);
    const total = Math.max(0, item.quantity * item.unitPrice - lineDiscount);

    const descLines = doc.splitTextToSize(description, 74);
    const textH = descLines.length * 4.5;
    const rowH = textH + rowPad * 2;

    checkPageBreak(rowH + 2);

    // Alternating row bg
    if (index % 2 === 0) {
      setColor(doc, COLOR.bgAlt, 'fill');
      doc.rect(m, y, contentWidth, rowH, 'F');
    }

    const textY = y + rowPad + 3; // +3 accounts for font baseline offset
    setColor(doc, COLOR.heading, 'text');
    doc.text(descLines, cols.desc + 4, textY);

    setColor(doc, COLOR.paragraph, 'text');
    doc.text(String(item.quantity), cols.qty + 6, textY);
    doc.text(fmt(item.unitPrice), cols.price + 2, textY);
    doc.text(lineDiscount > 0 ? fmt(lineDiscount) : '—', cols.disc + 2, textY);

    doc.setFont('helvetica', 'bold');
    setColor(doc, COLOR.heading, 'text');
    doc.text(fmt(total), cols.total + 2, textY);
    doc.setFont('helvetica', 'normal');

    y += rowH;
  });

  // Bottom border of table
  setColor(doc, COLOR.border, 'draw');
  doc.setLineWidth(0.3);
  doc.line(m, y, pw - m, y);
  y += 4;

  // ═══ EXTRAS ═══════════════════════════════════════════════════════════════

  if (data.extras && data.extras.length > 0) {
    y += 4;
    y = sectionHeader(doc, 'EXTRAS', y, m, pw);

    // Table header
    setColor(doc, COLOR.dark, 'fill');
    doc.roundedRect(m, y - 5, contentWidth, 9, 1.5, 1.5, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    setColor(doc, COLOR.white, 'text');
    doc.text('DESCRIPCIÓN', cols.desc + 4, y);
    doc.text('CANT.', cols.qty + 2, y);
    doc.text('PRECIO', cols.price + 2, y);
    doc.text('DESC.', cols.disc + 2, y);
    doc.text('TOTAL', cols.total + 2, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    data.extras.forEach((extra: SaleExtra, index: number) => {
      const qty = extra.quantity ?? 1;
      const extraDiscount = Math.max(0, extra.discount ?? 0);
      const extraTotal = Math.max(0, extra.price * qty - extraDiscount);

      const descLines = doc.splitTextToSize(extra.description, 74);
      const textH = descLines.length * 4.5;
      const eRowH = textH + rowPad * 2;

      checkPageBreak(eRowH + 2);

      if (index % 2 === 0) {
        setColor(doc, COLOR.bgAlt, 'fill');
        doc.rect(m, y, contentWidth, eRowH, 'F');
      }

      const textY = y + rowPad + 3;
      doc.setFontSize(8.5);
      setColor(doc, COLOR.heading, 'text');
      doc.text(descLines, cols.desc + 4, textY);

      setColor(doc, COLOR.paragraph, 'text');
      doc.text(String(qty), cols.qty + 6, textY);
      doc.text(fmt(extra.price), cols.price + 2, textY);
      doc.text(extraDiscount > 0 ? fmt(extraDiscount) : '—', cols.disc + 2, textY);

      doc.setFont('helvetica', 'bold');
      setColor(doc, COLOR.heading, 'text');
      doc.text(fmt(extraTotal), cols.total + 2, textY);
      doc.setFont('helvetica', 'normal');

      y += eRowH;
    });

    setColor(doc, COLOR.border, 'draw');
    doc.setLineWidth(0.3);
    doc.line(m, y, pw - m, y);
    y += 4;
  }

  // ═══ TOTALS BOX ═══════════════════════════════════════════════════════════

  y += 6;
  checkPageBreak(50);

  const itemsTotal = data.items.reduce((sum, item) => {
    return sum + Math.max(0, item.quantity * item.unitPrice - Math.max(0, item.discount ?? 0));
  }, 0);

  const extrasTotal = (data.extras ?? []).reduce((sum: number, extra: SaleExtra) => {
    const qty = extra.quantity ?? 1;
    return sum + Math.max(0, extra.price * qty - Math.max(0, extra.discount ?? 0));
  }, 0);

  const baseSubtotal = itemsTotal + extrasTotal;
  const generalDiscount = Math.max(0, data.discount ?? 0);
  const discountedSubtotal = Math.max(0, baseSubtotal - generalDiscount);
  const ivaRate = (data.iva ?? 0) / 100;
  const includingIva = data.includingIva ?? true;
  const ivaAmount = includingIva ? 0 : discountedSubtotal * ivaRate;
  const grandTotal = includingIva ? discountedSubtotal : discountedSubtotal + ivaAmount;
  const ivaPercentage = Math.round(data.iva ?? 0);

  // Totals box positioned right
  const totBoxW = 82;
  const totBoxX = pw - m - totBoxW;

  setColor(doc, COLOR.bgAlt, 'fill');
  setColor(doc, COLOR.border, 'draw');
  doc.setLineWidth(0.4);

  // Calculate box height
  let totLines = 2; // subtotal + total
  if (generalDiscount > 0) totLines++;
  totLines++; // IVA line
  const totBoxH = totLines * 8 + 14; // lines + total separator space

  doc.roundedRect(totBoxX, y - 2, totBoxW, totBoxH, 2, 2, 'FD');

  const tl = totBoxX + 4;
  const tr = totBoxX + totBoxW - 4;
  let ty = y + 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, COLOR.paragraph, 'text');
  doc.text('Subtotal', tl, ty);
  setColor(doc, COLOR.heading, 'text');
  doc.text(fmt(baseSubtotal), tr, ty, { align: 'right' });
  ty += 8;

  if (generalDiscount > 0) {
    setColor(doc, COLOR.paragraph, 'text');
    doc.text('Descuento', tl, ty);
    setColor(doc, COLOR.danger, 'text');
    doc.text(`-${fmt(generalDiscount)}`, tr, ty, { align: 'right' });
    ty += 8;
  }

  setColor(doc, COLOR.paragraph, 'text');
  if (includingIva) {
    doc.text(`IVA (${ivaPercentage}%) incluido`, tl, ty);
  } else {
    doc.text(`IVA (${ivaPercentage}%)`, tl, ty);
    setColor(doc, COLOR.heading, 'text');
    doc.text(fmt(ivaAmount), tr, ty, { align: 'right' });
  }
  ty += 6;

  // Total separator
  setColor(doc, COLOR.primary, 'draw');
  doc.setLineWidth(0.8);
  doc.line(tl, ty, tr, ty);
  ty += 7;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLOR.primary, 'text');
  doc.text('TOTAL', tl, ty);
  doc.text(fmt(grandTotal), tr, ty, { align: 'right' });

  y += totBoxH + 6;

  // ═══ NOTES ════════════════════════════════════════════════════════════════

  if (data.notes?.trim()) {
    y += 4;
    checkPageBreak(30);
    y = sectionHeader(doc, 'NOTAS', y, m, pw);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    setColor(doc, COLOR.paragraph, 'text');
    const noteLines = doc.splitTextToSize(data.notes, contentWidth - 8);

    // Notes box
    const notesH = noteLines.length * 4.5 + 8;
    setColor(doc, COLOR.bgAlt, 'fill');
    setColor(doc, COLOR.border, 'draw');
    doc.setLineWidth(0.3);
    doc.roundedRect(m, y - 4, contentWidth, notesH, 2, 2, 'FD');

    setColor(doc, COLOR.paragraph, 'text');
    doc.text(noteLines, m + 4, y + 1);
    y += notesH + 2;
  }

  // ═══ FOOTERS ══════════════════════════════════════════════════════════════

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addPageFooter(doc, i, pageCount);
  }

  // ═══ SAVE ═════════════════════════════════════════════════════════════════

  const fileName = `Cotizacion_${displayNumber}_${data.clientName.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function generateQuotePDFFromFormData(formData: QuoteFormData, quoteNumber?: string): void {
  generatePDF(formData, quoteNumber ?? 'DRAFT');
}

export function generateQuotePDFFromQuote(quote: Quote): void {
  generatePDF(quote);
}
