import React, { useState } from 'react';
import { Volume2, TrendingUp, AlertCircle, Calculator, CheckCircle2, MapPin } from 'lucide-react';
import { CropInfo } from '../types';
import { CROP_DATA } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface MandiPriceBoardProps {
  onSelectCropForListing: (crop: CropInfo) => void;
}

export const MandiPriceBoard: React.FC<MandiPriceBoardProps> = ({ onSelectCropForListing }) => {
  const { t, speak, language } = useLanguage();

  // Calculator state
  const [selectedCropId, setSelectedCropId] = useState<string>(CROP_DATA[0].id);
  const [calcQuantity, setCalcQuantity] = useState<number>(100);

  const selectedCrop = CROP_DATA.find((c) => c.id === selectedCropId) || CROP_DATA[0];

  const middlemanTotal = selectedCrop.middlemanPrice * calcQuantity;
  const fairHarvestTotal = selectedCrop.fairHarvestPrice * calcQuantity;
  const difference = fairHarvestTotal - middlemanTotal;
  const percentGain = Math.round((difference / middlemanTotal) * 100);

  const handleSpeakPrice = (crop: CropInfo) => {
    const localName = crop.localNames[language] || crop.name;
    const gainPerKg = crop.fairHarvestPrice - crop.middlemanPrice;

    let text = '';
    if (language === 'hi') {
      text = `${localName} का आज का उचित भाव ${crop.fairHarvestPrice} रुपये प्रति किलो है। बिचौलिया केवल ${crop.middlemanPrice} रुपये दे रहा है। फेयर हार्वेस्ट से बेचने पर आपको प्रति किलो ${gainPerKg} रुपये अधिक मिलेंगे।`;
    } else if (language === 'as') {
      text = `${localName}ৰ আজিৰ ন্যায্য মূল্য প্ৰতি কিলোগ্ৰামত ${crop.fairHarvestPrice} টকা। দালালে মাত্ৰ ${crop.middlemanPrice} টকা দিয়ে। ফেয়াৰ হাৰ্ভেষ্টত আপুনি ${gainPerKg} টকা বেছি লাভ পাব।`;
    } else if (language === 'bn') {
      text = `${localName} এর আজকের ন্যায্য মূল্য প্রতি কেজি ${crop.fairHarvestPrice} টাকা। মধ্যস্বত্বভোগী দেয় মাত্র ${crop.middlemanPrice} টাকা। ফেয়ার হারভেস্টে আপনি কেজি প্রতি ${gainPerKg} টাকা বেশি পাবেন।`;
    } else {
      text = `Today's Fair Harvest direct rate for ${crop.name} is ${crop.fairHarvestPrice} rupees per kilogram. Local middleman offer is only ${crop.middlemanPrice} rupees. By pooling directly, you gain ${gainPerKg} rupees more per kilo.`;
    }

    speak(text);
  };

  return (
    <section id="mandi-prices" className="py-12 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              Transparent Market Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {t('mandiPrices')}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Daily farmgate vs. Middleman vs. Terminal Mandi rates across Guwahati, Siliguri &amp; Delhi.
              Never sell underpriced to touts again.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Verified 28 Oct 2026, 06:00 AM (APMC Feed)</span>
          </div>
        </div>

        {/* Crop Cards Grid with authentic images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CROP_DATA.map((crop) => {
            const gain = crop.fairHarvestPrice - crop.middlemanPrice;
            const gainPct = Math.round((gain / crop.middlemanPrice) * 100);

            return (
              <div
                key={crop.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Image container with 4:3 aspect ratio */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {crop.giTagged && (
                        <span className="bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                          GI-Tagged Origin
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleSpeakPrice(crop)}
                      className="absolute bottom-2 right-2 p-2 bg-stone-900/80 hover:bg-emerald-800 text-white rounded-full backdrop-blur-xs transition-colors"
                      title="Audio voice readout of price in current language"
                      aria-label="Audio voice readout"
                    >
                      <Volume2 className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-1 text-xs text-stone-500 mb-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{crop.origin}, {crop.state}</span>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 mb-1 leading-snug">
                      {crop.localNames[language] || crop.name}
                    </h3>
                    <p className="text-xs text-stone-500 mb-3">{crop.name}</p>

                    {/* Price Comparison Block */}
                    <div className="space-y-2 border-t border-stone-100 pt-3">
                      {/* Fair Harvest Guaranteed Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-800">
                          {t('fairHarvestRate')}
                        </span>
                        <span className="text-base font-bold text-emerald-700 font-mono tabular-nums">
                          ₹{crop.fairHarvestPrice} <span className="text-xs font-normal text-stone-500">/{crop.unit}</span>
                        </span>
                      </div>

                      {/* Middleman Exploitative Price */}
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>{t('middlemanOffer')}</span>
                        <span className="line-through text-red-500 font-mono tabular-nums">
                          ₹{crop.middlemanPrice} /{crop.unit}
                        </span>
                      </div>

                      {/* Metro Wholesale Reference */}
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>{t('metroRate')}</span>
                        <span className="font-mono tabular-nums text-stone-700">
                          ₹{crop.metroMandiPrice} /{crop.unit}
                        </span>
                      </div>

                      {/* Gain Highlight */}
                      <div className="bg-emerald-50 rounded-lg p-2 text-center text-xs font-medium text-emerald-900 mt-2">
                        +{gainPct}% (+₹{gain}/{crop.unit}) {t('priceGain')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => onSelectCropForListing(crop)}
                    className="w-full py-2 bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Pool &amp; Sell This Crop
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Fair Price & Profit Calculator */}
        <div id="calculator" className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs tracking-wider uppercase mb-1">
                <Calculator className="w-4 h-4" />
                <span>Interactive Farmer Earnings Tool</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                {t('fairCalculator')}
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                {t('calcSubtitle')}
              </p>
            </div>

            {/* Quick voice audio trigger for low literacy */}
            <button
              onClick={() => {
                const message =
                  language === 'hi'
                    ? `कैलकुलेटर: ${selectedCrop.name} के ${calcQuantity} किलो बेचने पर बिचौलिया केवल ${middlemanTotal} रुपये देगा, जबकि फेयर हार्वेस्ट से आपको ${fairHarvestTotal} रुपये मिलेंगे। आपका सीधा फायदा ${difference} रुपये का है!`
                    : `Earnings summary: For ${calcQuantity} kg of ${selectedCrop.name}, middleman gives only ₹${middlemanTotal}. Fair Harvest pooling gives ₹${fairHarvestTotal}. You take home ₹${difference} extra!`;
                speak(message);
              }}
              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Listen to Calculation in Voice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* Input Controls */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-2">
                  1. {t('selectCrop')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CROP_DATA.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCropId(c.id)}
                      className={`p-3 text-left rounded-lg border text-xs transition-all ${
                        selectedCropId === c.id
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-700'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50'
                      }`}
                    >
                      <div className="font-bold">{c.localNames[language] || c.name}</div>
                      <div className="text-[11px] text-stone-500">{c.origin}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="quantity-input" className="text-xs font-semibold text-stone-700 uppercase">
                    2. {t('enterQuantity')}
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    {calcQuantity} Kilograms ({Math.round(calcQuantity / 20)} Crates)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="quantity-input"
                    type="range"
                    min="20"
                    max="1000"
                    step="10"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value))}
                    className="w-full accent-emerald-700 h-2 bg-stone-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-24 px-2 py-1.5 border border-stone-300 rounded text-sm text-center font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                {/* Quick preset buttons */}
                <div className="flex items-center gap-2 mt-2">
                  {[50, 100, 200, 500].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setCalcQuantity(qty)}
                      className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-mono transition-colors"
                    >
                      {qty} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparison Outcome Cards */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Middleman Outcome */}
                <div className="p-4 rounded-xl border border-red-200 bg-red-50/40">
                  <div className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                    Middleman Farmgate Payout
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-red-900 font-mono tabular-nums mt-1">
                    ₹{middlemanTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-stone-600 mt-2">
                    Paid at ₹{selectedCrop.middlemanPrice}/kg. Tout captures the margin while you bear the labor and loss.
                  </div>
                </div>

                {/* Fair Harvest Outcome */}
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50">
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                    Fair Harvest Direct Payout
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-mono tabular-nums mt-1">
                    ₹{fairHarvestTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-emerald-800 mt-2">
                    Paid at ₹{selectedCrop.fairHarvestPrice}/kg direct from bulk buyer escrow upon village hub delivery.
                  </div>
                </div>
              </div>

              {/* Net Extra Margin in Farmer's Pocket */}
              <div className="p-4 rounded-xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-amber-300 font-semibold tracking-wide uppercase">
                    Your Extra Profit Gain
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
                    +₹{difference.toLocaleString('en-IN')}{' '}
                    <span className="text-sm font-normal text-white">({percentGain}% more money)</span>
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    {t('extraIncomeMsg')}
                  </div>
                </div>

                <button
                  onClick={() => onSelectCropForListing(selectedCrop)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  Commit {calcQuantity} kg to Active Pool
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
