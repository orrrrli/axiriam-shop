'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { sileo } from 'sileo';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus,
  Package,
  ImageIcon,
  AlertCircle,
  ChevronDown,
  Loader2,
  Pencil,
  Trash2,
  X,
  Link2,
  Link2Off,
} from 'lucide-react';
import {
  InventoryItem,
  InventoryItemFormData,
  ItemCreatePayload,
  InventoryItemSalesStats,
  InventoryItemCategory,
  MaterialType,
  RawMaterial,
} from '@/types/inventory';
import { formatPrice } from '@/lib/utils/helpers';
import { slugifyItemName } from '@/lib/utils/inventory';
import { useTransitionStore } from '@/lib/store/transitionStore';
import { useCloudinaryUpload } from '@/lib/hooks/use-cloudinary-upload';
import { useItemMutations } from '@/lib/hooks/use-item-mutations';
import {
  CATEGORY_LABELS,
  TYPE_LABELS,
  EMPTY_ITEM_FORM,
  MAX_ITEM_TAGS,
} from '@/lib/constants/admin/items.constants';
import { WAREHOUSE_TYPE_LABELS } from '@/lib/constants/admin/warehouse.constants';
import { DataTable } from '@/components/admin/common/organisms/data-table';
import { ProductTableFilters } from '@/components/admin/common/organisms/product-table-filters';
import { SlideOver } from '@/components/admin/common/organisms/slide-over';
import { Button } from '@/components/admin/common/atoms/button';
import ConfirmToast from '@/components/molecules/confirm-toast';

const INPUT =
  'w-full bg-white border border-border text-heading text-[1.4rem] px-[1.2rem] py-[1rem] rounded-[0.4rem] placeholder-gray-400 focus:outline-none focus:border-admin-active-border transition-colors duration-150';

const SELECT_CLASS =
  'w-full appearance-none bg-white border border-border rounded-[0.4rem] px-[1.2rem] py-[1rem] pr-[4rem] text-[1.4rem] text-heading focus:outline-none focus:border-admin-active-border transition-colors duration-150 cursor-pointer';

type ItemFormState = Omit<InventoryItemFormData, 'quantityCompleto' | 'quantitySencillo'> & {
  quantityCompleto: number | '';
  quantitySencillo: number | '';
};

interface ItemsViewProps {
  initialItems: InventoryItem[];
  salesStats: Record<string, InventoryItemSalesStats>;
  warehouseMaterials: RawMaterial[];
}

