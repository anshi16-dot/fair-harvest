import React from 'react';
import { Sprout, Volume2, VolumeX, Globe, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language, UserRole } from '../types';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenSellModal: () => void;
  onOpenVoiceAssistant: () => void;
}

const LANGUAGES: { code: Language; label: string; script: string }[] = [
  { code: 'en', label: 'English', script: 'EN' },
  { code: 'as', label: 'অসমীয়া', script: 'AS' },
  { code: 'hi', label: 'हिन्दी', script: 'HI' },
  { code: 'bn', label: 'বাংলা', script: 'BN' },
  { code: 'kha', label: 'Khasi', script: 'KH' },
  { code: 'lus', label: 'Mizo', script: 'MZ' },
  { code: 'mni', label: 'মৈতৈলোন্', script: 'MN' },
];

export const Header: React.FC<HeaderProps> = ({
  userRole,
  setUserRole,
  onOpenSellModal,
  onOpenVoiceAssistant,
}) => {
  const { language, setLanguage, t, isSpeaking, stopSpeaking, audioGuideActive, toggleAudioGuide } = useLanguage();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a href="#" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-emerald-950 whitespace-nowrap shrink-0">
            <span className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shadow-xs">
              <Sprout className="w-5 h-5" />
            </span>
            <span>Fair Harvest</span>
          </a>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <a href="#mandi-prices" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {t('mandiPrices')}
            </a>
            <a href="#produce-pools" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {t('producePools')}
            </a>
            <a href="#farmer-collectives" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {t('farmerGroups')}
            </a>
            <a href="#transport" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {t('transportPooling')}
            </a>
            <a href="#buyer-demand" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {t('buyerDemand')}
            </a>
            <a href="#calculator" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              {t('fairCalculator')}
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSellModal}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>+</span>
              <span>{t('addProduceBtn')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Primary Utility Sub-Bar: Role, Language Switcher, Voice Assistant, Audio Guide */}
      <div className="bg-stone-100/90 border-b border-stone-200 py-2 px-4 sm:px-6 lg:px-8 text-xs text-stone-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Persona Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">Mode:</span>
            <div className="inline-flex rounded-md bg-stone-200/80 p-0.5">
              <button
                onClick={() => setUserRole('farmer')}
                className={`px-3 py-1 font-medium rounded transition-all whitespace-nowrap ${
                  userRole === 'farmer'
                    ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                🌾 {t('switchRoleFarmer')}
              </button>
              <button
                onClick={() => setUserRole('buyer')}
                className={`px-3 py-1 font-medium rounded transition-all whitespace-nowrap ${
                  userRole === 'buyer'
                    ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                🏢 {t('switchRoleBuyer')}
              </button>
            </div>
          </div>

          {/* Multilingual Selector & Audio Read Aloud */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <label htmlFor="language-select" className="sr-only">Choose Language</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-white border border-stone-300 rounded px-2 py-1 text-xs font-medium text-stone-800 cursor-pointer focus:ring-1 focus:ring-emerald-700 focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label} ({lang.script})
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Messenger Shortcut */}
            <button
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-800 text-amber-300 rounded-md font-semibold hover:bg-emerald-900 transition-colors whitespace-nowrap shadow-xs"
              title="AI Voice Messenger in Hindi, Assamese, Manipuri, and English"
            >
              <span className="text-xs">🎙️</span>
              <span>AI Voice Messenger (हिन्दी/অসমীয়া/মৈতৈলোন্)</span>
            </button>

            {/* Audio narrator toggle */}
            <button
              onClick={isSpeaking ? stopSpeaking : toggleAudioGuide}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                isSpeaking
                  ? 'bg-red-100 text-red-800 animate-pulse'
                  : audioGuideActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-stone-200 text-stone-600'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{audioGuideActive ? 'Audio Voice: ON' : 'Audio: Muted'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
