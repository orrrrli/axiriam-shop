'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Truck,
  Package,
  Hash,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  FileText,
  Loader2,
  Save,
  Receipt,
} from 'lucide-react';
import { Sale, SaleStatus, InventoryItem } from '@/types/inventory';
import { formatPrice, formatDate } from '@/lib/utils/helpers';
import { useSaleMutations } from '@/lib/hooks/use-sale-mutations';
import {
  STATUS_LABELS,
  STATUS_STYLES,
  PLATFORM_ICONS,
  SHIPPING_LABELS,
  LOCAL_SHIPPING_LABELS,
  CARRIER_LABELS,
} from '@/lib/constants/admin/sales.constants';

interface SaleDetailProps {
  sale: Sale;
  itemsById: Record<string, InventoryItem>;
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex items-start gap-[1.2rem] p-[1.4rem] bg-white border border-gray-100 rounded-[0.8rem]">
      <div className="w-[3.2rem] h-[3.2rem] rounded-[0.6rem] bg-[#f5f5f5] flex items-center justify-center shrink-0 text-gray-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[1.1rem] font-medium text-gray-400 uppercase tracking-wide mb-[0.2rem]">
          {label}
        </p>
        <div className="text-[1.4rem] font-semibold text-[#101010] break-words">{value}</div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <h2 className="text-[1.5rem] font-bold text-[#101010] mb-[1.2rem] flex items-center gap-[0.8rem]">
      {children}
    </h2>
  );
}

