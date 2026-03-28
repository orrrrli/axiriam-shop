'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, Package } from 'lucide-react';
import { RawMaterial, MaterialType } from '@/types/inventory';
import { WAREHOUSE_TYPE_LABELS } from '@/lib/constants/admin/warehouse.constants';
import { useOrderMutations } from '@/lib/hooks/use-order-mutations';

const INPUT =
  'w-full bg-white border border-border text-heading text-[1.4rem] px-[1.2rem] py-[1rem] rounded-[0.4rem] placeholder-gray-400 focus:outline-none focus:border-admin-active-border transition-colors duration-150';

function generateRef(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6);
  return `PED-${date}-${rand}`;
}

interface OrderFormProps {
  warehouseMaterials: RawMaterial[];
}

export default function OrderForm({ warehouseMaterials }: OrderFormProps): React.ReactElement {
  const router = useRouter();
  const { saving, createFromWarehouse } = useOrderMutations();

  const [distributor, setDistributor] = useState('');
  const [description, setDescription] = useState(() => generateRef());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lines, setLines] = useState<Record<string, { type: MaterialType; quantity: number }>>({});
  const [error, setError] = useState<string | null>(null);

  function toggleMaterial(m: RawMaterial): void {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(m.id)) {
        next.delete(m.id);
      } else {
        next.add(m.id);
        setLines((prevLines) => ({
          ...prevLines,
          [m.id]: prevLines[m.id] ?? { type: m.type, quantity: 1 },
        }));
      }
      return next;
    });
  }

  function setQty(id: string, qty: number): void {
    setLines((prev) => ({ ...prev, [id]: { ...prev[id], quantity: Math.max(1, qty) } }));
  }

  function setType(id: string, type: MaterialType): void {
    setLines((prev) => ({ ...prev, [id]: { ...prev[id], type } }));
  }

  async function handleSubmit(): Promise<void> {
    setError(null);
    if (selectedIds.size === 0) {
      setError('Selecciona al menos un material del almacén.');
      return;
    }
    const selected = warehouseMaterials.filter((m) => selectedIds.has(m.id));
    const result = await createFromWarehouse({
      distributor,
      description: description.trim() || generateRef(),
      status: 'pending',
      materials: [
        {
          designs: selected.map((m) => ({
            rawMaterialId: m.id,
            quantity: lines[m.id]?.quantity ?? 1,
            type: lines[m.id]?.type ?? m.type,
            customDesignName: m.name,
            addToInventory: false,
          })),
        },
      ],
    });

    if (result.success) {
      router.push('/admin/inventory/orders');
    } else {
      setError(result.error ?? 'Error al crear el pedido');
    }
  }

  return (
    <div className="w-full max-w-[80rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      {/* Header */}
      <div className="flex items-center gap-[1.6rem] mb-[3rem]">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-[0.8rem] rounded-[0.8rem] text-gray-400 hover:text-heading hover:bg-gray-100 transition-colors duration-150"
          aria-label="Volver"
        >
          <ArrowLeft className="w-[2rem] h-[2rem]" />
        </button>
        <div>
          <h1 className="text-heading text-[2.4rem]">Nuevo Pedido</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.2rem]">
            Selecciona materiales del almacén
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-[2.4rem]">
        {/* ── Información general ──────────────────────────────────── */}
        <div className="bg-white border border-border rounded-[1.2rem] p-[2.4rem]">
          <p className="text-[1.1rem] font-semibold uppercase tracking-widest text-subtle mb-[1.6rem]">
            Información General
          </p>
          <div className="grid grid-cols-2 gap-[1.6rem] max-xs:grid-cols-1">
            <div>
              <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                Referencia
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={INPUT}
                placeholder="PED-XXXXXXXX-XXXX"
              />
            </div>
            <div>
              <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                Proveedor
              </label>
              <input
                type="text"
                value={distributor}
                onChange={(e) => setDistributor(e.target.value)}
                className={INPUT}
                placeholder="Nombre del proveedor"
              />
            </div>
          </div>
        </div>

        {/* ── Materiales ───────────────────────────────────────────── */}
        <div className="bg-white border border-border rounded-[1.2rem] p-[2.4rem]">
          <p className="text-[1.1rem] font-semibold uppercase tracking-widest text-subtle mb-[1.6rem]">
            Materiales del Almacén
          </p>

          {warehouseMaterials.length === 0 ? (
            <div className="flex flex-col items-center py-[4rem] gap-[1.2rem] text-subtle">
              <Package className="w-[3rem] h-[3rem] opacity-30" />
              <p className="text-[1.4rem]">No hay materiales en el almacén</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {warehouseMaterials.map((m) => {
                const selected = selectedIds.has(m.id);
                const line = lines[m.id];
                return (
                  <div
                    key={m.id}
                    className={`py-[1.6rem] first:pt-0 last:pb-0 transition-opacity duration-150 ${selected ? 'opacity-100' : 'opacity-50'}`}
                  >
                    {/* Row: checkbox + info */}
                    <div className="flex items-center gap-[1.2rem]">
                      <input
                        type="checkbox"
                        id={`mat-${m.id}`}
                        checked={selected}
                        onChange={() => toggleMaterial(m)}
                        className="w-[1.6rem] h-[1.6rem] cursor-pointer accent-heading shrink-0"
                      />
                      <label
                        htmlFor={`mat-${m.id}`}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <span className="text-[1.4rem] font-semibold text-heading">
                          {m.name}
                        </span>
                        <span className="ml-[0.8rem] text-[1.2rem] text-subtle">
                          {m.width} × {m.height} m &middot; {m.quantity} disp.
                        </span>
                      </label>
                    </div>

                    {/* Controls: only when selected */}
                    {selected && (
                      <div className="mt-[1.2rem] ml-[2.8rem] grid grid-cols-2 gap-[1.2rem] max-xs:grid-cols-1">
                        {/* Tipo */}
                        <div>
                          <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                            Tipo <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={line?.type ?? m.type}
                            onChange={(e) => setType(m.id, e.target.value as MaterialType)}
                            className={`${INPUT} appearance-none`}
                          >
                            {Object.entries(WAREHOUSE_TYPE_LABELS).map(([v, l]) => (
                              <option key={v} value={v}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Rendimiento */}
                        <div>
                          <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                            Rendimiento <span className="text-red-500">*</span>
                            <span className="text-subtle text-[1.1rem] font-normal ml-[0.6rem]">
                              {m.width} × {m.height} m
                            </span>
                          </label>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => setQty(m.id, (line?.quantity ?? 1) - 1)}
                              className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-l-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={line?.quantity ?? 1}
                              onChange={(e) => setQty(m.id, Number(e.target.value) || 1)}
                              min={1}
                              className="w-[5rem] h-[3.6rem] bg-white border-y border-border text-heading text-[1.4rem] text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              onClick={() => setQty(m.id, (line?.quantity ?? 1) + 1)}
                              className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-r-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="flex items-center gap-[0.6rem] text-[1.3rem] text-red-500">
            <AlertCircle className="w-[1.6rem] h-[1.6rem] shrink-0" />
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-[1.2rem]">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-[2rem] py-[1.2rem] bg-white border border-border text-heading text-[1.4rem] font-semibold rounded-[0.4rem] hover:bg-body-alt transition-colors duration-150"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || selectedIds.size === 0}
            className="px-[2.4rem] py-[1.2rem] bg-heading text-white text-[1.4rem] font-semibold rounded-[0.4rem] hover:opacity-90 transition-opacity duration-150 flex items-center gap-[0.8rem] disabled:opacity-50"
          >
            {saving && <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />}
            Crear Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