export default function ItemsView({
  initialItems,
  salesStats,
  warehouseMaterials,
}: ItemsViewProps): React.ReactElement {
  const router = useRouter();
  const startItemDetailNavigation = useTransitionStore((s) => s.startItemDetailNavigation);
  const { saving, create, update, remove } = useItemMutations();

  const [items, setItems] = useState<InventoryItem[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<ItemFormState>(EMPTY_ITEM_FORM);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [linkWarehouse, setLinkWarehouse] = useState(false);
  const [warehouseMaterialId, setWarehouseMaterialId] = useState('');
  const [materialConsumedQty, setMaterialConsumedQty] = useState<number | ''>(1);
  const [warehouseSearch, setWarehouseSearch] = useState('');

  const [pendingDelete, setPendingDelete] = useState<InventoryItem | null>(null);

  const [activeTab, setActiveTab] = useState<'general' | 'completos' | 'sencillos' | 'ventas'>(
    'general'
  );
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'date-newest' | 'date-oldest'>(
    'date-newest'
  );

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    if (selectedType) {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (activeTab === 'completos') {
      filtered = filtered.filter((item) => item.type !== 'brush');
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'date-newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date-oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
    }

    return sorted;
  }, [items, selectedType, sortBy]);

  const filteredWarehouseMaterials = useMemo(() => {
    if (!warehouseSearch.trim()) return warehouseMaterials;
    const q = warehouseSearch.toLowerCase();
    return warehouseMaterials.filter((m) => m.name.toLowerCase().includes(q));
  }, [warehouseMaterials, warehouseSearch]);

  const handleUploadSuccess = useCallback((url: string): void => {
    setForm((prev) => ({ ...prev, photoUrl: url }));
    setUploadError(null);
  }, []);

  const handleUploadError = useCallback((msg: string): void => {
    setUploadError(msg);
  }, []);

  const openUploadWidget = useCloudinaryUpload(handleUploadSuccess, handleUploadError);

  function openCreate(): void {
    setEditingItem(null);
    setForm(EMPTY_ITEM_FORM);
    setTagInput('');
    setUploadError(null);
    setSaveError(null);
    setLinkWarehouse(false);
    setWarehouseMaterialId('');
    setMaterialConsumedQty(1);
    setWarehouseSearch('');
    setModalOpen(true);
  }

  function openEdit(item: InventoryItem): void {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      type: item.type,
      description: item.description,
      quantityCompleto: item.quantityCompleto,
      quantitySencillo: item.quantitySencillo,
      price: item.price,
      photoUrl: item.photoUrl,
      tags: item.tags ?? [],
      materials: item.materials,
    });
    setTagInput('');
    setUploadError(null);
    setSaveError(null);
    setLinkWarehouse(false);
    setWarehouseMaterialId('');
    setMaterialConsumedQty(1);
    setWarehouseSearch('');
    setModalOpen(true);
  }

  async function handleSave(): Promise<void> {
    setSaveError(null);
    if (!form.name.trim()) {
      setSaveError('El nombre es requerido.');
      return;
    }
    if (!form.price || form.price <= 0) {
      setSaveError('El precio es requerido y debe ser mayor a 0.');
      return;
    }
    const isBrush = form.type === 'brush';
    const quantityCompleto = isBrush ? 0 : Number(form.quantityCompleto) || 0;
    const quantitySencillo = Number(form.quantitySencillo) || 0;
    if (!isBrush && quantityCompleto <= 0) {
      setSaveError('La cantidad Completo es requerida y debe ser mayor a 0.');
      return;
    }
    if (quantitySencillo <= 0) {
      setSaveError('La cantidad Sencillo es requerida y debe ser mayor a 0.');
      return;
    }
    const basePayload: InventoryItemFormData = { ...form, quantityCompleto, quantitySencillo };

    if (editingItem) {
      const result = await update(editingItem.id, basePayload);
      if (result.success) {
        setModalOpen(false);
        sileo.success({ title: 'Producto actualizado correctamente' });
        router.refresh();
      } else {
        setSaveError(result.error);
        sileo.error({ title: 'Error al guardar cambios' });
      }
      return;
    }

    if (linkWarehouse && !warehouseMaterialId) {
      setSaveError('Debes seleccionar un material del almacén o desactivar el vínculo.');
      return;
    }

    const createPayload: ItemCreatePayload = {
      ...basePayload,
      ...(linkWarehouse && warehouseMaterialId
        ? {
            warehouseMaterialId,
            materialConsumedQty: Number(materialConsumedQty) || 0,
          }
        : {}),
    };

    const result = await create(createPayload);
    if (result.success) {
      setModalOpen(false);
      sileo.success({ title: 'Producto creado correctamente' });
      router.refresh();
    } else {
      setSaveError(result.error);
      sileo.error({ title: 'Error al crear el producto' });
    }
  }

  function handleDelete(item: InventoryItem): void {
    setPendingDelete(item);
  }

  function handleDeleteCancel(): void {
    setPendingDelete(null);
  }

  function handleDeleteConfirm(): void {
    if (!pendingDelete) return;
    const item = pendingDelete;
    setPendingDelete(null);

    const promise = remove(item.id).then((result) => {
      if (!result.success) throw new Error(result.error ?? 'Error al eliminar');
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      return result;
    });

    sileo.promise(promise, {
      loading: { title: `Eliminando "${item.name}"...` },
      success: { title: `"${item.name}" eliminado correctamente` },
      error: { title: 'Error al eliminar el producto' },
    });
  }

  const actionsCol = {
    header: 'Acciones',
    key: 'id',
    render: (_: string, row: InventoryItem) => (
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
          onClick={() => handleDelete(row)}
          className="p-[0.8rem] text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[0.6rem] transition-colors duration-150"
          aria-label="Eliminar"
        >
          <Trash2 className="w-[1.8rem] h-[1.8rem]" />
        </button>
      </div>
    ),
  };

  const baseColumns = [
    {
      header: 'Foto',
      key: 'photoUrl',
      render: (value: string | undefined, row: InventoryItem) =>
        value ? (
          <Image
            src={value}
            alt={row.name}
            width={50}
            height={50}
            className="object-cover rounded"
          />
        ) : (
          <ImageIcon className="w-[3rem] h-[3rem] text-subtle opacity-30" />
        ),
    },
    {
      header: 'Nombre',
      key: 'name',
      render: (value: string) => <strong className="text-heading">{value}</strong>,
    },
    {
      header: 'Categoría',
      key: 'category',
      render: (value: InventoryItemCategory) => CATEGORY_LABELS[value] ?? value,
    },
    {
      header: 'Tipo',
      key: 'type',
      render: (value: MaterialType) => TYPE_LABELS[value] ?? value,
    },
  ];

  const completoCol = { header: 'Completo', key: 'quantityCompleto' };
  const sencilloCol = { header: 'Sencillo', key: 'quantitySencillo' };
  const precioCol = {
    header: 'Precio',
    key: 'price',
    render: (value: number) => <strong className="text-heading">{formatPrice(value)}</strong>,
  };

  const ventasQtyCol = {
    header: 'Uds. vendidas',
    key: 'ventas_qty',
    render: (_: unknown, row: InventoryItem) => (
      <span className="font-semibold text-heading">{salesStats[row.id]?.quantitySold ?? 0}</span>
    ),
  };

  const ventasCountCol = {
    header: 'Nº ventas',
    key: 'ventas_count',
    render: (_: unknown, row: InventoryItem) => salesStats[row.id]?.salesCount ?? 0,
  };

  const columns = useMemo(() => {
    switch (activeTab) {
      case 'completos':
        return [...baseColumns, completoCol, precioCol, actionsCol];
      case 'sencillos':
        return [...baseColumns, sencilloCol, precioCol, actionsCol];
      case 'ventas':
        return [...baseColumns, ventasQtyCol, ventasCountCol, precioCol];
      default:
        return [...baseColumns, completoCol, sencilloCol, precioCol, actionsCol];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, salesStats]);

  return (
    <>
    {pendingDelete && (
      <ConfirmToast
        productName={pendingDelete.name}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    )}
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Productos</h1>
          <p className="text-admin-muted text-[1.4rem] mt-[0.4rem]">
            {items.length} productos en inventario
          </p>
        </div>
        <button
          className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          onClick={openCreate}
        >
          <Plus className="w-[1.6rem] h-[1.6rem]" /> Nuevo Producto
        </button>
      </div>

      <ProductTableFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        typeOptions={TYPE_LABELS}
      />

      <DataTable
        columns={columns}
        data={filteredAndSortedItems}
        emptyMessage="No hay productos registrados"
        emptyIcon={<Package className="w-[3rem] h-[3rem] opacity-30" />}
        onRowClick={(item) => {
          startItemDetailNavigation();
          router.push(`/admin/inventory/items/${slugifyItemName(item.name)}`);
        }}
      />

      <SlideOver
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Producto' : 'Nuevo Producto'}
        footer={
          <div className="w-full flex flex-col gap-[1rem]">
            {saveError && (
              <p className="flex items-center gap-[0.6rem] text-[1.2rem] text-red-500">
                <AlertCircle className="w-[1.4rem] h-[1.4rem] shrink-0" />
                {saveError}
              </p>
            )}
            <div className="grid grid-cols-2 gap-[1.2rem]">
              <Button variant="secondary" className="w-full" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="w-full flex items-center justify-center gap-[0.8rem]"
                onClick={handleSave}
                disabled={saving}
              >
                {saving && <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />}
                {editingItem ? 'Guardar Cambios' : 'Crear Producto'}
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col">
          {/* ── IMAGEN ──────────────────────────────────────────────────────── */}
          <div className="pb-[2rem] border-b border-border">
            <p className="text-[1.1rem] font-semibold uppercase tracking-widest text-subtle mb-[1.2rem]">
              Imagen
            </p>
            <div className="flex items-start gap-[1.6rem]">
              {/* Wrapper keeps pencil outside overflow-hidden button */}
              <div className="relative w-[11rem] h-[11rem] shrink-0">
                <button
                  type="button"
                  onClick={openUploadWidget}
                  className="w-full h-full bg-body-alt border border-border rounded-[0.6rem] flex items-center justify-center overflow-hidden hover:border-border-focus transition-colors duration-150"
                  aria-label="Subir foto"
                >
                  {form.photoUrl ? (
                    <Image src={form.photoUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <ImageIcon className="w-[2.8rem] h-[2.8rem] text-gray-300" />
                  )}
                </button>
                <div className="absolute bottom-[0.4rem] left-[0.4rem] w-[2rem] h-[2rem] bg-white border border-border rounded-full flex items-center justify-center shadow-sm pointer-events-none">
                  <Pencil className="w-[1rem] h-[1rem] text-subtle" />
                </div>
              </div>

              {/* Info + actions */}
              <div className="flex-1">
                <p className="text-[1.4rem] font-semibold text-heading mb-[0.3rem]">
                  {form.photoUrl ? 'Foto cargada' : 'Sin imagen'}
                </p>
                <p className="text-[1.2rem] text-subtle leading-relaxed">
                  PNG o JPG · Máx. 5 MB
                  <br />
                  Cuadrada recomendada (1:1)
                </p>
                <div className="flex items-center gap-[1rem] mt-[1rem]">
                  <button
                    type="button"
                    onClick={openUploadWidget}
                    className="px-[1.6rem] py-[0.7rem] bg-heading text-white text-[1.3rem] font-semibold rounded-[0.4rem] hover:opacity-90 transition-opacity duration-150"
                  >
                    Subir
                  </button>
                  {form.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, photoUrl: undefined })}
                      className="text-[1.2rem] text-red-500 hover:text-red-700 transition-colors duration-150"
                    >
                      Quitar foto
                    </button>
                  )}
                </div>
              </div>
            </div>
            {uploadError && (
              <p className="flex items-center gap-[0.4rem] text-[1.2rem] text-red-500 mt-[0.8rem]">
                <AlertCircle className="w-[1.4rem] h-[1.4rem] shrink-0" />
                {uploadError}
              </p>
            )}
          </div>

          {/* ── IDENTIFICACIÓN ──────────────────────────────────────────────── */}
          <div className="py-[2rem] border-b border-border">
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
                  placeholder="Ej. Bandana Básica"
                  className={INPUT}
                  aria-label="Nombre del producto"
                />
              </div>

              {/* Categoría + Tipo */}
              <div className="grid grid-cols-2 gap-[1.2rem]">
                <div>
                  <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                    Categoría
                  </label>
                  <div className="relative">
                    <select
                      className={SELECT_CLASS}
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value as InventoryItemCategory })
                      }
                      aria-label="Categoría del producto"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-[1.4rem] top-1/2 -translate-y-1/2 w-[1.6rem] h-[1.6rem] text-subtle" />
                  </div>
                </div>
                <div>
                  <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                    Tipo
                  </label>
                  <div className="relative">
                    <select
                      className={SELECT_CLASS}
                      value={form.type}
                      onChange={(e) => {
                        const type = e.target.value as MaterialType;
                        setForm({
                          ...form,
                          type,
                          ...(type === 'brush' ? { quantityCompleto: 0 } : {}),
                        });
                      }}
                      aria-label="Tipo de material"
                    >
                      {Object.entries(TYPE_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-[1.4rem] top-1/2 -translate-y-1/2 w-[1.6rem] h-[1.6rem] text-subtle" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── PRECIO Y STOCK ──────────────────────────────────────────────── */}
          <div className="py-[2rem] border-b border-border">
            <p className="text-[1.1rem] font-semibold uppercase tracking-widest text-subtle mb-[1.6rem]">
              Precio y Stock
            </p>
            <div className="flex flex-col gap-[1.4rem]">
              {/* Precio */}
              <div>
                <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                  Precio <span className="text-red-500">*</span>
                </label>
                <div className="relative max-w-[16rem]">
                  <span className="absolute left-[1rem] top-1/2 -translate-y-1/2 text-subtle text-[1.4rem] pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    value={form.price === 0 ? '' : form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    onWheel={(e) => e.currentTarget.blur()}
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    className={`${INPUT} pl-[2.4rem]`}
                    aria-label="Precio del producto"
                  />
                </div>
              </div>

              {/* Completo + Sencillo steppers */}
              <div className={form.type === 'brush' ? '' : 'grid grid-cols-2 gap-[2rem]'}>
                {/* Completo */}
                {form.type !== 'brush' && (
                  <div>
                    <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                      Completo <span className="font-normal text-subtle">unidades</span>{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            quantityCompleto: Math.max(0, Number(form.quantityCompleto) - 1),
                          })
                        }
                        className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-l-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                        aria-label="Disminuir completo"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={form.quantityCompleto}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            quantityCompleto: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        min={0}
                        className="w-[5rem] h-[3.6rem] bg-white border-y border-border text-heading text-[1.4rem] text-center focus:outline-none"
                        aria-label="Cantidad completo"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, quantityCompleto: Number(form.quantityCompleto) + 1 })
                        }
                        className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-r-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                        aria-label="Aumentar completo"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Sencillo */}
                <div>
                  <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                    Sencillo <span className="font-normal text-subtle">unidades</span>{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          quantitySencillo: Math.max(0, Number(form.quantitySencillo) - 1),
                        })
                      }
                      className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-l-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                      aria-label="Disminuir sencillo"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={form.quantitySencillo}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          quantitySencillo: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                      min={0}
                      className="w-[5rem] h-[3.6rem] bg-white border-y border-border text-heading text-[1.4rem] text-center focus:outline-none"
                      aria-label="Cantidad sencillo"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, quantitySencillo: Number(form.quantitySencillo) + 1 })
                      }
                      className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-r-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                      aria-label="Aumentar sencillo"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── MATERIAL ALMACÉN ────────────────────────────────────────────────── */}
          {!editingItem && (
            <div className="py-[2rem] border-b border-border">
              <div className="flex items-center justify-between mb-[1.2rem]">
                <p className="text-[1.1rem] font-semibold uppercase tracking-widest text-subtle">
                  Material Almacén
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLinkWarehouse((v) => !v);
                    setWarehouseMaterialId('');
                    setMaterialConsumedQty(1);
                    setWarehouseSearch('');
                  }}
                  className={`flex items-center gap-[0.6rem] px-[1.2rem] py-[0.5rem] rounded-full text-[1.2rem] font-medium border transition-colors duration-150 ${
                    linkWarehouse
                      ? 'bg-heading text-white border-heading'
                      : 'bg-white text-subtle border-border hover:border-border-focus'
                  }`}
                >
                  {linkWarehouse ? (
                    <>
                      <Link2 className="w-[1.2rem] h-[1.2rem]" /> Vinculado
                    </>
                  ) : (
                    <>
                      <Link2Off className="w-[1.2rem] h-[1.2rem]" /> Sin vincular
                    </>
                  )}
                </button>
              </div>

              {!linkWarehouse && (
                <p className="text-[1.2rem] text-subtle leading-relaxed">
                  Se creará automáticamente un registro en Almacén con rendimiento 0 usando la
                  imagen del producto.
                </p>
              )}

              {linkWarehouse && (
                <div className="flex flex-col gap-[1.4rem]">
                  {/* Search */}
                  <div>
                    <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                      Buscar material
                    </label>
                    <input
                      type="text"
                      value={warehouseSearch}
                      onChange={(e) => setWarehouseSearch(e.target.value)}
                      placeholder="Filtrar por nombre..."
                      className={INPUT}
                    />
                  </div>

                  {/* Material list */}
                  <div className="flex flex-col gap-[0.6rem] max-h-[16rem] overflow-y-auto">
                    {filteredWarehouseMaterials.length === 0 ? (
                      <p className="text-[1.2rem] text-subtle text-center py-[1.2rem]">
                        No se encontraron materiales
                      </p>
                    ) : (
                      filteredWarehouseMaterials.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setWarehouseMaterialId(m.id)}
                          className={`flex items-center justify-between px-[1.2rem] py-[0.8rem] rounded-[0.4rem] border text-left transition-colors duration-150 ${
                            warehouseMaterialId === m.id
                              ? 'border-admin-active-border bg-admin-active'
                              : 'border-border bg-white hover:bg-body-alt'
                          }`}
                        >
                          <div>
                            <p className="text-[1.3rem] font-medium text-heading">{m.name}</p>
                            <p className="text-[1.2rem] text-subtle">
                              {WAREHOUSE_TYPE_LABELS[m.type] ?? m.type}
                            </p>
                          </div>
                          <span
                            className={`text-[1.2rem] font-semibold ${m.quantity === 0 ? 'text-red-500' : 'text-heading'}`}
                          >
                            {m.quantity} <span className="font-normal text-subtle">disp.</span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Consumed qty */}
                  {warehouseMaterialId && (
                    <div>
                      <label className="block text-[1.3rem] font-medium text-heading mb-[0.6rem]">
                        Unidades a consumir <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => setMaterialConsumedQty((v) => Math.max(1, Number(v) - 1))}
                          className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-l-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                          aria-label="Disminuir"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={materialConsumedQty}
                          onChange={(e) =>
                            setMaterialConsumedQty(
                              e.target.value === '' ? '' : Math.max(1, Number(e.target.value))
                            )
                          }
                          min={1}
                          className="w-[5rem] h-[3.6rem] bg-white border-y border-border text-heading text-[1.4rem] text-center focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setMaterialConsumedQty((v) => Number(v) + 1)}
                          className="w-[3.6rem] h-[3.6rem] bg-white border border-border text-heading text-[1.8rem] flex items-center justify-center rounded-r-[0.4rem] hover:bg-body-alt transition-colors duration-150"
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>
                      {(() => {
                        const selected = warehouseMaterials.find(
                          (m) => m.id === warehouseMaterialId
                        );
                        const consumed = Number(materialConsumedQty) || 0;
                        if (!selected) return null;
                        if (consumed > selected.quantity) {
                          return (
                            <p className="flex items-center gap-[0.4rem] text-[1.2rem] text-red-500 mt-[0.6rem]">
                              <AlertCircle className="w-[1.4rem] h-[1.4rem] shrink-0" />
                              Stock insuficiente. Disponible: {selected.quantity}
                            </p>
                          );
                        }
                        return (
                          <p className="text-[1.2rem] text-subtle mt-[0.4rem]">
                            Disponible: {selected.quantity} → Quedará:{' '}
                            {selected.quantity - consumed}
                          </p>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── ETIQUETAS ───────────────────────────────────────────────────── */}
          <div className="py-[2rem] border-b border-border">
            <div className="flex justify-between mb-[1.2rem]">
              <p className="text-[1.1rem] font-semibold uppercase tracking-widest text-subtle">
                Etiquetas
              </p>
              <span className="text-[1.2rem] text-subtle">
                {form.tags.length}/{MAX_ITEM_TAGS}
              </span>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-[0.6rem] mb-[1rem]">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-[0.4rem] px-[1rem] py-[0.4rem] rounded-full text-[1.2rem] font-medium bg-[#f0f0f0] text-[#101010] border border-gray-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-150 leading-none"
                      aria-label={`Quitar etiqueta ${tag}`}
                    >
                      <X className="w-[1.2rem] h-[1.2rem]" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {form.tags.length < MAX_ITEM_TAGS && (
              <div className="flex items-center gap-[0.8rem]">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  placeholder="Ej. Marvel, Anime..."
                  className={`flex-1 min-w-0 ${INPUT}`}
                  aria-label="Nueva etiqueta"
                />
                <button
                  type="button"
                  onClick={() => {
                    const tag = tagInput.trim();
                    if (tag && !form.tags.includes(tag) && form.tags.length < MAX_ITEM_TAGS) {
                      setForm({ ...form, tags: [...form.tags, tag] });
                    }
                    setTagInput('');
                  }}
                  disabled={!tagInput.trim()}
                  className="shrink-0 w-[3.4rem] h-[3.4rem] flex items-center justify-center rounded-[0.6rem] bg-heading text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity duration-150"
                  aria-label="Agregar etiqueta"
                >
                  <Plus className="w-[1.6rem] h-[1.6rem]" />
                </button>
              </div>
            )}
          </div>

          {/* ── NOTAS ───────────────────────────────────────────────────────── */}
          <div className="pt-[2rem]">
            <p className="text-[1.1rem] font-semibold uppercase tracking-widest text-subtle mb-[1.2rem]">
              Notas
            </p>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Observaciones adicionales..."
              className={`${INPUT} resize-none`}
              aria-label="Notas del producto"
            />
          </div>
        </div>
      </SlideOver>
    </div>
    </>
  );
}
