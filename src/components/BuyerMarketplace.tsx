import React, { useState } from 'react';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, FileText, Send, Sparkles, Filter } from 'lucide-react';
import { BuyerInquiry, FarmerListing, ProducePool } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BuyerMarketplaceProps {
  pools: ProducePool[];
  farmerListings: FarmerListing[];
  buyerInquiries: BuyerInquiry[];
  onPostInquiry: (inquiry: BuyerInquiry) => void;
  onFundPool: (poolId: string) => void;
}

export const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({
  pools,
  farmerListings,
  buyerInquiries,
  onPostInquiry,
  onFundPool,
}) => {
  const { t } = useLanguage();
  const [filterState, setFilterState] = useState<string>('all');
  const [showInquiryModal, setShowInquiryModal] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>('');
  const [cropNeeded, setCropNeeded] = useState<string>('Ziro Valley Kiwi');
  const [quantityKg, setQuantityKg] = useState<number>(2000);
  const [offeredPrice, setOfferedPrice] = useState<number>(170);
  const [destinationCity, setDestinationCity] = useState<string>('Delhi NCR Hub');
  const [contractSuccess, setContractSuccess] = useState<string | null>(null);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInq: BuyerInquiry = {
      id: `inq-${Date.now()}`,
      buyerName: buyerName.trim() || 'Procurement Officer',
      company: companyName.trim() || 'Institutional Buyer',
      cropNeeded,
      quantityNeededKg: quantityKg,
      offeredPricePerKg: offeredPrice,
      destinationCity,
      urgency: 'Within 7 days',
    };
    onPostInquiry(newInq);
    setShowInquiryModal(false);
    setContractSuccess(`Buyer Requirement posted for ${quantityKg} kg of ${cropNeeded}. FPO coordinators have been notified!`);
    setTimeout(() => setContractSuccess(null), 5000);
  };

  const handleEscrowCommit = (pool: ProducePool) => {
    onFundPool(pool.id);
    setContractSuccess(
      `Escrow contract initiated for ${pool.cropName}! Direct bank reservation for ${pool.currentQuantityKg} kg allocated.`
    );
    setTimeout(() => setContractSuccess(null), 5000);
  };

  return (
    <section id="buyer-demand" className="py-12 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              Direct Sourcing &amp; B2B Procurement
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Institutional Buyer &amp; Processor Portal
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Procure certified Northeast GI crops in commercial tonnages.
              Eliminate multi-tiered middlemen, access lab-tested single-origin batches, and support hill farmers directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInquiryModal(true)}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>+ Post Bulk Procurement Demand</span>
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {contractSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-sm font-medium">{contractSuccess}</div>
          </div>
        )}

        {/* Active Bulk Demand Ticker / Strip */}
        <div className="mb-10 p-5 rounded-xl bg-stone-50 border border-stone-200">
          <div className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-3 flex items-center justify-between">
            <span>Live Institutional Purchase Inquiries &amp; Standing Tenders</span>
            <span className="text-stone-400 font-normal">Updated hourly</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {buyerInquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-4 bg-white rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-emerald-900">{inq.company}</span>
                    <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                      {inq.urgency}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mb-1">{inq.cropNeeded}</h4>
                  <div className="text-xs text-stone-600 mb-2">
                    Needs: <strong>{inq.quantityNeededKg.toLocaleString()} kg</strong> to {inq.destinationCity}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Offered Rate</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    ₹{inq.offeredPricePerKg}/kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aggregated Single-Origin Farm Lots Available */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-stone-900">
              Aggregated Village Batches (Ready for Contract &amp; Transit)
            </h3>
            <span className="text-xs text-stone-500">
              {pools.length} active collective batches
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider bg-stone-50">
                  <th className="py-3 px-4">Origin &amp; Crop Batch</th>
                  <th className="py-3 px-4">Available Quantity</th>
                  <th className="py-3 px-4">Smallholders Joined</th>
                  <th className="py-3 px-4">Contract Price</th>
                  <th className="py-3 px-4">Traceability / Cert</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {pools.map((pool) => (
                  <tr key={pool.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      <div>{pool.cropName}</div>
                      <div className="text-[11px] text-stone-500 font-normal">{pool.originHub}, {pool.state}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                      {pool.currentQuantityKg.toLocaleString()} / {pool.targetQuantityKg.toLocaleString()} kg
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-mono">
                      {pool.farmersCount} farmers
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-800 text-sm">
                      ₹{pool.pricePerKg}/kg
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>FPO Inspected</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleEscrowCommit(pool)}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors"
                      >
                        Lock Escrow Batch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Individual Farmer Listings */}
        <div className="mt-10 pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Recent Farmer Drop-Offs at Collection Centers
              </h3>
              <p className="text-xs text-stone-500">
                Direct lots brought by smallholders today, ready for immediate dispatch or pool integration
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {farmerListings.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                    <span>{item.village}</span>
                    <span className="font-mono">{item.listedDate}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">{item.crop}</h4>
                  <div className="text-stone-600 mt-1">
                    Grower: <strong>{item.farmerName}</strong>
                  </div>
                  <div className="text-stone-700 mt-1">
                    Quantity: <strong className="font-mono">{item.quantityKg} kg</strong> (Grade {item.grade})
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 mt-3 flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    ₹{item.expectedPrice}/kg
                  </span>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    {item.pooled ? 'Pooled in Collective' : 'Direct Farmgate'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post Buyer Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Post Institutional Sourcing Inquiry
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Your inquiry will be sent to FPO leaders and village collection centers across Arunachal, Sikkim, and Assam.
            </p>

            <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Radisson Blu / Nature's Basket"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Procurement Officer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Crop Required</label>
                <select
                  value={cropNeeded}
                  onChange={(e) => setCropNeeded(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-700 bg-white"
                >
                  <option value="Ziro Valley Organic Kiwi">Ziro Valley Organic Kiwi</option>
                  <option value="Dambuk Mandarin Orange">Dambuk Mandarin Orange</option>
                  <option value="Sikkim Large Cardamom">Sikkim Large Cardamom (Badi Elaichi)</option>
                  <option value="Karbi Anglong High-Oil Ginger">Karbi Anglong High-Oil Ginger</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 uppercase mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    min="200"
                    max="50000"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono font-bold text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 uppercase mb-1">Offered Price (₹/kg)</label>
                  <input
                    type="number"
                    min="30"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono font-bold text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Delivery Destination</label>
                <input
                  type="text"
                  placeholder="e.g. Guwahati Cold Hub or Delhi Terminal"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs"
                >
                  Publish Tender Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
