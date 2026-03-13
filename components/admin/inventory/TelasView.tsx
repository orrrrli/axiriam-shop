'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Palette } from 'lucide-react';
import { RawMaterial, RawMaterialFormData } from '@/types/inventory';
import { TELA_TYPE_LABELS, EMPTY_TELA_FORM } from '@/lib/constants/admin/telas.constants';
import { createTela, updateTela, deleteTela } from '@/lib/services/admin/telas.service';
import {
  Modal,
  DataTable,
  FormField,
  FormInput,
  FormTextarea,
  FormSelect,
  FormNumberInput,
} from '@/components/admin/common';

export default function DesignsView({ initialDesigns }: { initialDesigns: RawMaterial[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialDesigns);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RawMaterial | null>(null);
  const [form, setForm] = useState<RawMaterialFormData>(EMPTY_TELA_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openCreate() {
    setEditingItem(null);
    setForm(EMPTY_TELA_FORM);
    setModalOpen(true);
  }

  function openEdit(item: RawMaterial) {
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
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = editingItem
        ? await updateTela(editingItem.id, form)
        : await createTela(form);

      if (result.success) {
        setModalOpen(false);
        router.refresh();
      } else {
        alert(result.error);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta tela?')) return;
    setDeletingId(id);
    try {
      const result = await deleteTela(id);
      if (result.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(result.error);
      }
    } finally {
      setDeletingId(null);
    }
  }

  const columns = [
    { 
      header: 'Nombre', 
      key: 'name', 
      render: (value: string) => <span className="font-bold text-heading">{value}</span> 
    },
    { 
      header: 'Tipo', 
      key: 'type', 
      render: (value: string) => TELA_TYPE_LABELS[value] ?? value 
    },
    { header: 'Ancho (m)', key: 'width' },
    { header: 'Alto (m)', key: 'height' },
    { header: 'Stock', key: 'quantity' },
    { 
      header: 'Precio', 
      key: 'price', 
      render: (value: number) => <span className="font-bold text-heading">${value.toFixed(2)}</span> 
    },
    { header: 'Proveedor', key: 'supplier' },
  ];

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Telas</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">{items.length} telas registradas</p>
        </div>
        <button className="button flex items-center gap-[0.8rem] text-[1.3rem]" onClick={openCreate}>
          <Plus className="w-[1.6rem] h-[1.6rem]" /> Nueva Tela
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        emptyMessage="No hay telas registradas"
        emptyIcon={<Palette className="w-[3rem] h-[3rem] opacity-30" />}
        onEdit={openEdit}
        onDelete={(item) => handleDelete(item.id)}
        deletingId={deletingId}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Tela' : 'Nueva Tela'}
        footer={
          <>
            <button className="button button-muted" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button
              className="button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Guardando...' : editingItem ? 'Guardar Cambios' : 'Crear Tela'}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-[2rem]">
          <FormField label="Nombre">
            <FormInput
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
              aria-label="Nombre"
            />
          </FormField>

          <FormField label="Descripción">
            <FormTextarea
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              rows={3}
              aria-label="Descripción"
            />
          </FormField>

          <FormField label="Tipo">
            <FormSelect
              value={form.type}
              onChange={(value) => setForm({ ...form, type: value as any })}
              options={Object.entries(TELA_TYPE_LABELS).map(([v, l]) => ({
                value: v,
                label: l,
              }))}
              aria-label="Tipo"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-[2rem]">
            <FormField label="Ancho (m)">
              <FormNumberInput
                value={form.width}
                onChange={(value) => setForm({ ...form, width: value === '' ? 0 : value })}
                min={0}
                step={0.01}
                aria-label="Ancho (m)"
              />
            </FormField>
            <FormField label="Alto (m)">
              <FormNumberInput
                value={form.height}
                onChange={(value) => setForm({ ...form, height: value === '' ? 0 : value })}
                min={0}
                step={0.01}
                aria-label="Alto (m)"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-[2rem]">
            <FormField label="Stock">
              <FormNumberInput
                value={form.quantity}
                onChange={(value) => setForm({ ...form, quantity: value === '' ? 0 : value })}
                min={0}
                aria-label="Stock"
              />
            </FormField>
            <FormField label="Precio">
              <FormNumberInput
                value={form.price}
                onChange={(value) => setForm({ ...form, price: value === '' ? 0 : value })}
                min={0}
                step={0.01}
                aria-label="Precio"
              />
            </FormField>
          </div>

          <FormField label="Proveedor">
            <FormInput
              value={form.supplier}
              onChange={(value) => setForm({ ...form, supplier: value })}
              aria-label="Proveedor"
            />
          </FormField>

          <FormField label="URL Imagen (opcional)">
            <FormInput
              value={form.imageUrl ?? ''}
              onChange={(value) => setForm({ ...form, imageUrl: value })}
              placeholder="https://..."
              aria-label="URL Imagen"
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
