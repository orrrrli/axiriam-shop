'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Warehouse, Loader2, AlertCircle, Image as ImageIcon, Pencil, Trash2, ClipboardList } from 'lucide-react';
import { useCloudinaryUpload } from '@/lib/hooks/use-cloudinary-upload';
import { RawMaterial, RawMaterialFormData, MaterialType } from '@/types/inventory';
import { WAREHOUSE_TYPE_LABELS, EMPTY_WAREHOUSE_FORM } from '@/lib/constants/admin/warehouse.constants';
import { createWarehouseMaterial, updateWarehouseMaterial, deleteWarehouseMaterial } from '@/lib/services/admin/warehouse.service';
import { Modal, DataTable } from '@/components/admin/common';

export default function WarehouseView({ initialMaterials }: { initialMaterials: RawMaterial[] }): React.ReactElement {
  const router = useRouter();
  const [items, setItems] = useState(initialMaterials);

  // ── Form modal ───────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RawMaterial | null>(null);
  const [form, setForm] = useState<RawMaterialFormData>(EMPTY_WAREHOUSE_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ── Delete modal ─────────────────────────────────────────────────────────────
  // ── Delete modal ─────────────────────────────────────────────────────────────
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RawMaterial | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ── Order generation ──────────────────────────────────────────────────────────
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderLines, setOrderLines] = useState<Record<string, { type: MaterialType; quantity: number }>>({});
  const [orderSaving, setOrderSaving] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  function toggleSelect(id: string): void {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll(): void {
    setSelectedIds(selectedIds.size === items.length ? new Set() : new Set(items.map((i) => i.id)));
  }

  function exitSelectionMode(): void {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  function openOrderModal(): void {
    const lines: Record<string, { type: MaterialType; quantity: number }> = {};
    items.filter((m) => selectedIds.has(m.id)).forEach((m) => {
      lines[m.id] = { type: m.type, quantity: 1 };
    });
    setOrderLines(lines);
    setOrderError(null);
    setOrderModalOpen(true);
  }

  function generateOrderRef(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).slice(2, 6);
    return `PED-${date}-${rand}`;
  }

  async function handleCreateOrder(): Promise<void> {
    setOrderSaving(true);
    setOrderError(null);
    const selectedMaterials = items.filter((m) => selectedIds.has(m.id));
    const payload = {
      distributor: '',
      description: generateOrderRef(),
      status: 'pending' as const,
      materials: [{
        designs: selectedMaterials.map((m) => ({
          rawMaterialId: m.id,
          quantity: orderLines[m.id].quantity,
          type: orderLines[m.id].type,
          customDesignName: m.name,
          addToInventory: false,
        })),
      }],
    };
    try {
      const res = await fetch('/api/admin/inventory/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        setOrderError(err.error ?? 'Error al crear el pedido');
      } else {
        setOrderModalOpen(false);
        exitSelectionMode();
        router.push('/admin/inventory/orders');
      }
    } catch {
      setOrderError('Error de red');
    } finally {
      setOrderSaving(false);
    }
  }

  // ── Escape key ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) setModalOpen(false);
    };
    if (modalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  // ── Cloudinary ───────────────────────────────────────────────────────────────
  const handleUploadSuccess = useCallback((url: string): void => {
    setForm((prev) => ({ ...prev, imageUrl: url }));
    setUploadError(null);
  }, []);

  const handleUploadError = useCallback((msg: string): void => {
    setUploadError(msg);
  }, []);

  const openUploadWidget = useCloudinaryUpload(handleUploadSuccess, handleUploadError);

  // ── Form handlers ────────────────────────────────────────────────────────────
  function openCreate(): void {
    setEditingItem(null);
    setForm(EMPTY_WAREHOUSE_FORM);
    setSaveError(null);
    setUploadError(null);
    setModalOpen(true);
  }

  function openEdit(item: RawMaterial): void {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description,
      type: item.type,
      width: item.width,
      height: item.height,
      quantity: item.quantity,
      price: item.price,
      supplier: item.supplier,
      imageUrl: item.imageUrl ?? '',
    });
    setSaveError(null);
    setUploadError(null);
    setModalOpen(true);
  }

  async function handleSave(): Promise<void> {
    setSaveError(null);
    setSaving(true);
    try {
      const result = editingItem
        ? await updateWarehouseMaterial(editingItem.id, form)
        : await createWarehouseMaterial(form);

      if (result.success) {
        setModalOpen(false);
        router.refresh();
      } else {
        setSaveError(result.error);
      }
    } finally {
      setSaving(false);
    }
  }

  // ── Delete handlers ──────────────────────────────────────────────────────────
  function openDeleteModal(item: RawMaterial): void {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal(): void {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
    setDeleteError(null);
  }

  async function handleDeleteConfirm(): Promise<void> {
    if (!itemToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteWarehouseMaterial(itemToDelete.id);
      if (result.success) {
        setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
        closeDeleteModal();
      } else {
        setDeleteError(result.error);
      }
    } finally {
      setDeleting(false);
    }
  }

  // ── Table columns ────────────────────────────────────────────────────────────
  const columns = [
    {
      header: 'Foto',
      key: 'imageUrl',
      render: (value: string | undefined, row: RawMaterial) =>
        value ? (
          <Image src={value} alt={row.name} width={50} height={50} className="object-cover rounded" />
        ) : (
          <ImageIcon className="w-[3rem] h-[3rem] text-subtle opacity-30" />
        ),
    },
    {
      header: 'Nombre',
      key: 'name',
      render: (value: string) => <span className="font-bold text-heading">{value}</span>,
    },
    {
      header: 'Tipo',
      key: 'type',
      render: (value: string) => WAREHOUSE_TYPE_LABELS[value] ?? value,
    },
    {
      header: 'Dimensiones',
      key: 'width',
      render: (_: number, row: RawMaterial) => (
        <span className="text-paragraph">{row.width} × {row.height} m</span>
      ),
    },
    {
      header: 'Rendimiento',
      key: 'quantity',
      render: (value: number) => (
        <span className="text-paragraph">
          {value} <span className="text-subtle text-[1.2rem]">items</span>
        </span>
      ),
    },
    {
      header: 'Precio',
      key: 'price',
      render: (value: number) => <span className="font-bold text-heading">${value.toFixed(2)}</span>,
    },
    { header: 'Proveedor', key: 'supplier' },
    {
      header: 'Acciones',
      key: 'id',
      render: (_: string, row: RawMaterial) => (
        <div className="flex items-center gap-[0.4rem]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="p-[0.8rem] text-gray-400 hover:text-[#101010] hover:bg-gray-100 rounded-[0.6rem] transition-colors duration-150"
            aria-label="Editar"
          >
            <Pencil className="w-[1.8rem] h-[1.8rem]" />
          </button>
          <button
            type="button"
            onClick={() => openDeleteModal(row)}
            className="p-[0.8rem] text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[0.6rem] transition-colors duration-150"
            aria-label="Eliminar"
          >
            <Trash2 className="w-[1.8rem] h-[1.8rem]" />
          </button>
        </div>
      ),
    },
  ];

  // ── Shared input class (light mode) ─────────────────────────────────────────
  const INPUT = 'w-full bg-white border border-border text-heading text-[1.4rem] px-[1.2rem] py-[1rem] rounded-[0.4rem] placeholder-gray-400 focus:outline-none focus:border-admin-active-border transition-colors duration-150';

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Almacén</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">{items.length} materiales registrados</p>
        </div>
        <div className="flex items-center gap-[1.2rem]">
          <button
            type="button"
            onClick={() => setSelectionMode(true)}
            className="button-muted flex items-center gap-[0.8rem] text-[1.3rem]"
          >
            <ClipboardList className="w-[1.6rem] h-[1.6rem]" /> Generar pedido
          </button>
          <button className="button flex items-center gap-[0.8rem] text-[1.3rem]" onClick={openCreate}>
            <Plus className="w-[1.6rem] h-[1.6rem]" /> Nuevo Material
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={items}
        emptyMessage="No hay materiales registrados"
        emptyIcon={<Warehouse className="w-[3rem] h-[3rem] opacity-30" />}
        onRowClick={!selectionMode ? (item) => router.push(`/admin/inventory/warehouse/${item.id}`) : undefined}
        selectionMode={selectionMode}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
      />

      {/* ── Floating selection bar ───────────────────────────────────────────── */}
      <div
        className={`fixed bottom-[3rem] left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 ${
          selectionMode ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-[1rem] pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-[2rem] bg-[#111] text-white px-[2.4rem] py-[1.4rem] rounded-[1.2rem] shadow-2xl">
          <div className="flex items-center gap-[1rem]">
            <span className="text-[1.4rem] font-medium text-white/60">
              {selectedIds.size === 0
                ? 'Selecciona materiales'
                : `${selectedIds.size} seleccionado${selectedIds.size > 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="h-[1.8rem] w-px bg-white/20" />

          <div className="flex items-center gap-[1.2rem]">
            <button
              type="button"
              onClick={exitSelectionMode}
              className="text-[1.3rem] text-white/60 hover:text-white transition-colors duration-150"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={openOrderModal}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-[0.8rem] bg-white text-[#111] text-[1.3rem] font-semibold px-[1.6rem] py-[0.8rem] rounded-[0.6rem] hover:bg-white/90 disabled:opacity-30 transition-all duration-150"
            >
              <ClipboardList className="w-[1.4rem] h-[1.4rem]" />
              Generar pedido
            </button>
          </div>
        </div>
      </div>

      {/* ── Order Modal ──────────────────────────────────────────────────────── */}
      {orderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal animate-fade-in"
          onClick={() => setOrderModalOpen(false)}
        >
          <div
            className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-[0.8rem] shadow-xl"
            style={{ maxWidth: '48rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-[2.4rem] pt-[2.4rem] pb-[2rem] border-b border-border">
              <p className="text-[1.1rem] text-subtle mb-[0.3rem]">Inventario / Almacén</p>
              <h2 className="text-[2rem] font-bold text-heading">Generar Pedido</h2>
            </div>

            <div className="px-[2.4rem] py-[2rem] flex flex-col gap-[2rem]">
              {items.filter((m) => selectedIds.has(m.id)).map((m) => (
                <div key={m.id} className="flex flex-col gap-[1.2rem] pb-[2rem] border-b border-border last:border-b-0 last:pb-0">
                  <p className="text-[1.4rem] font-semibold text-heading">{m.name}</p>
                  <div className="grid grid-cols-2 gap-[1.2rem]">
                    <div>
                      <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                        Tipo <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={orderLines[m.id]?.type ?? m.type}
                        onChange={(e) => setOrderLines((prev) => ({
                          ...prev,
                          [m.id]: { ...prev[m.id], type: e.target.value as MaterialType },
                        }))}
                        className={`${INPUT} appearance-none`}
                      >
                        {Object.entries(WAREHOUSE_TYPE_LABELS).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                        Unidades <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => setOrderLines((prev) => ({
                            ...prev,
                            [m.id]: { ...prev[m.id], quantity: Math.max(1, prev[m.id].quantity - 1) },
                          }))}
                          className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-l-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                        >−</button>
                        <input
                          type="number"
                          value={orderLines[m.id]?.quantity ?? 1}
                          onChange={(e) => setOrderLines((prev) => ({
                            ...prev,
                            [m.id]: { ...prev[m.id], quantity: Math.max(1, Number(e.target.value) || 1) },
                          }))}
                          min={1}
                          className="w-[5rem] h-[3.6rem] bg-white border-y border-border text-heading text-[1.4rem] text-center focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setOrderLines((prev) => ({
                            ...prev,
                            [m.id]: { ...prev[m.id], quantity: prev[m.id].quantity + 1 },
                          }))}
                          className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-r-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {orderError && (
              <div className="px-[2.4rem] pb-[1.2rem]">
                <p className="flex items-center gap-[0.6rem] text-[1.2rem] text-red-500">
                  <AlertCircle className="w-[1.4rem] h-[1.4rem] shrink-0" />
                  {orderError}
                </p>
              </div>
            )}

            <div className="px-[2.4rem] pb-[2.4rem] pt-[0.8rem] grid grid-cols-2 gap-[1.2rem] border-t border-border">
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="py-[1.2rem] bg-white border border-border text-heading text-[1.4rem] font-semibold rounded-[0.4rem] hover:bg-body-alt transition-colors duration-150"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateOrder}
                disabled={orderSaving}
                className="py-[1.2rem] bg-heading text-white text-[1.4rem] font-semibold rounded-[0.4rem] hover:opacity-90 transition-opacity duration-150 flex items-center justify-center gap-[0.8rem] disabled:opacity-50"
              >
                {orderSaving && <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />}
                Generar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Form Modal (light) ────────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-[0.8rem] shadow-xl"
            style={{ maxWidth: '44rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-[2.4rem] pt-[2.4rem] pb-[2rem] border-b border-border">
              <p className="text-[1.1rem] text-subtle mb-[0.3rem]">Inventario / Materiales</p>
              <h2 className="text-[2rem] font-bold text-heading">
                {editingItem ? 'Editar material' : 'Nuevo material'}
              </h2>
            </div>

            {/* ── IMAGEN ─────────────────────────────────────────────────────── */}
            <div className="px-[2.4rem] py-[2rem] border-b border-border">
              <p className="text-[1.1rem] font-semibold uppercase tracking-widest text-subtle mb-[1.2rem]">
                Imagen
              </p>

              {/* Full-width clickable area */}
              <button
                type="button"
                onClick={openUploadWidget}
                className={`group relative w-full h-[18rem] rounded-[0.6rem] flex items-center justify-center overflow-hidden transition-colors duration-150 ${form.imageUrl ? '' : 'bg-body-alt border border-border hover:border-border-focus'}`}
                aria-label="Subir imagen"
              >
                {form.imageUrl ? (
                  <>
                    <Image src={form.imageUrl} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-[0.6rem] bg-white text-heading text-[1.3rem] font-semibold px-[1.4rem] py-[0.6rem] rounded-[0.4rem] shadow">
                        <Pencil className="w-[1.2rem] h-[1.2rem]" /> Cambiar imagen
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-[0.8rem]">
                    <ImageIcon className="w-[4rem] h-[4rem] text-gray-300" />
                    <p className="text-[1.3rem] text-subtle">Haz clic para subir una imagen</p>
                    <p className="text-[1.2rem] text-subtle opacity-60">PNG o JPG · Cuadrada recomendada (1:1)</p>
                  </div>
                )}
              </button>

              {/* Actions below image */}
              <div className="flex items-center justify-between mt-[1rem]">
                <button
                  type="button"
                  onClick={openUploadWidget}
                  className="px-[1.6rem] py-[0.7rem] bg-heading text-white text-[1.3rem] font-semibold rounded-[0.4rem] hover:opacity-90 transition-opacity duration-150"
                >
                  Subir
                </button>
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                    className="text-[1.2rem] text-red-500 hover:text-red-700 transition-colors duration-150"
                  >
                    Quitar imagen
                  </button>
                )}
              </div>

              {uploadError && (
                <p className="flex items-center gap-[0.4rem] text-[1.2rem] text-red-500 mt-[0.8rem]">
                  <AlertCircle className="w-[1.4rem] h-[1.4rem] shrink-0" />
                  {uploadError}
                </p>
              )}
            </div>

            {/* ── IDENTIFICACIÓN ───────────────────────────────────────────── */}
            <div className="px-[2.4rem] py-[2rem] border-b border-border">
              <p className="text-[1.1rem] font-semibold uppercase tracking-widest text-subtle mb-[1.6rem]">
                Identificación
              </p>
              <div className="flex flex-col gap-[1.4rem]">
                {/* Nombre */}
                <div>
                  <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej. Tela Floral Verano"
                    className={INPUT}
                  />
                </div>

                {/* Tipo + Proveedor */}
                <div className="grid grid-cols-2 gap-[1.2rem]">
                  <div>
                    <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">Tipo</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as RawMaterialFormData['type'] })}
                      className={`${INPUT} appearance-none`}
                    >
                      {Object.entries(WAREHOUSE_TYPE_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between mb-[0.6rem]">
                      <label className="text-[1.3rem] font-medium text-heading">Proveedor</label>
                      <span className="text-[1.2rem] text-subtle">Opcional</span>
                    </div>
                    <input
                      value={form.supplier}
                      onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                      placeholder="Ej. Textiles SA"
                      className={INPUT}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── PRECIO Y DIMENSIONES ─────────────────────────────────────── */}
            <div className="px-[2.4rem] py-[2rem]">
              <p className="text-[1.1rem] font-semibold uppercase tracking-widest text-subtle mb-[1.6rem]">
                Precio y Dimensiones
              </p>
              <div className="flex flex-col gap-[1.4rem]">
                {/* Precio / Ancho / Alto */}
                <div className="grid grid-cols-3 gap-[1.2rem]">
                  <div>
                    <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">Precio</label>
                    <div className="relative">
                      <span className="absolute left-[1rem] top-1/2 -translate-y-1/2 text-subtle text-[1.4rem] pointer-events-none">$</span>
                      <input
                        type="number"
                        value={form.price === 0 ? '' : form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value === '' ? 0 : Number(e.target.value) })}
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        onWheel={(e) => e.currentTarget.blur()}
                        className={`${INPUT} pl-[2.4rem]`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">Ancho</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form.width === 0 ? '' : form.width}
                        onChange={(e) => setForm({ ...form, width: e.target.value === '' ? 0 : Number(e.target.value) })}
                        min={0}
                        step={0.01}
                        placeholder="1.50"
                        className={`${INPUT} pr-[2.8rem]`}
                      />
                      <span className="absolute right-[1rem] top-1/2 -translate-y-1/2 text-subtle text-[1.3rem] pointer-events-none">m</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">Alto</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form.height === 0 ? '' : form.height}
                        onChange={(e) => setForm({ ...form, height: e.target.value === '' ? 0 : Number(e.target.value) })}
                        min={0}
                        step={0.01}
                        placeholder="2.00"
                        className={`${INPUT} pr-[2.8rem]`}
                      />
                      <span className="absolute right-[1rem] top-1/2 -translate-y-1/2 text-subtle text-[1.3rem] pointer-events-none">m</span>
                    </div>
                  </div>
                </div>

                {/* Stock stepper */}
                <div>
                  <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                    Genera <span className="font-normal text-subtle">productos estimados</span>
                  </label>
                  <div className="flex items-center gap-[1.4rem]">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, quantity: Math.max(0, form.quantity - 1) })}
                        className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-l-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                        aria-label="Disminuir rendimiento"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: Math.max(0, Number(e.target.value) || 0) })}
                        min={0}
                        className="w-[5rem] h-[3.6rem] bg-white border-y border-border text-heading text-[1.4rem] text-center focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, quantity: form.quantity + 1 })}
                        className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-r-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                        aria-label="Aumentar rendimiento"
                      >
                        +
                      </button>
                    </div>
                    {form.quantity === 0 && (
                      <span className="text-[1.2rem] text-subtle">Sin rendimiento registrado</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {saveError && (
              <div className="px-[2.4rem] pb-[1.2rem]">
                <p className="flex items-center gap-[0.6rem] text-[1.2rem] text-red-500">
                  <AlertCircle className="w-[1.4rem] h-[1.4rem] shrink-0" />
                  {saveError}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="px-[2.4rem] pb-[2.4rem] pt-[0.8rem] grid grid-cols-2 gap-[1.2rem] border-t border-border">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="py-[1.2rem] bg-white border border-border text-heading text-[1.4rem] font-semibold rounded-[0.4rem] hover:bg-body-alt transition-colors duration-150"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="py-[1.2rem] bg-heading text-white text-[1.4rem] font-semibold rounded-[0.4rem] hover:opacity-90 transition-opacity duration-150 flex items-center justify-center gap-[0.8rem] disabled:opacity-50"
              >
                {saving && <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />}
                {editingItem ? 'Guardar cambios' : 'Guardar material'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ────────────────────────────────────────── */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Eliminar Material"
        footer={
          <>
            <button
              type="button"
              className="button button-muted"
              onClick={closeDeleteModal}
              disabled={deleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="button button-danger flex items-center gap-[0.6rem]"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting && <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />}
              Eliminar
            </button>
          </>
        }
      >
        <p className="text-[1.4rem] text-paragraph">
          ¿Confirmas que deseas eliminar el material{' '}
          <strong>{itemToDelete?.name}</strong>? Esta acción no se puede deshacer.
        </p>
        {deleteError && (
          <p className="flex items-center gap-[0.6rem] text-[1.2rem] text-red-500 mt-[1.2rem]">
            <AlertCircle className="w-[1.4rem] h-[1.4rem] shrink-0" />
            {deleteError}
          </p>
        )}
      </Modal>
    </div>
  );
}
