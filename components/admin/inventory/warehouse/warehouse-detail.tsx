'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Image as ImageIcon,
  Ruler,
  Tag,
  DollarSign,
  Package,
  User,
  CalendarDays,
  FileText,
  Link2,
} from 'lucide-react';
import { RawMaterial, InventoryItem } from '@/types/inventory';
import { formatDate, formatPrice } from '@/lib/utils/helpers';
import { WAREHOUSE_TYPE_LABELS } from '@/lib/constants/admin/warehouse.constants';
import { slugifyItemName } from '@/lib/utils/inventory';

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

interface WarehouseDetailProps {
  material: RawMaterial;
  linkedItems: InventoryItem[];
}

export default function WarehouseDetail({ material, linkedItems }: WarehouseDetailProps): React.ReactElement {
  const router = useRouter();

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
          <div className="flex items-center gap-[1rem] flex-wrap">
            <h1 className="text-heading text-[2.2rem] font-bold truncate">{material.name}</h1>
            <span className="text-[1.2rem] font-semibold px-[0.8rem] py-[0.2rem] bg-gray-100 text-gray-500 rounded-full">
              {WAREHOUSE_TYPE_LABELS[material.type] ?? material.type}
            </span>
          </div>
          <p className="text-subtle text-[1.3rem] mt-[0.2rem]">Creado {formatDate(material.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-[2.4rem] max-xs:grid-cols-1">
        {/* Left column */}
        <div className="flex flex-col gap-[2rem]">
          {/* Image */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] overflow-hidden">
            {material.imageUrl ? (
              <div className="relative w-full aspect-square">
                <Image src={material.imageUrl} alt={material.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-[#e2e5ea]">
                <ImageIcon className="w-[6rem] h-[6rem] text-gray-400" />
              </div>
            )}
          </div>

          {/* Identification */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <Tag className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Identificación
            </SectionTitle>
            <div className="flex flex-col gap-[1rem]">
              <InfoCard
                icon={<Tag className="w-[1.6rem] h-[1.6rem]" />}
                label="Tipo"
                value={WAREHOUSE_TYPE_LABELS[material.type] ?? material.type}
              />
              {material.supplier && (
                <InfoCard
                  icon={<User className="w-[1.6rem] h-[1.6rem]" />}
                  label="Proveedor"
                  value={material.supplier}
                />
              )}
              <InfoCard
                icon={<DollarSign className="w-[1.6rem] h-[1.6rem]" />}
                label="Precio"
                value={`$${material.price.toFixed(2)}`}
              />
              <InfoCard
                icon={<CalendarDays className="w-[1.6rem] h-[1.6rem]" />}
                label="Última actualización"
                value={formatDate(material.updatedAt)}
              />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[2rem]">
          {/* Dimensions & yield */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <Ruler className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Dimensiones y Rendimiento
            </SectionTitle>
            <div className="flex flex-col gap-[1rem]">
              <InfoCard
                icon={<Ruler className="w-[1.6rem] h-[1.6rem]" />}
                label="Dimensiones"
                value={`${material.width} × ${material.height} m`}
              />
              <InfoCard
                icon={<Package className="w-[1.6rem] h-[1.6rem]" />}
                label="Rendimiento"
                value={
                  material.quantity > 0 ? (
                    <span>
                      {material.quantity}{' '}
                      <span className="text-gray-400 font-normal text-[1.2rem]">items estimados</span>
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal">Sin rendimiento registrado</span>
                  )
                }
              />
            </div>
          </div>

          {/* Description */}
          {material.description && (
            <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
              <SectionTitle>
                <FileText className="w-[1.6rem] h-[1.6rem] text-gray-400" />
                Descripción
              </SectionTitle>
              <p className="text-[1.4rem] text-paragraph leading-relaxed">{material.description}</p>
            </div>
          )}

          {/* Linked products */}
          <div className="bg-white border border-gray-100 rounded-[1.2rem] p-[2rem]">
            <SectionTitle>
              <Link2 className="w-[1.6rem] h-[1.6rem] text-gray-400" />
              Productos vinculados
            </SectionTitle>
            {linkedItems.length === 0 ? (
              <p className="text-[1.3rem] text-gray-400">Sin productos vinculados a este material.</p>
            ) : (
              <div className="flex flex-col gap-[0.8rem]">
                {linkedItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => router.push(`/admin/inventory/items/${slugifyItemName(item.name)}`)}
                    className="flex items-center gap-[1.2rem] p-[1rem] rounded-[0.8rem] border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-150 text-left w-full"
                  >
                    {item.photoUrl ? (
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-[0.4rem] object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-[4rem] h-[4rem] rounded-[0.4rem] bg-[#f5f5f5] flex items-center justify-center shrink-0">
                        <Package className="w-[1.8rem] h-[1.8rem] text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[1.3rem] font-semibold text-heading truncate">{item.name}</p>
                      <p className="text-[1.2rem] text-gray-400">
                        {formatPrice(item.price)} · Completo: {item.quantityCompleto} · Sencillo: {item.quantitySencillo}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
