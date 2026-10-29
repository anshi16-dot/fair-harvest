import React, { useState } from 'react';
import { X, Mic, Volume2, CheckCircle2, Sparkles, MapPin, Package } from 'lucide-react';
import { CropInfo, FarmerListing } from '../types';
import { CROP_DATA } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface FarmerListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: FarmerListing) => void;
  initialCrop?: CropInfo | null;
}

export const FarmerListingModal: React.FC<FarmerListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
  initialCrop,
}) => {
  const { t, speak, language } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState<CropInfo>(initialCrop || CROP_DATA[0]);
  const [farmerName, setFarmerName] = useState<string>('');
  const [village, setVillage] = useState<string>(selectedCrop.origin.split(',')[0]);
  const [quantityKg, setQuantityKg] = useState<number>(60);
  const [grade, setGrade] = useState<'A' | 'B' | 'Export'>('A');
  const [poolDirectly, setPoolDirectly] = useState<boolean>(true);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');

  if (!isOpen) return null;

  const estimatedTotal = selectedCrop.fairHarvestPrice * quantityKg;
  const middlemanTotal = selectedCrop.middlemanPrice * quantityKg;
  const extraGain = estimatedTotal - middlemanTotal;

  const handleSimulateVoiceInput = () => {
    setIsRecordingVoice(true);
    setVoiceTranscript('Listening... Speak now');

    // Web Speech Recognition if available or smart simulated transcript
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'as' ? 'as-IN' : 'en-IN';
        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setVoiceTranscript(text);
          setIsRecordingVoice(false);
          // Parse quantity if numbers exist
          const match = text.match(/\d+/);
          if (match) {
            setQuantityKg(Number(match[0]));
          }
        };
        recognition.onerror = () => {
          fallbackVoiceSimulation();
        };
        recognition.start();
        return;
      } catch (err) {
        fallbackVoiceSimulation();
      }
    } else {
      fallbackVoiceSimulation();
    }
  };

  const fallbackVoiceSimulation = () => {
    setTimeout(() => {
      const sampleText =
        language === 'hi'
          ? 'मेरी पास ज़ीरो में 80 किलो ताज़ा कीवी है'
          : language === 'as'
          ? 'মোৰ ওচৰত জিৰোত ৮০ কিলোগ্ৰাম সতেজ কিৱি আছে'
          : '80 kilograms fresh produce ready at village hub';
      setVoiceTranscript(`"${sampleText}"`);
      setQuantityKg(80);
      setIsRecordingVoice(false);
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newListing: FarmerListing = {
      id: `list-${Date.now()}`,
      farmerName: farmerName.trim() || 'Village Producer',
      village: village.trim() || selectedCrop.origin,
      crop: selectedCrop.name,
      quantityKg,
      grade,
      expectedPrice: selectedCrop.fairHarvestPrice,
      listedDate: 'Just now',
      pooled: poolDirectly,
      status: 'available',
    };

    onAddListing(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
        <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Low-Literacy &amp; Voice-Friendly Flow
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
              {t('addProduceBtn')}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Voice Assistant Bar */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Mic className={`w-5 h-5 ${isRecordingVoice ? 'text-red-600 animate-pulse' : 'text-amber-800'}`} />
            <div className="text-xs text-amber-950 font-medium">
              {isRecordingVoice ? voiceTranscript : t('askVoiceHelp')}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulateVoiceInput}
            className="px-3 py-1.5 bg-amber-200/90 hover:bg-amber-300 text-amber-950 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0"
          >
            {isRecordingVoice ? 'Listening...' : '🎙️ Tap to Speak'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Big Pictorial Crop Buttons */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">
              1. Tap Your Crop (ছবি চোৱা / फसल चुनें)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CROP_DATA.map((crop) => (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => {
                    setSelectedCrop(crop);
                    setVillage(crop.origin.split(',')[0]);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                    selectedCrop.id === crop.id
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-700 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-800'
                  }`}
                >
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-12 h-12 rounded-lg object-cover mb-1.5"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-xs font-bold leading-tight">
                    {crop.localNames[language] || crop.name}
                  </div>
                  <div className="text-[10px] text-emerald-800 font-mono font-semibold mt-1">
                    ₹{crop.fairHarvestPrice}/kg
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Visual Crate Quantity Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                2. Quantity (20kg Bamboo Crate / বাস্কেট)
              </label>
              <span className="text-xs font-bold font-mono text-emerald-800">
                {quantityKg} kg (~{Math.round(quantityKg / 20)} Crates)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { crates: 1, kg: 20 },
                { crates: 3, kg: 60 },
                { crates: 5, kg: 100 },
                { crates: 10, kg: 200 },
              ].map((opt) => (
                <button
                  key={opt.kg}
                  type="button"
                  onClick={() => setQuantityKg(opt.kg)}
                  className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                    quantityKg === opt.kg
                      ? 'border-emerald-700 bg-emerald-800 text-white'
                      : 'border-stone-200 bg-stone-100 text-stone-800 hover:bg-stone-200'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 mx-auto mb-1 opacity-70" />
                  <div>{opt.crates} {opt.crates === 1 ? 'Crate' : 'Crates'}</div>
                  <div className="text-[10px] opacity-80">{opt.kg} kg</div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                className="w-full accent-emerald-700 h-2 bg-stone-200 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="5"
                max="2000"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Math.max(1, Number(e.target.value)))}
                className="w-20 px-2 py-1 border border-stone-300 rounded font-mono font-bold text-stone-900 text-center text-xs"
              />
            </div>
          </div>

          {/* Step 3: Farmer Name & Village */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Farmer / Grower Name
              </label>
              <input
                type="text"
                placeholder="e.g. Tage Hinda"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Village / Hub Location
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Hari Village, Ziro"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Pooling Mode Choice */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-300">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="pool-checkbox"
                checked={poolDirectly}
                onChange={(e) => setPoolDirectly(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-emerald-700 rounded cursor-pointer"
              />
              <label htmlFor="pool-checkbox" className="text-xs text-emerald-950 cursor-pointer">
                <strong>{t('joinPool')} (Recommended)</strong>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Combine with neighbor farmers to fill scheduled bulk truckloads. Guaranteed direct payout of <strong>₹{selectedCrop.fairHarvestPrice}/kg</strong>.
                </p>
              </label>
            </div>

            {/* Price Preview */}
            <div className="mt-3 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs">
              <span className="text-emerald-900">Guaranteed Farmgate Payout:</span>
              <span className="font-mono font-extrabold text-base text-emerald-950">
                ₹{estimatedTotal.toLocaleString('en-IN')}{' '}
                <span className="text-[11px] font-normal text-emerald-800">
                  (+₹{extraGain.toLocaleString('en-IN')} vs Middleman)
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Publish &amp; Send to Village Hub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
