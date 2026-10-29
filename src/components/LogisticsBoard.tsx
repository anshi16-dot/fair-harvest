import React, { useState } from 'react';
import { Truck, MapPin, Calendar, Phone, CheckCircle, Volume2, PackageCheck } from 'lucide-react';
import { TransportRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LogisticsBoardProps {
  routes: TransportRoute[];
  onBookCrates: (routeId: string, cratesCount: number) => void;
}

export const LogisticsBoard: React.FC<LogisticsBoardProps> = ({ routes, onBookCrates }) => {
  const { t, speak, language } = useLanguage();
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);
  const [cratesCount, setCratesCount] = useState<number>(4);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleSpeakRoute = (route: TransportRoute) => {
    let text = '';
    if (language === 'hi') {
      text = `${route.routeName} का अगला वाहन ${route.nextDeparture} पर रवाना होगा। प्रति क्रेट भाड़ा मात्र ${route.costPerCrate} रुपये है। संग्रह केंद्र ${route.consolidationHub} है।`;
    } else if (language === 'as') {
      text = `${route.routeName}ৰ পৰৱৰ্তী গাড়ী ${route.nextDeparture}ত ৰাওনা হ'ব। প্ৰতি ক্ৰেটৰ ভাড়া মাত্ৰ ${route.costPerCrate} টকা। সংগ্ৰহ কেন্দ্ৰ ${route.consolidationHub}।`;
    } else {
      text = `Next scheduled departure for ${route.routeName} is ${route.nextDeparture}. Shared freight cost is only ₹${route.costPerCrate} per crate. Collection point is ${route.consolidationHub}.`;
    }
    speak(text);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoute) return;

    onBookCrates(selectedRoute.id, cratesCount);
    setBookingSuccess(
      `Space booked for ${cratesCount} crates on ${selectedRoute.routeName}. Please bring crates to ${selectedRoute.consolidationHub} before departure.`
    );
    setSelectedRoute(null);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  return (
    <section id="transport" className="py-12 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              Shared Hill Freight &amp; Logistics
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t('transportPooling')}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Hiring private hill transport can cost ₹6,000–₹8,000 per trip.
              Share scheduled village trucks and pay only per crate (~20 kg).
            </p>
          </div>

          <div className="text-xs text-stone-700 bg-emerald-100/60 border border-emerald-300 px-3.5 py-2 rounded-lg font-medium">
            <span>Cut hill transport cost by up to <strong>78%</strong></span>
          </div>
        </div>

        {/* Success Alert */}
        {bookingSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-sm font-medium">{bookingSuccess}</div>
          </div>
        )}

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((route) => {
            const availableCrates = route.totalCapacityCrates - route.bookedCrates;
            const pctBooked = Math.round((route.bookedCrates / route.totalCapacityCrates) * 100);

            return (
              <div
                key={route.id}
                className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        <span>{route.vehicleType}</span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900">
                        {route.routeName}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleSpeakRoute(route)}
                      className="p-1.5 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 transition-colors"
                      title="Audio announcement of vehicle schedule"
                      aria-label="Audio announcement of vehicle schedule"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-700" />
                    </button>
                  </div>

                  {/* Route trajectory */}
                  <div className="bg-stone-50 rounded-lg p-3 border border-stone-200 mb-4 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-stone-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Origin: <strong>{route.originVillage}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-500 pl-1 border-l border-stone-300 ml-1">
                      <span>Transit Hub: {route.transitHub}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-700">
                      <span className="w-2 h-2 rounded-full bg-stone-900"></span>
                      <span>Destination: <strong>{route.destinationMandi}</strong></span>
                    </div>
                  </div>

                  {/* Details strip */}
                  <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                    <div className="p-2 rounded bg-stone-50 border border-stone-200">
                      <div className="text-stone-500 text-[11px]">Departure</div>
                      <div className="font-semibold text-stone-900 mt-0.5">{route.nextDeparture}</div>
                    </div>
                    <div className="p-2 rounded bg-stone-50 border border-stone-200">
                      <div className="text-stone-500 text-[11px]">Cost / Crate</div>
                      <div className="font-bold text-emerald-800 font-mono mt-0.5">₹{route.costPerCrate}</div>
                    </div>
                    <div className="p-2 rounded bg-stone-50 border border-stone-200">
                      <div className="text-stone-500 text-[11px]">Frequency</div>
                      <div className="font-semibold text-stone-900 mt-0.5">{route.frequency}</div>
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                      <span>Capacity: {route.bookedCrates} / {route.totalCapacityCrates} crates filled</span>
                      <span className="font-semibold text-stone-800">{availableCrates} available</span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-700"
                        style={{ width: `${pctBooked}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-stone-500 flex items-center justify-between border-t border-stone-100 pt-3">
                    <span className="truncate max-w-[200px]">Hub: {route.consolidationHub}</span>
                    <span className="text-stone-700 font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400" />
                      {route.driverContact.split(' ')[2]}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setSelectedRoute(route);
                      setCratesCount(2);
                    }}
                    disabled={availableCrates <= 0}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                  >
                    {availableCrates > 0 ? t('reserveSpace') : 'Vehicle Full'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Book Space: {selectedRoute.routeName}
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Vehicle departs <strong>{selectedRoute.nextDeparture}</strong> from {selectedRoute.consolidationHub}.
            </p>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Number of Crates (approx 20kg each)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={selectedRoute.totalCapacityCrates - selectedRoute.bookedCrates}
                    value={cratesCount}
                    onChange={(e) => setCratesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-lg font-mono font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    required
                  />
                  <span className="text-sm font-semibold text-stone-600">crates</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Rate per crate</span>
                  <span className="font-mono">₹{selectedRoute.costPerCrate}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-1 border-t border-stone-200">
                  <span>Total Freight Cost</span>
                  <span className="font-mono text-emerald-800">
                    ₹{(cratesCount * selectedRoute.costPerCrate).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 pt-1">
                  (Compare to ₹6,500 private vehicle hire. You save ₹{6500 - (cratesCount * selectedRoute.costPerCrate)}!)
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRoute(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Confirm Crate Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
