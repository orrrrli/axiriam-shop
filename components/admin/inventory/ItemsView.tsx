'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Package, ImageIcon, Upload, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import {
  InventoryItem,
  InventoryItemFormData,
  InventoryItemCategory,
  MaterialType,
} from '@/types/inventory';
import { formatPrice } from '@/lib/utils/helpers';
import { useCloudinaryUpload } from '@/lib/hooks/use-cloudinary-upload';
import { CATEGORY_LABELS, TYPE_LABELS, EMPTY_ITEM_FORM } from '@/lib/constants/admin/items.constants';
import { createItem, updateItem, deleteItem } from '@/lib/services/admin/items.service';
import { DataTable } from '@/components/admin/common/organisms/DataTable';
import { Modal } from '@/components/admin/common/organisms/Modal';
import { FormField } from '@/components/admin/common/molecules/FormField';
import { FormInput } from '@/components/admin/common/atoms/FormInput';
import { FormTextarea } from '@/components/admin/common/atoms/FormTextarea';
import { FormNumberInput } from '@/components/admin/common/atoms/FormNumberInput';
import { Button } from '@/components/admin/common/atoms/Button';

type ItemFormState = Omit<InventoryItemFormData, 'quantityCompleto' | 'quantitySencillo'> & {
  quantityCompleto: number | '';
  quantitySencillo: number | '';
};

