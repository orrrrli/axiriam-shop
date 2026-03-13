'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2, Palette } from 'lucide-react';
import { RawMaterial, RawMaterialFormData } from '@/types/inventory';

const TYPE_LABELS: Record<string, string> = {
  algodon: 'Algodón',
  normal: 'Normal',
  stretch: 'Stretch',
  satin: 'Satín',
  'stretch-antifluido': 'Stretch Antifluido',
  'microfibra-antifluido': 'Microfibra Antifluido',
};

const emptyForm: RawMaterialFormData = {
  name: '',
  description: '',
  type: 'normal',
  width: 0,
  height: 0,
  quantity: 0,
  price: 0,
  supplier: '',
  imageUrl: '',
};

export default function DesignsView({ initialDesigns }: { initialDesigns: RawMaterial[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialDesigns);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RawMaterial | null>(null);
  const [form, setForm] = useState<RawMaterialFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openCreate() {
    setEditingItem(null);
    setForm(emptyForm);
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
      const url = editingItem
        ? `/api/admin/inventory/designs/${editingItem.id}`
        : '/api/admin/inventory/designs';
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setModalOpen(false);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este diseño?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/inventory/designs/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  const COLUMNS = ['Nombre', 'Tipo', 'Ancho (m)', 'Alto (m)', 'Stock', 'Precio', 'Proveedor', 'Acciones'];

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Diseños</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">{items.length} diseños registrados</p>
        </div>
        <button className="button flex items-center gap-[0.8rem] text-[1.3rem]" onClick={openCreate}>
          <Plus className="w-[1.6rem] h-[1.6rem]" /> Nuevo Diseño
        </button>
      </div>

      <div className="bg-white border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-body-alt">
                {COLUMNS.map((h) => (
                  <th key={h} className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="py-[6rem] text-center text-subtle text-[1.4rem]">
                    <Palette className="w-[3rem] h-[3rem] mx-auto mb-[1rem] opacity-30" />
                    No hay diseños registrados
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-body transition-colors duration-200">
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">{item.name}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">{TYPE_LABELS[item.type] ?? item.type}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">{item.width}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">{item.height}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">{item.quantity}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">${item.price.toFixed(2)}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">{item.supplier}</td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <div className="flex items-center gap-[0.8rem]">
                      <button
                        onClick={() => openEdit(item)}
                        className="button button-muted button-small flex items-center gap-[0.4rem]"
                      >
                        <Pencil className="w-[1.2rem] h-[1.2rem]" /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="button button-danger button-small flex items-center gap-[0.4rem]"
                      >
                        {deletingId === item.id
                          ? <Loader2 className="w-[1.2rem] h-[1.2rem] animate-spin" />
                          : <Trash2 className="w-[1.2rem] h-[1.2rem]" />}
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal animate-fade-in">
          <div className="bg-white w-full max-w-[54rem] max-h-[90vh] overflow-y-auto">
            <div className="px-[3rem] py-[2rem] border-b border-border">
              <h2 className="text-heading text-[1.8rem]">
                {editingItem ? 'Editar Diseño' : 'Nuevo Diseño'}
              </h2>
            </div>

            <div className="px-[3rem] py-[2.4rem] flex flex-col gap-[2rem]">
              <div>
                <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
                  Nombre
                </label>
                <input
                  className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
                  Tipo
                </label>
                <select
                  className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus bg-white"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                >
                  {Object.entries(TYPE_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-[2rem]">
                <div>
                  <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
                    Ancho (m)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus"
                    value={form.width}
                    onChange={(e) => setForm({ ...form, width: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
                    Alto (m)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[2rem]">
                <div>
                  <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
                    Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
                    Precio
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
                  Proveedor
                </label>
                <input
                  className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus"
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">
                  URL Imagen <span className="normal-case font-normal">(opcional)</span>
                </label>
                <input
                  className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus"
                  value={form.imageUrl ?? ''}
                  placeholder="https://..."
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="px-[3rem] py-[2rem] border-t border-border flex justify-end gap-[1.2rem]">
              <button className="button button-muted" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button
                className="button flex items-center gap-[0.8rem]"
                onClick={handleSave}
                disabled={saving}
              >
                {saving && <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />}
                {editingItem ? 'Guardar Cambios' : 'Crear Diseño'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
