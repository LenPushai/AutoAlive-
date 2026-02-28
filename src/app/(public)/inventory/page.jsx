import VehicleCard from "@/components/domain/VehicleCard";
import { MOCK_VEHICLES } from "@/lib/mock-data";

export const metadata = {
  title: "Inventory | Auto Alive",
  description: "Browse our full range of quality pre-owned vehicles.",
};

export default function InventoryPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="font-brand font-bold text-xs uppercase tracking-[0.2em] text-gold mb-3">
            Our Stock
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-white">
            Browse Inventory
          </h1>
          <p className="text-gray-400 mt-3 max-w-xl">
            Explore our hand-picked selection of quality pre-owned vehicles.
            Every car is inspected, serviced, and ready to drive.
          </p>
        </div>

        {/* Filters placeholder */}
        <div className="mb-8 p-4 bg-gray-900/60 border border-gray-800 rounded-lg flex flex-wrap items-center gap-4">
          <span className="text-sm text-gray-500 font-brand uppercase tracking-wider">Filters coming soon</span>
          <span className="text-xs text-gray-600">|</span>
          <span className="text-sm text-gray-400">{MOCK_VEHICLES.length} vehicles available</span>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_VEHICLES.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
}
