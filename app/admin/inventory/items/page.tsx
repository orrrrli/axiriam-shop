'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react';
import { InventoryItem, InventoryItemFormData } from '@/types/inventory';
import { formatPrice } from '@/lib/utils/helpers';

const CATEGORY_LABELS: Record<string, string> = {
  sencillo: 'Sencillo',
  'doble-vista': 'Doble Vista',
  completo: 'Completo',
};

const TYPE_LABELS: Record<string, string> = {
  algodon: 'Algodón',
  normal: 'Normal',
  microfibra: 'Microfibra',
  stretch: 'Stretch',
  satin: 'Satín',
  'stretch-antifluido': 'Stretch Antifluido',
  'microfibra-antifluido': 'Microfibra Antifluido',
};

const emptyForm: InventoryItemFormData = {
  name: '',
  category: 'sencillo',
  type: 'normal',
  description: '',
  quantity: 0,
  price: 0,
  materials: [],
};

export default function ItemsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<InventoryItemFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user?.role !== 'admin')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchItems();
    }
  }, [status, session]);

  async function fetchItems() {
    try {
      const res = await fetch('/api/admin/inventory/items');
      const data = await res.json();
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingItem(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: InventoryItem) {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      type: item.type,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      materials: item.materials,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editingItem
        ? `/api/admin/inventory/items/${editingItem.id}`
        : '/api/admin/inventory/items';
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchItems();
        setModalOpen(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este item?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/inventory/items/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-[3rem] h-[3rem] animate-spin text-heading" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Items</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">{items.length} productos en inventario</p>
        </div>
        <button className="button flex items-center gap-[0.8rem] text-[1.3rem]" onClick={openCreate}>
          <Plus className="w-[1.6rem] h-[1.6rem]" />
          Nuevo Item
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-body-alt">
                {['Nombre', 'Categoría', 'Tipo', 'Cantidad', 'Precio', 'Acciones'].map((h) => (
                  <th key={h} className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-[6rem] text-center text-subtle text-[1.4rem]">
                    <Package className="w-[3rem] h-[3rem] mx-auto mb-[1rem] opacity-30" />
                    No hay items registrados
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-body transition-colors duration-200">
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">{item.name}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">{CATEGORY_LABELS[item.category] ?? item.category}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">{TYPE_LABELS[item.type] ?? item.type}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">{item.quantity}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">{formatPrice(item.price)}</td>
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal animate-fade-in">
          <div className="bg-white w-full max-w-[54rem] max-h-[90vh] overflow-y-auto">
            <div className="px-[3rem] py-[2rem] border-b border-border">
              <h2 className="text-heading text-[1.8rem]">
                {editingItem ? 'Editar Item' : 'Nuevo Item'}
              </h2>
            </div>
            <div className="px-[3rem] py-[2.4rem] flex flex-col gap-[2rem]">
              <div>
                <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">Nombre</label>
                <input
                  className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-[2rem]">
                <div>
                  <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">Categoría</label>
                  <select
                    className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus bg-white"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  >
                    {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">Tipo</label>
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
              </div>
              <div>
                <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">Descripción</label>
                <textarea
                  rows={3}
                  className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-[2rem]">
                <div>
                  <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">Cantidad</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border border-border px-[1.6rem] py-[1.2rem] text-[1.4rem] text-heading focus:outline-none focus:border-border-focus"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-[1.2rem] font-bold text-subtle uppercase tracking-wide mb-[0.8rem]">Precio</label>
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
            </div>
            <div className="px-[3rem] py-[2rem] border-t border-border flex justify-end gap-[1.2rem]">
              <button className="button button-muted" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="button flex items-center gap-[0.8rem]" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />}
                {editingItem ? 'Guardar Cambios' : 'Crear Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
