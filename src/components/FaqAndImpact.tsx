import React from 'react';
import { ShieldCheck, Truck, Users, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FaqAndImpact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step-by-Step Visual How It Works for Rural Producers */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              Zero Middlemen Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              How Fair Harvest Works for Northeast Farmers
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              From remote hill orchard to verified bulk buyer in 4 transparent steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono text-base flex items-center justify-center mb-3">
                  01
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1">Price Discovery</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Listen or check daily verified mandi prices in Assamese, Hindi, Bengali, Khasi, Mizo, or Manipuri before selling.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-emerald-800 mt-4 pt-3 border-t border-stone-100">
                ✓ No tout exploitation
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono text-base flex items-center justify-center mb-3">
                  02
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1">Village Hub Drop-Off</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Bring as little as 10 kg or 1 crate to your local village center (Hapoli, Dambuk, Mangan, Diphu) for digital weighment.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-emerald-800 mt-4 pt-3 border-t border-stone-100">
                ✓ Digital weigh slip
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono text-base flex items-center justify-center mb-3">
                  03
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1">Shared Hill Freight</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Harvest is pooled with neighbor farmers into scheduled reefer trucks, slashing transport costs from ₹6,500 down to ₹75/crate.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-emerald-800 mt-4 pt-3 border-t border-stone-100">
                ✓ Cold chain preservation
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono text-base flex items-center justify-center mb-3">
                  04
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1">24-Hour Payout</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Bulk buyers (hotel chains, supermarket exporters) fund escrow upfront. Funds disburse straight to farmer bank accounts or cash points.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-emerald-800 mt-4 pt-3 border-t border-stone-100">
                ✓ 100% Guaranteed payment
              </div>
            </div>
          </div>
        </div>

        {/* Real Farmer Testimonials and Case Studies from Northeast */}
        <div className="p-6 lg:p-8 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <div className="max-w-2xl mb-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              Field Impact &amp; Proof
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
              Transforming Rural Northeast Incomes
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <p className="text-xs text-stone-700 italic leading-relaxed mb-4">
                "Middlemen used to arrive in Ziro and offer barely ₹65 to ₹75 for our organic kiwis, claiming transport to Guwahati was too risky. With Fair Harvest pooling, 14 of us filled a 3.5 tonne lot and received ₹165/kg straight from an organic retail chain."
              </p>
              <div>
                <div className="font-bold text-xs text-stone-900">Tage Hinda</div>
                <div className="text-[11px] text-stone-500">Ziro Kiwi Grower, Lower Subansiri, Arunachal Pradesh</div>
                <div className="mt-2 text-xs font-mono font-bold text-emerald-800">+120% income realized</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <p className="text-xs text-stone-700 italic leading-relaxed mb-4">
                "I cannot type in English on phones. The voice assistant speaks in Assamese and reads out the exact price. I booked 6 crates on the scheduled Tuesday truck from Diphu without paying an exorbitant private rental."
              </p>
              <div>
                <div className="font-bold text-xs text-stone-900">Biren Teron</div>
                <div className="text-[11px] text-stone-500">Karbi Anglong Ginger Farmer, Assam</div>
                <div className="mt-2 text-xs font-mono font-bold text-emerald-800">₹4,200 saved in freight</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <p className="text-xs text-stone-700 italic leading-relaxed mb-4">
                "For our hotels across Guwahati and Shillong, sourcing authentic Dambuk mandarins and Sikkim cardamom previously required 3 layers of middlemen with zero traceability. Now we inspect verified lots and fund escrow with 1 click."
              </p>
              <div>
                <div className="font-bold text-xs text-stone-900">Siddharth Das</div>
                <div className="text-[11px] text-stone-500">Procurement Manager, Regional Hospitality Group</div>
                <div className="mt-2 text-xs font-mono font-bold text-emerald-800">48h Farmgate-to-Kitchen delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
