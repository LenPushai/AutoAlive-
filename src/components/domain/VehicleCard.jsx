import Link from "next/link";
import { formatZAR, formatKM, calculateMonthly } from "@/lib/mock-data";

export default function VehicleCard({ vehicle }) {
  const monthly = calculateMonthly(vehicle.price);

  return (
    <Link href={`/inventory/${vehicle.id}`} className="group block">
      <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gold/30 transition-all duration-500 hover:shadow-xl hover:shadow-gold/5">
        {/* Image */}
        <div className="relative aspect-[16/10] bg-gray-800 overflow-hidden">
          {/* Placeholder gradient — replace with real images */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-xs font-body">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            </div>
          </div>

          {/* Badge */}
          {vehicle.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-gold text-black text-xs font-brand font-bold uppercase tracking-wider rounded">
              {vehicle.badge}
            </span>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Details */}
        <div className="p-5 space-y-3">
          <div>
            <p className="text-xs text-gold font-brand font-bold uppercase tracking-wider">
              {vehicle.year} · {vehicle.make}
            </p>
            <h3 className="font-heading text-lg text-white mt-1 group-hover:text-gold-light transition-colors duration-300">
              {vehicle.model}
            </h3>
          </div>

          {/* Specs row */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {vehicle.fuel}
            </span>
            <span className="w-px h-3 bg-gray-700" />
            <span>{vehicle.transmission}</span>
            <span className="w-px h-3 bg-gray-700" />
            <span>{formatKM(vehicle.mileage)}</span>
          </div>

          {/* Price */}
          <div className="pt-3 border-t border-gray-800 flex items-end justify-between">
            <div>
              <p className="text-xl font-heading font-bold text-white">
                {formatZAR(vehicle.price)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Est. {formatZAR(monthly)}/mo
              </p>
            </div>
            <span className="text-gold text-xs font-brand font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
              View
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
