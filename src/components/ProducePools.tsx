import React, { useState } from 'react';
import { Users, Calendar, MapPin, Truck, Volume2, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { ProducePool, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProducePoolsProps {
  pools: ProducePool[];
  userRole: UserRole;
  onJoinPool: (pool: ProducePool, quantityKg: number) => void;
  onBuyerFundPool: (poolId: string) => void;
}

export const ProducePools: React.FC<ProducePoolsProps> = ({
  pools,
  userRole,
  onJoinPool,
  onBuyerFundPool,
}) => {
  const { t, speak, language } = useLanguage();
  const [selectedPoolForJoin, setSelectedPoolForJoin] = useState<ProducePool | null>(null);
  const [contributionKg, setContributionKg] = useState<number>(50);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  const handleSpeakPool = (pool: ProducePool) => {
    const remaining = pool.targetQuantityKg - pool.currentQuantityKg;
    let text = '';
    if (language === 'hi') {
      text = `${pool.cropName} में अब तक ${pool.farmersCount} किसानों ने मिलकर ${pool.currentQuantityKg} किलो जमा किया है। लक्ष्य पूरा होने में ${remaining} किलो बाकी है। भाव ${pool.pricePerKg} रुपये प्रति किलो तय है।`;
    } else if (language === 'as') {
      text = `${pool.cropName}ত এতিয়ালৈকে ${pool.farmersCount} জন কৃষকে মিলি ${pool.currentQuantityKg} কিলোগ্ৰাম সংগ্ৰহ কৰিছে। আৰু ${remaining} কিলোগ্ৰাম বাকি আছে। মূল্য প্ৰতি কেজিত ${pool.pricePerKg} টকা।`;
    } else {
      text = `${pool.cropName}: ${pool.farmersCount} smallholder farmers have pooled ${pool.currentQuantityKg} kilograms of ${pool.targetQuantityKg} kg target. Direct price locked at ₹${pool.pricePerKg} per kilogram.`;
    }
    speak(text);
  };

  const handleConfirmJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoolForJoin) return;

    onJoinPool(selectedPoolForJoin, contributionKg);
    setSuccessFeedback(
      `Successfully added ${contributionKg} kg to ${selectedPoolForJoin.cropName}! Collection slip generated for ${selectedPoolForJoin.originHub}.`
    );
    setSelectedPoolForJoin(null);
    setTimeout(() => setSuccessFeedback(null), 5000);
  };

  return (
    <section id="produce-pools" className="py-12 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              Collective Smallholder Aggregation
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t('producePools')}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Individual hill farmers often grow only 30–150 kg. By pooling into village collectives,
              we meet the bulk truckload needs of hotel chains and food processors at top rates.
            </p>
          </div>

          <div className="text-xs text-stone-600 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200">
            <span>Minimum contribution as low as <strong>10 kg</strong></span>
          </div>
        </div>

        {/* Success Alert */}
        {successFeedback && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-sm font-medium">{successFeedback}</div>
          </div>
        )}

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pools.map((pool) => {
            const percentFilled = Math.min(100, Math.round((pool.currentQuantityKg / pool.targetQuantityKg) * 100));
            const remainingKg = Math.max(0, pool.targetQuantityKg - pool.currentQuantityKg);

            return (
              <div
                key={pool.id}
                className="bg-stone-50/70 rounded-xl border border-stone-200 p-6 flex flex-col justify-between hover:border-emerald-700/50 transition-all shadow-xs"
              >
                <div>
                  {/* Top Bar with Hub and Audio Button */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-medium text-stone-700">{pool.originHub}</span>
                        <span>({pool.state})</span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 leading-snug">
                        {pool.cropName}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleSpeakPool(pool)}
                      className="p-2 rounded-full bg-white border border-stone-200 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 transition-colors shadow-xs"
                      title="Listen to pool status in audio"
                      aria-label="Listen to pool status in audio"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-700" />
                    </button>
                  </div>

                  {/* Progress Bar & Quantity stats */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-stone-600 font-medium">
                        Progress: <strong className="text-stone-900 font-mono">{percentFilled}%</strong>
                      </span>
                      <span className="text-stone-500">
                        Target: <span className="font-mono font-semibold text-stone-800">{pool.targetQuantityKg.toLocaleString()} kg</span>
                      </span>
                    </div>

                    <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          percentFilled >= 100 ? 'bg-emerald-600' : 'bg-emerald-700'
                        }`}
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs mt-2 text-stone-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-500" />
                        <span><strong>{pool.farmersCount}</strong> farmers joined</span>
                      </div>
                      <div>
                        {remainingKg > 0 ? (
                          <span className="text-amber-800 font-medium">
                            {remainingKg.toLocaleString()} kg remaining
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold">Target Reached · Ready to Dispatch</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Dispatch Details */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-stone-200 text-xs mb-4">
                    <div>
                      <div className="text-stone-500">Direct Locked Price</div>
                      <div className="text-base font-bold text-emerald-800 font-mono">
                        ₹{pool.pricePerKg} <span className="text-xs font-normal text-stone-500">/kg</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-stone-500">Dispatch Date</div>
                      <div className="text-stone-900 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{pool.dispatchDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verified Buyer Contract Tag */}
                  {pool.buyerOfferReceived && (
                    <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs mb-4">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-950 mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>Committed Buyer: {pool.buyerOfferReceived.buyerName}</span>
                      </div>
                      <div className="text-emerald-800 flex items-center justify-between">
                        <span>Rate: ₹{pool.buyerOfferReceived.offeredPricePerKg}/kg</span>
                        <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-900">
                          {pool.buyerOfferReceived.status === 'escrow_funded' ? '✓ Escrow Funded' : '✓ Agreement Signed'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons based on User Role */}
                <div className="border-t border-stone-200 pt-4">
                  {userRole === 'farmer' ? (
                    <button
                      onClick={() => {
                        setSelectedPoolForJoin(pool);
                        setContributionKg(pool.minContributionKg);
                      }}
                      className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Join This Collective Pool</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onBuyerFundPool(pool.id)}
                      className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Book Bulk Order (Escrow Contract)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Joining a Pool */}
      {selectedPoolForJoin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Join {selectedPoolForJoin.cropName}
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Collection Point: <strong>{selectedPoolForJoin.originHub}</strong>. Your produce will be weighed and graded at the hub with digital receipt.
            </p>

            <form onSubmit={handleConfirmJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  How many kilograms do you want to contribute?
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={selectedPoolForJoin.minContributionKg}
                    max={2000}
                    value={contributionKg}
                    onChange={(e) => setContributionKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-lg font-mono font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    required
                  />
                  <span className="text-sm font-semibold text-stone-600">kg</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  Minimum contribution is {selectedPoolForJoin.minContributionKg} kg (~{Math.ceil(selectedPoolForJoin.minContributionKg / 20)} crates).
                </div>
              </div>

              {/* Total payout estimate */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-xs text-emerald-800">Your Guaranteed Payout</div>
                <div className="text-xl font-bold text-emerald-950 font-mono">
                  ₹{(contributionKg * selectedPoolForJoin.pricePerKg).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Direct transfer upon drop-off on {selectedPoolForJoin.dispatchDate}.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPoolForJoin(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Confirm Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
