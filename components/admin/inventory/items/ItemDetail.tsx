'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Tag, Layers, DollarSign, Calendar, FileText } from 'lucide-react';
import { InventoryItem } from '@/types/inventory';
import { CATEGORY_LABELS, TYPE_LABELS } from '@/lib/constants/admin/items.constants';
import { formatPrice, formatDate } from '@/lib/utils/helpers';

interface ItemDetailProps {
  item: InventoryItem;
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex items-start gap-[1.2rem] p-[1.6rem] bg-white border border-gray-100 rounded-[1rem]">
      <div className="w-[3.6rem] h-[3.6rem] rounded-[0.8rem] bg-[#f5f5f5] flex items-center justify-center shrink-0 text-gray-400">
        {icon}
      </div>
      <div>
        <p className="text-[1.15rem] font-medium text-gray-400 uppercase tracking-wide mb-[0.2rem]">{label}</p>
        <div className="text-[1.4rem] font-semibold text-[#101010]">{value}</div>
      </div>
    </div>
  );
}

export default function ItemDetail({ item }: ItemDetailProps): React.ReactElement {
  const router = useRouter();

  const totalStock = item.quantityCompleto + item.quantitySencillo;

  return (
    <div className="w-full max-w-[96rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">

      {/* Back + Header */}
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
            <h1 className="text-heading text-[2.2rem] font-bold">{item.name}</h1>
            <span className="inline-block px-[1rem] py-[0.3rem] rounded-full text-[1.1rem] font-semibold bg-[#101010] text-white">
              {CATEGORY_LABELS[item.category]}
            </span>
            <span className="inline-block px-[1rem] py-[0.3rem] rounded-full text-[1.1rem] font-medium bg-gray-100 text-gray-600 border border-gray-200">
              {TYPE_LABELS[item.type]}
            </span>
          </div>
          <p className="text-subtle text-[1.3rem] mt-[0.3rem]">
            Actualizado {formatDate(item.updatedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/admin/inventory/items`)}
          className="button button-muted text-[1.3rem]"
        >
          Ver todos
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_2fr] gap-[2.4rem] max-xs:grid-cols-1">

        {/* Left: Photo + Tags */}
        <div className="flex flex-col gap-[2rem]">
          {/* Photo */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] overflow-hidden">
            {item.photoUrl ? (
              <div className="relative w-full aspect-square">
                <Image
                  src={item.photoUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 800px) 100vw, 400px"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-[1.2rem] py-[5rem] text-gray-300">
                <Package className="w-[5rem] h-[5rem]" />
                <p className="text-[1.3rem] text-gray-400">Sin foto</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <div className="flex items-center gap-[0.8rem] mb-[1.4rem]">
              <Tag className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              <h2 className="text-[1.4rem] font-semibold text-[#101010]">Etiquetas</h2>
            </div>
            {item.tags.length > 0 ? (
              <div className="flex flex-wrap gap-[0.6rem]">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-[1.2rem] py-[0.5rem] rounded-full text-[1.2rem] font-medium bg-[#f5f5f5] text-[#101010] border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[1.3rem] text-gray-400">Sin etiquetas</p>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-[2rem]">
          {/* Stock + Price cards */}
          <div className="grid grid-cols-2 gap-[1.2rem] max-xs:grid-cols-1">
            <InfoCard
              icon={<Layers className="w-[1.8rem] h-[1.8rem]" />}
              label="Stock completo"
              value={item.quantityCompleto}
            />
            <InfoCard
              icon={<Layers className="w-[1.8rem] h-[1.8rem]" />}
              label="Stock sencillo"
              value={item.quantitySencillo}
            />
            <InfoCard
              icon={<Package className="w-[1.8rem] h-[1.8rem]" />}
              label="Stock total"
              value={totalStock}
            />
            <InfoCard
              icon={<DollarSign className="w-[1.8rem] h-[1.8rem]" />}
              label="Precio"
              value={formatPrice(item.price)}
            />
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <div className="flex items-center gap-[0.8rem] mb-[1.2rem]">
              <FileText className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              <h2 className="text-[1.4rem] font-semibold text-[#101010]">Notas</h2>
            </div>
            {item.description ? (
              <p className="text-[1.4rem] text-paragraph leading-relaxed whitespace-pre-wrap">{item.description}</p>
            ) : (
              <p className="text-[1.3rem] text-gray-400">Sin notas</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-[1.2rem] max-xs:grid-cols-1">
            <InfoCard
              icon={<Calendar className="w-[1.8rem] h-[1.8rem]" />}
              label="Creado"
              value={formatDate(item.createdAt)}
            />
            <InfoCard
              icon={<Calendar className="w-[1.8rem] h-[1.8rem]" />}
              label="Actualizado"
              value={formatDate(item.updatedAt)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