export default function ItemsView({
  initialItems,
}: {
  initialItems: InventoryItem[];
}): JSX.Element {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<ItemFormState>(EMPTY_ITEM_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleUploadSuccess = useCallback((url: string) => {
    setForm((prev) => ({ ...prev, photoUrl: url }));
    setUploadError(null);
  }, []);

  const handleUploadError = useCallback((msg: string) => {
    setUploadError(msg);
  }, []);

  const openUploadWidget = useCloudinaryUpload(handleUploadSuccess, handleUploadError);

  function openCreate(): void {
    setEditingItem(null);
    setForm(EMPTY_ITEM_FORM);
    setUploadError(null);
    setSaveError(null);
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
      materials: item.materials,
    });
    setUploadError(null);
    setSaveError(null);
    setModalOpen(true);
  }

  async function handleSave(): Promise<void> {
    setSaveError(null);
    const quantityCompleto = Number(form.quantityCompleto) || 0;
    const quantitySencillo = Number(form.quantitySencillo) || 0;
    if (quantityCompleto < 0 || quantitySencillo < 0) {
      setSaveError('Las cantidades no pueden ser negativas.');
      return;
    }
    const payload: InventoryItemFormData = { ...form, quantityCompleto, quantitySencillo };
    setSaving(true);
    try {
      const result = editingItem
        ? await updateItem(editingItem.id, payload)
        : await createItem(payload);

      if (result.success) {
        setModalOpen(false);
        router.refresh();
      } else {
        setSaveError(result.error);
      }
    } catch {
      setSaveError('Error de conexión. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('¿Eliminar este item?')) return;
    setDeletingId(id);
    try {
      const result = await deleteItem(id);
      if (result.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  const columns = [
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
    { header: 'Completo', key: 'quantityCompleto' },
    { header: 'Sencillo', key: 'quantitySencillo' },
    {
      header: 'Precio',
      key: 'price',
      render: (value: number) => <strong className="text-heading">{formatPrice(value)}</strong>,
    },
  ];

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Items</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">
            {items.length} productos en inventario
          </p>
        </div>
        <button
          className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          onClick={openCreate}
        >
          <Plus className="w-[1.6rem] h-[1.6rem]" /> Nuevo Item
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        emptyMessage="No hay items registrados"
        emptyIcon={<Package className="w-[3rem] h-[3rem] opacity-30" />}
        onEdit={openEdit}
        onDelete={(item) => handleDelete(item.id)}
        deletingId={deletingId}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Item' : 'Nuevo Item'}
        maxWidth="54rem"
        footer={
          <div className="w-full flex items-center justify-between gap-[1.2rem]">
            {saveError ? (
              <p className="flex items-center gap-[0.6rem] text-[1.2rem] text-red-500">
                <AlertCircle className="w-[1.4rem] h-[1.4rem] shrink-0" />
                {saveError}
              </p>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-[1.2rem]">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />}
                {editingItem ? 'Guardar Cambios' : 'Crear Item'}
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-[2.4rem]">
          {/* Photo Upload */}
          <div>
            <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
              Foto <span className="normal-case font-normal">(opcional)</span>
            </label>
            <button
              type="button"
              onClick={openUploadWidget}
              className="group relative w-full border-2 border-dashed border-border hover:border-border-focus transition-colors duration-200 rounded overflow-hidden"
            >
              {form.photoUrl ? (
                <>
                  <Image
                    src={form.photoUrl}
                    alt="Preview"
                    width={540}
                    height={300}
                    className="w-full h-[28rem] object-contain"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-[0.8rem] bg-white text-heading text-[1.3rem] font-bold px-[1.6rem] py-[0.8rem] rounded shadow">
                      <Upload className="w-[1.4rem] h-[1.4rem]" /> Cambiar Foto
                    </span>
                  </div>
                </>
              ) : (
                <div className="h-[20rem] flex flex-col items-center justify-center gap-[1.2rem] text-subtle group-hover:text-heading transition-colors duration-200">
                  <Upload className="w-[3.2rem] h-[3.2rem] opacity-40 group-hover:opacity-70 transition-opacity duration-200" />
                  <div className="text-center">
                    <p className="text-[1.4rem] font-medium">Haz clic para subir una foto</p>
                    <p className="text-[1.2rem] opacity-60 mt-[0.2rem]">PNG, JPG, WEBP</p>
                  </div>
                </div>
              )}
            </button>
            {form.photoUrl && (
              <button
                type="button"
                onClick={() => setForm({ ...form, photoUrl: undefined })}
                className="mt-[0.8rem] text-[1.2rem] text-red-500 hover:text-red-700 transition-colors duration-150"
              >
                Quitar foto
              </button>
            )}
            {uploadError && (
              <p className="flex items-center gap-[0.4rem] text-[1.2rem] text-red-500 mt-[0.6rem]">
                <AlertCircle className="w-[1.4rem] h-[1.4rem] shrink-0" />
                {uploadError}
              </p>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Basic Info */}
          <div className="flex flex-col gap-[1.6rem]">
            <p className="text-[1.1rem] font-bold text-subtle uppercase tracking-widest">
              Información del Producto
            </p>
            <FormField label="Nombre" required>
              <FormInput
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
                placeholder="Ej. Bandana Básica"
                aria-label="Nombre del item"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-[1.6rem]">
              <FormField label="Categoría">
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-border px-[1.6rem] py-[1.2rem] pr-[4rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus transition-colors duration-150 bg-white cursor-pointer"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as InventoryItemCategory })
                    }
                    aria-label="Categoría del item"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-[1.4rem] top-1/2 -translate-y-1/2 w-[1.6rem] h-[1.6rem] text-subtle" />
                </div>
              </FormField>
              <FormField label="Tipo">
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-border px-[1.6rem] py-[1.2rem] pr-[4rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus transition-colors duration-150 bg-white cursor-pointer"
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as MaterialType })
                    }
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
              </FormField>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Stock & Price */}
          <div className="flex flex-col gap-[1.6rem]">
            <p className="text-[1.1rem] font-bold text-subtle uppercase tracking-widest">
              Stock y Precio
            </p>
            <div className="grid grid-cols-3 gap-[1.6rem]">
              <FormField label="Completo">
                <FormNumberInput
                  value={form.quantityCompleto}
                  onChange={(value) => setForm({ ...form, quantityCompleto: value })}
                  min={0}
                  aria-label="Cantidad completo"
                />
              </FormField>
              <FormField label="Sencillo">
                <FormNumberInput
                  value={form.quantitySencillo}
                  onChange={(value) => setForm({ ...form, quantitySencillo: value })}
                  min={0}
                  aria-label="Cantidad sencillo"
                />
              </FormField>
              <FormField label="Precio">
                <FormNumberInput
                  value={form.price}
                  onChange={(value) => setForm({ ...form, price: value === '' ? 0 : value })}
                  min={0}
                  step={0.01}
                  aria-label="Precio del item"
                />
              </FormField>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Notes */}
          <FormField label="Notas">
            <FormTextarea
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              rows={3}
              placeholder="Observaciones adicionales..."
              aria-label="Notas del item"
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
