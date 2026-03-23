'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Hash,
  Truck,
  Package,
  User,
  CalendarDays,
  Loader2,
  Save,
  CheckCircle,
} from 'lucide-react';
import { OrderMaterial, OrderMaterialStatus, RawMaterial } from '@/types/inventory';
import { formatDate } from '@/lib/utils/helpers';
import { updateOrder } from '@/lib/services/admin/orders.service';
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from '@/lib/constants/admin/orders.constants';
import { WAREHOUSE_TYPE_LABELS } from '@/lib/constants/admin/warehouse.constants';

interface OrderDetailProps {
  order: OrderMaterial;
  materialsById: Record<string, RawMaterial>;
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

export default function OrderDetail({ order, materialsById }: OrderDetailProps): React.ReactElement {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderMaterialStatus>(order.status);
  const [trackingInput, setTrackingInput] = useState(order.trackingNumber ?? '');
  const [trackingSaved, setTrackingSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleStatusChange(status: OrderMaterialStatus): Promise<void> {
    setErrorMsg(null);
    const prev = currentStatus;
    setCurrentStatus(status);
    setUpdating(true);
    try {
      const result = await updateOrder(order.id, { ...order, status } as any);
      if (!result.success) {
        setCurrentStatus(prev);
        setErrorMsg('No se pudo actualizar el estado.');
      }
    } finally {
      setUpdating(false);
    }
  }

  async function handleSaveTracking(): Promise<void> {
    setErrorMsg(null);
    setTrackingSaved(false);
    setUpdating(true);
    try {
      const result = await updateOrder(order.id, { ...order, trackingNumber: trackingInput.trim() } as any);
      if (result.success) {
        setTrackingSaved(true);
        setTimeout(() => setTrackingSaved(false), 2500);
      } else {
        setErrorMsg('No se pudo guardar el número de rastreo.');
      }
    } finally {
      setUpdating(false);
    }
  }

  const allDesigns = order.materials.flatMap((g) => g.designs);

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
          <h1 className="text-heading text-[2.2rem] font-bold font-mono uppercase truncate">
            {order.description || '—'}
          </h1>
          <p className="text-subtle text-[1.3rem] mt-[0.2rem]">Creado {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-[0.8rem] shrink-0">
          {updating && <Loader2 className="w-[1.6rem] h-[1.6rem] animate-spin text-gray-400" />}
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value as OrderMaterialStatus)}
            disabled={updating}
            className={`text-[1.3rem] font-bold px-[1.2rem] py-[0.6rem] rounded-[0.6rem] border-0 cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${ORDER_STATUS_STYLES[currentStatus]}`}
          >
            {Object.entries(ORDER_STATUS_LABELS).map(([v, l]) => (
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
        {/* Left column */}
        <div className="flex flex-col gap-[2rem]">
          {/* Order info */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <User className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Información del Pedido
            </SectionTitle>
            <div className="flex flex-col gap-[1rem]">
              {order.distributor && (
                <InfoCard
                  icon={<User className="w-[1.6rem] h-[1.6rem]" />}
                  label="Proveedor"
                  value={order.distributor}
                />
              )}
              {order.parcel_service && (
                <InfoCard
                  icon={<Truck className="w-[1.6rem] h-[1.6rem]" />}
                  label="Paquetería"
                  value={order.parcel_service}
                />
              )}
              <InfoCard
                icon={<CalendarDays className="w-[1.6rem] h-[1.6rem]" />}
                label="Fecha"
                value={formatDate(order.createdAt)}
              />
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <Hash className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Número de Rastreo
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
                disabled={updating || trackingInput.trim() === (order.trackingNumber ?? '')}
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
            {order.trackingNumber && (
              <p className="mt-[0.8rem] text-[1.2rem] text-gray-400">
                Actual: <span className="font-mono text-[#101010]">{order.trackingNumber}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[2rem]">
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <Package className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Materiales ({allDesigns.length})
            </SectionTitle>
            {allDesigns.length === 0 ? (
              <p className="text-[1.3rem] text-gray-400">Sin materiales registrados.</p>
            ) : (
              <div className="flex flex-col divide-y divide-gray-50">
                {allDesigns.map((design, idx) => {
                  const mat = materialsById[design.rawMaterialId];
                  const name = design.customDesignName ?? mat?.name ?? `Material #${idx + 1}`;
                  return (
                    <div key={idx} className="flex items-center justify-between py-[1rem] gap-[1.2rem]">
                      <div className="min-w-0">
                        <p className="text-[1.4rem] font-semibold text-heading truncate">{name}</p>
                        {design.type && (
                          <p className="text-[1.2rem] text-gray-400">
                            {WAREHOUSE_TYPE_LABELS[design.type] ?? design.type}
                          </p>
                        )}
                      </div>
                      <span className="text-[1.3rem] font-semibold text-gray-500 shrink-0">
                        ×{design.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
