'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  MapPin,
  Package,
  CreditCard,
  Truck,
  Hash,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { StoreOrder, StoreOrderStatus, StoreOrderUpdateData } from '@/types/inventory';
import { formatPrice, formatDate } from '@/lib/utils/helpers';
import { VENTA_STATUS_LABELS, VENTA_STATUS_STYLES } from '@/lib/constants/admin/ventas.constants';
import { updateVenta } from '@/lib/services/admin/ventas.service';
import { Button } from '@/components/admin/common';
import { FormField, FormInput, FormSelect } from '@/components/admin/common';

interface VentaDetailProps {
  order: StoreOrder;
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
      <div>
        <p className="text-[1.15rem] font-medium text-gray-400 uppercase tracking-wide mb-[0.2rem]">
          {label}
        </p>
        <div className="text-[1.4rem] font-semibold text-[#101010]">{value}</div>
      </div>
    </div>
  );
}

export default function VentaDetail({ order }: VentaDetailProps): React.ReactElement {
  const router = useRouter();
  const [status, setStatus] = useState<StoreOrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave(): Promise<void> {
    setSaveError(null);
    setSaving(true);
    setSaved(false);
    try {
      const data: StoreOrderUpdateData = {
        status,
        trackingNumber: trackingNumber || undefined,
        isDelivered: status === 'delivered',
        deliveredAt: status === 'delivered' ? new Date().toISOString() : undefined,
      };
      const result = await updateVenta(order.id, data);
      if (result.success) {
        setSaved(true);
      } else {
        setSaveError(result.error);
      }
    } finally {
      setSaving(false);
    }
  }

  const statusOptions = Object.entries(VENTA_STATUS_LABELS).map(([v, l]) => ({
    value: v,
    label: l,
  }));

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
        <div className="flex-1">
          <div className="flex items-center gap-[1rem] flex-wrap">
            <h1 className="text-heading text-[2.2rem] font-bold">
              #{order.id.slice(-8).toUpperCase()}
            </h1>
            <span
              className={`inline-block px-[1rem] py-[0.3rem] rounded-full text-[1.1rem] font-semibold ${VENTA_STATUS_STYLES[order.status]}`}
            >
              {VENTA_STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-subtle text-[1.3rem] mt-[0.3rem]">
            Creado {formatDate(order.createdAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/inventory/ventas')}
          className="button button-muted text-[1.3rem]"
        >
          Ver todos
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_2fr] gap-[2.4rem] max-xs:grid-cols-1">
        {/* Left column */}
        <div className="flex flex-col gap-[1.6rem]">
          {/* Customer */}
          <div className="bg-white border border-gray-100 rounded-[1rem] p-[2rem]">
            <h2 className="text-[1.4rem] font-bold text-heading mb-[1.6rem] flex items-center gap-[0.8rem]">
              <User className="w-[1.6rem] h-[1.6rem] text-gray-400" /> Cliente
            </h2>
            <div className="flex flex-col gap-[0.6rem]">
              <p className="text-[1.4rem] font-semibold text-heading">{order.customer.name}</p>
              <p className="text-[1.3rem] text-subtle">{order.customer.email}</p>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="bg-white border border-gray-100 rounded-[1rem] p-[2rem]">
              <h2 className="text-[1.4rem] font-bold text-heading mb-[1.6rem] flex items-center gap-[0.8rem]">
                <MapPin className="w-[1.6rem] h-[1.6rem] text-gray-400" /> Dirección de Envío
              </h2>
              <div className="flex flex-col gap-[0.4rem] text-[1.3rem] text-paragraph">
                <p className="font-semibold text-heading">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="text-subtle">{order.shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white border border-gray-100 rounded-[1rem] p-[2rem]">
            <h2 className="text-[1.4rem] font-bold text-heading mb-[1.6rem] flex items-center gap-[0.8rem]">
              <CreditCard className="w-[1.6rem] h-[1.6rem] text-gray-400" /> Pago
            </h2>
            <div className="flex flex-col gap-[1rem]">
              <InfoCard
                icon={<CreditCard className="w-[1.6rem] h-[1.6rem]" />}
                label="Método"
                value={order.paymentMethod}
              />
              <InfoCard
                icon={<Hash className="w-[1.6rem] h-[1.6rem]" />}
                label="Estado"
                value={
                  <span className={`inline-block px-[0.8rem] py-[0.2rem] text-[1.1rem] font-semibold rounded-[0.4rem] ${order.isPaid ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fce4ec] text-[#c62828]'}`}>
                    {order.isPaid ? 'Pagado' : 'Sin pagar'}
                  </span>
                }
              />
              {order.paidAt && (
                <InfoCard
                  icon={<Hash className="w-[1.6rem] h-[1.6rem]" />}
                  label="Fecha de pago"
                  value={formatDate(order.paidAt)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[1.6rem]">
          {/* Items */}
          <div className="bg-white border border-gray-100 rounded-[1rem] p-[2rem]">
            <h2 className="text-[1.4rem] font-bold text-heading mb-[1.6rem] flex items-center gap-[0.8rem]">
              <Package className="w-[1.6rem] h-[1.6rem] text-gray-400" /> Productos
            </h2>
            <div className="flex flex-col divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-[1.2rem] first:pt-0 last:pb-0">
                  <div>
                    <p className="text-[1.3rem] font-semibold text-heading">{item.name}</p>
                    <p className="text-[1.2rem] text-subtle">Cant. {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[1.3rem] font-bold text-heading">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-[1.2rem] text-subtle">{formatPrice(item.price)} c/u</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-white border border-gray-100 rounded-[1rem] p-[2rem]">
            <h2 className="text-[1.4rem] font-bold text-heading mb-[1.6rem]">Resumen de Pago</h2>
            <div className="flex flex-col gap-[0.8rem] text-[1.3rem]">
              <div className="flex justify-between text-paragraph">
                <span>Subtotal</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-paragraph">
                <span>Impuestos</span>
                <span>{formatPrice(order.taxPrice)}</span>
              </div>
              <div className="flex justify-between text-paragraph">
                <span>Envío</span>
                <span>{order.shippingPrice === 0 ? 'Gratis' : formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-heading text-[1.5rem] pt-[0.8rem] border-t border-gray-100">
                <span>Total</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Status & tracking update */}
          <div className="bg-white border border-gray-100 rounded-[1rem] p-[2rem]">
            <h2 className="text-[1.4rem] font-bold text-heading mb-[1.6rem] flex items-center gap-[0.8rem]">
              <Truck className="w-[1.6rem] h-[1.6rem] text-gray-400" /> Gestionar Pedido
            </h2>
            <div className="flex flex-col gap-[1.6rem]">
              <FormField label="Estado">
                <FormSelect
                  value={status}
                  onChange={(v) => setStatus(v as StoreOrderStatus)}
                  options={statusOptions}
                  aria-label="Estado del pedido"
                />
              </FormField>
              <FormField label="Número de seguimiento">
                <FormInput
                  value={trackingNumber}
                  onChange={setTrackingNumber}
                  placeholder="Ej. WC123ABC"
                  aria-label="Número de seguimiento"
                />
              </FormField>

              <div className="flex items-center justify-between gap-[1.2rem]">
                {saveError ? (
                  <p className="flex items-center gap-[0.6rem] text-[1.2rem] text-red-500">
                    <AlertCircle className="w-[1.4rem] h-[1.4rem] shrink-0" />
                    {saveError}
                  </p>
                ) : saved ? (
                  <p className="text-[1.2rem] text-[#2e7d32] font-medium">Cambios guardados</p>
                ) : (
                  <span />
                )}
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />}
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