export default function SaleDetail({ sale, itemsById }: SaleDetailProps): React.ReactElement {
  const router = useRouter();
  const { updating, updateTracking, updateStatus } = useSaleMutations(sale);

  const [currentStatus, setCurrentStatus] = useState<SaleStatus>(sale.status);
  const [trackingInput, setTrackingInput] = useState(sale.trackingNumber ?? '');
  const [trackingSaved, setTrackingSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleStatusChange(status: SaleStatus): Promise<void> {
    setErrorMsg(null);
    const prev = currentStatus;
    setCurrentStatus(status);
    const ok = await updateStatus(status);
    if (!ok) {
      setCurrentStatus(prev);
      setErrorMsg('No se pudo actualizar el estado.');
    }
  }

  async function handleSaveTracking(): Promise<void> {
    setErrorMsg(null);
    setTrackingSaved(false);
    const ok = await updateTracking(trackingInput.trim());
    if (ok) {
      setTrackingSaved(true);
      setTimeout(() => setTrackingSaved(false), 2500);
    } else {
      setErrorMsg('No se pudo guardar el número de rastreo.');
    }
  }

  const subtotal = sale.saleItems.reduce((sum, si) => {
    const item = itemsById[si.itemId];
    return sum + (item ? item.price * si.quantity : 0);
  }, 0) + sale.extras.reduce((sum, e) => sum + e.price * (e.quantity ?? 1), 0);

  return (
    <div className="w-full max-w-[96rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">

      {/* Header */}
      <div className="flex items-center gap-[1.6rem] mb-[3rem]">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-[0.8rem] rounded-[0.8rem] text-gray-400 hover:text-[#101010] hover:bg-gray-100 transition-colors duration-150"
          aria-label="Volver"
        >
          <ArrowLeft className="w-[2rem] h-[2rem]" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[1rem] flex-wrap">
            <h1 className="text-heading text-[2.2rem] font-bold truncate">{sale.name}</h1>
            <span className="text-[1.15rem] text-gray-400 font-mono shrink-0">#{sale.saleRef.slice(-8).toUpperCase()}</span>
          </div>
          <p className="text-subtle text-[1.3rem] mt-[0.2rem]">
            Creado {formatDate(sale.createdAt)}
          </p>
        </div>

        {/* Status selector */}
        <div className="flex items-center gap-[0.8rem] shrink-0">
          {updating && <Loader2 className="w-[1.6rem] h-[1.6rem] animate-spin text-gray-400" />}
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value as SaleStatus)}
            disabled={updating}
            className={`text-[1.3rem] font-bold px-[1.2rem] py-[0.6rem] rounded-[0.6rem] border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#101010]/20 disabled:opacity-60 disabled:cursor-not-allowed ${STATUS_STYLES[currentStatus]}`}
          >
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-[2rem] px-[1.6rem] py-[1.2rem] bg-red-50 border border-red-200 rounded-[0.8rem] text-[1.3rem] text-red-600">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-[1fr_1fr] gap-[2.4rem] max-xs:grid-cols-1">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-[2rem]">

          {/* Customer */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <User className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Cliente
            </SectionTitle>
            <div className="flex flex-col gap-[1rem]">
              <InfoCard
                icon={<User className="w-[1.6rem] h-[1.6rem]" />}
                label="Nombre"
                value={sale.name}
              />
              <InfoCard
                icon={<MessageCircle className="w-[1.6rem] h-[1.6rem]" />}
                label="Red social"
                value={
                  <span>
                    <span className="font-bold text-gray-500 mr-[0.4rem]">
                      {PLATFORM_ICONS[sale.socialMediaPlatform] ?? sale.socialMediaPlatform}
                    </span>
                    @{sale.socialMediaUsername}
                  </span>
                }
              />
              <InfoCard
                icon={<Receipt className="w-[1.6rem] h-[1.6rem]" />}
                label="Factura"
                value={sale.invoiceRequired ? 'Sí, requiere factura' : 'No requiere factura'}
              />
              {sale.deliveryDate && (
                <InfoCard
                  icon={<Clock className="w-[1.6rem] h-[1.6rem]" />}
                  label="Fecha de entrega"
                  value={formatDate(sale.deliveryDate)}
                />
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <Truck className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Envío
            </SectionTitle>
            <div className="flex flex-col gap-[1rem]">
              <InfoCard
                icon={<Truck className="w-[1.6rem] h-[1.6rem]" />}
                label="Tipo de envío"
                value={SHIPPING_LABELS[sale.shippingType] ?? sale.shippingType}
              />
              {sale.shippingType === 'local' && sale.localShippingOption && (
                <InfoCard
                  icon={<MapPin className="w-[1.6rem] h-[1.6rem]" />}
                  label="Opción local"
                  value={LOCAL_SHIPPING_LABELS[sale.localShippingOption]}
                />
              )}
              {sale.localAddress && (
                <InfoCard
                  icon={<MapPin className="w-[1.6rem] h-[1.6rem]" />}
                  label="Dirección"
                  value={sale.localAddress}
                />
              )}
              {sale.shippingType === 'nacional' && sale.nationalShippingCarrier && (
                <InfoCard
                  icon={<Truck className="w-[1.6rem] h-[1.6rem]" />}
                  label="Paquetería"
                  value={CARRIER_LABELS[sale.nationalShippingCarrier]}
                />
              )}
              {sale.shippingDescription && (
                <InfoCard
                  icon={<FileText className="w-[1.6rem] h-[1.6rem]" />}
                  label="Descripción"
                  value={sale.shippingDescription}
                />
              )}
            </div>
          </div>

          {/* Tracking number */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <Hash className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Número de rastreo
            </SectionTitle>
            <div className="flex items-center gap-[1rem]">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => { setTrackingInput(e.target.value); setTrackingSaved(false); }}
                placeholder="Ej. 1Z999AA10123456784"
                className="flex-1 bg-[#f5f5f5] border-0 border-b border-gray-300 px-[1.2rem] py-[1rem] text-[1.4rem] text-heading placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-150"
              />
              <button
                type="button"
                onClick={handleSaveTracking}
                disabled={updating || trackingInput.trim() === (sale.trackingNumber ?? '')}
                className="shrink-0 flex items-center gap-[0.6rem] px-[1.4rem] py-[1rem] bg-[#101010] text-white text-[1.3rem] font-medium rounded-[0.6rem] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#222] transition-colors duration-150"
              >
                {updating ? (
                  <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />
                ) : trackingSaved ? (
                  <CheckCircle className="w-[1.4rem] h-[1.4rem]" />
                ) : (
                  <Save className="w-[1.4rem] h-[1.4rem]" />
                )}
                {trackingSaved ? 'Guardado' : 'Guardar'}
              </button>
            </div>
            {sale.trackingNumber && (
              <p className="mt-[0.8rem] text-[1.2rem] text-gray-400">
                Actual: <span className="font-mono text-[#101010]">{sale.trackingNumber}</span>
              </p>
            )}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-[2rem]">

          {/* Items ordered */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <Package className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Productos
            </SectionTitle>
            {sale.saleItems.length === 0 ? (
              <p className="text-[1.3rem] text-gray-400">Sin productos registrados.</p>
            ) : (
              <div className="flex flex-col divide-y divide-gray-50">
                {sale.saleItems.map((si, idx) => {
                  const item = itemsById[si.itemId];
                  const displayName = si.customDesignName ?? item?.name ?? `Producto #${idx + 1}`;
                  return (
                    <div key={idx} className="flex items-center justify-between py-[1rem] gap-[1.2rem]">
                      <div className="min-w-0">
                        <p className="text-[1.4rem] font-semibold text-heading truncate">{displayName}</p>
                        {si.customDesignName && item?.name && (
                          <p className="text-[1.2rem] text-gray-400">{item.name}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-[1.6rem] shrink-0 text-right">
                        <span className="text-[1.3rem] text-gray-500">×{si.quantity}</span>
                        {item && (
                          <span className="text-[1.4rem] font-semibold text-heading">
                            {formatPrice(item.price * si.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Extras */}
          {sale.extras.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
              <SectionTitle>
                <Receipt className="w-[1.6rem] h-[1.6rem] text-gray-400" />
                Extras
              </SectionTitle>
              <div className="flex flex-col divide-y divide-gray-50">
                {sale.extras.map((e, idx) => (
                  <div key={idx} className="flex items-center justify-between py-[1rem] gap-[1.2rem]">
                    <div className="min-w-0">
                      <p className="text-[1.4rem] font-semibold text-heading truncate">{e.description}</p>
                      {e.quantity && e.quantity > 1 && (
                        <p className="text-[1.2rem] text-gray-400">×{e.quantity}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-[1.2rem] shrink-0">
                      {e.discount ? (
                        <span className="text-[1.2rem] text-green-600">-{formatPrice(e.discount)}</span>
                      ) : null}
                      <span className="text-[1.4rem] font-semibold text-heading">
                        {formatPrice(e.price * (e.quantity ?? 1))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial summary */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <Receipt className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Resumen
            </SectionTitle>
            <div className="flex flex-col gap-[0.8rem]">
              <div className="flex justify-between text-[1.4rem] text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-[1.4rem] text-green-600">
                  <span>Descuento</span>
                  <span>-{formatPrice(sale.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[1.6rem] font-bold text-heading border-t border-gray-100 pt-[0.8rem] mt-[0.4rem]">
                <span>Total</span>
                <span>{formatPrice(sale.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
