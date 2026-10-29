import React from 'react';
import { Volume2, Mic, ArrowRight, ShieldCheck, TrendingUp, Truck, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

interface HeroBannerProps {
  userRole: UserRole;
  onOpenSellModal: () => void;
  onOpenVoiceAssistant: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  userRole,
  onOpenSellModal,
  onOpenVoiceAssistant,
}) => {
  const { t, speak, language } = useLanguage();

  const handleSpeakHero = () => {
    const textToSpeak =
      language === 'hi'
        ? 'फेयर हार्वेस्ट पूर्वोत्तर के किसानों को बिचौलियों के चंगुल से मुक्त कराता है। अपनी कीवी, संतरा, बड़ी इलायची और अदरक का सही दाम पाएं और साझा वाहन से परिवहन खर्च बचाएं।'
        : language === 'as'
        ? 'ফেয়াৰ হাৰ্ভেষ্টে উত্তৰ-পূবৰ কৃষকক দালালৰ হাতৰ পৰা মুক্ত কৰি ন্যায্য মূল্য দিয়ে। কিৱি, কমোলা, বৰ ইলাচি আৰু আদা পোনে পোনে ডাঙৰ ক্ৰেতাক বিক্ৰী কৰক।'
        : language === 'bn'
        ? 'ফেয়ার হারভেস্ট উত্তর-পূর্বের কৃষকদের সরাসরি ক্রেতাদের সাথে যুক্ত করে ন্যায্য দাম দেয়। দালালদের কম দরকে বিদায় জানান।'
        : 'Fair Harvest connects Northeast India farmers directly with institutional buyers, bypassing middlemen to ensure transparent daily mandi pricing, village crop pooling, and shared hill transport.';
    speak(textToSpeak);
  };

  return (
    <section className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background Hero Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_northeast_farming_1793216327322.jpg"
          alt="Terraced agricultural hills in Northeast India"
          className="w-full h-full object-cover opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-3xl">
          {/* Subtle trust marker without generic pill capsules */}
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wide uppercase mb-3">
            <span>Direct Farm-to-Buyer Network</span>
            <span aria-hidden="true">·</span>
            <span>Zero Middlemen</span>
            <span aria-hidden="true">·</span>
            <span>Northeast Hill Hubs</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance leading-tight mb-4">
            {userRole === 'farmer' ? (
              <>
                Fair prices for your harvest. <br />
                <span className="text-emerald-400">Direct to buyers, no middlemen.</span>
              </>
            ) : (
              <>
                Source certified Northeast produce. <br />
                <span className="text-emerald-400">Aggregated directly at the farm gate.</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-stone-300 mb-6 leading-relaxed max-w-2xl">
            {userRole === 'farmer'
              ? 'Northeast farmers grow premium Kiwi, Oranges, Cardamom & Ginger. Fair Harvest gives you transparent daily mandi rates, pools small harvests to fill bulk truckloads, and arranges shared hill transport.'
              : 'Direct procurement of GI-tagged and organic crops from Ziro, Dambuk, Sikkim, and Karbi Anglong. Transparent escrow contracting and verified origin batch tracking.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={onOpenSellModal}
              className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-md flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>{userRole === 'farmer' ? t('addProduceBtn') : 'Procure Bulk Lots'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenVoiceAssistant}
              className="px-4 py-3 rounded-lg bg-stone-800/90 hover:bg-stone-700 text-amber-300 font-semibold text-sm border border-stone-700 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Mic className="w-4 h-4 text-amber-400" />
              <span>{t('voiceAssistant')}</span>
            </button>

            <button
              onClick={handleSpeakHero}
              className="px-3.5 py-3 rounded-lg bg-stone-800/70 hover:bg-stone-700 text-stone-300 hover:text-white font-medium text-xs border border-stone-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Listen to this explanation in voice"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>{t('audioListenBtn')}</span>
            </button>
          </div>

          <div className="text-xs text-stone-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Guaranteed payment within 24h of collection center delivery via Bank or Village Cash Point</span>
          </div>
        </div>
      </div>

      {/* 4-column KPI strip below hero split adhering to layout guidelines */}
      <div className="relative z-10 border-t border-stone-800 bg-stone-950/80 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-stone-400 mb-1">Price Realization</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">+115%</div>
              <div className="text-xs text-stone-500">Above local middleman offers</div>
            </div>

            <div>
              <div className="text-xs text-stone-400 mb-1">Smallholders Aggregated</div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">4,850+</div>
              <div className="text-xs text-stone-500">Across 62 remote village hubs</div>
            </div>

            <div>
              <div className="text-xs text-stone-400 mb-1">Hill Freight Sharing</div>
              <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">₹60–90</div>
              <div className="text-xs text-stone-500">Per 20kg crate via scheduled trucks</div>
            </div>

            <div>
              <div className="text-xs text-stone-400 mb-1">Dialects &amp; Voice</div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">7 Languages</div>
              <div className="text-xs text-stone-500">Built for low-literacy farmers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
