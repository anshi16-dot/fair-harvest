import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  speak: (text: string, customLang?: Language) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  audioGuideActive: boolean;
  toggleAudioGuide: () => void;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: 'Fair Harvest',
    tagline: 'Direct Market & Pooling for Northeast Farmers',
    switchRoleFarmer: 'Kisan / Farmer View',
    switchRoleBuyer: 'Institutional Buyer View',
    mandiPrices: 'Live Mandi & Fair Prices',
    producePools: 'Village Produce Pools',
    farmerGroups: 'Farmer Producer Clusters',
    transportPooling: 'Shared Hill Freight',
    buyerDemand: 'Verified Buyer Demands',
    myListings: 'My Produce Listings',
    addProduceBtn: 'Sell Your Produce',
    audioListenBtn: 'Listen in Audio',
    middlemanOffer: 'Middleman Rate',
    fairHarvestRate: 'Fair Harvest Direct',
    metroRate: 'Delhi / Kolkata Wholesale',
    priceGain: 'Farmer Profit Gain',
    joinPool: 'Join Collective Pool',
    targetMet: 'Target Progress',
    pooledQuantity: 'Pooled So Far',
    remaining: 'Needed to fill bulk order',
    fairCalculator: 'Fair Price & Profit Calculator',
    calcSubtitle: 'Calculate how much more you earn compared to local middlemen',
    selectCrop: 'Select Crop',
    enterQuantity: 'Enter Quantity',
    calculateNow: 'Calculate Fair Payout',
    extraIncomeMsg: 'Direct pooling bypasses local touts and delivers real money to your bank or cash center.',
    freightSchedule: 'Village Pickup & Transport Schedule',
    reserveSpace: 'Book Crate Space',
    voiceAssistant: 'Voice Sathi (Speak in Local Dialect)',
    listening: 'Listening to your voice...',
    askVoiceHelp: 'Tap microphone and tell what crop and quantity you want to sell',
    lowLiteracyFriendly: 'Easy Voice & Picture Mode Active'
  },
  as: {
    appName: 'ফেয়াৰ হাৰ্ভেষ্ট',
    tagline: 'উত্তৰ-পূবৰ কৃষকৰ বাবে পোনপটীয়া বজাৰ আৰু সংগ্ৰহ',
    switchRoleFarmer: 'কৃষকৰ দৃশ্য (Kisan View)',
    switchRoleBuyer: 'ব্যৱসায়ী / ক্ৰেতাৰ দৃশ্য',
    mandiPrices: 'দৈনিক বজাৰ দৰ আৰু ন্যায্য মূল্য',
    producePools: 'গাঁও সংগ্ৰহ পুল (Produce Pool)',
    farmerGroups: 'কৃষক গোট আৰু ক্লাষ্টাৰ (FPG)',
    transportPooling: 'উমৈহতীয়া পাহাৰীয়া পৰিবহণ',
    buyerDemand: 'প্ৰমাণিত ক্ৰেতাৰ চাহিদা',
    myListings: 'মোৰ ফচল তালিকা',
    addProduceBtn: 'ফচল বিক্ৰী কৰক',
    audioListenBtn: 'অডিঅ’ শুনক',
    middlemanOffer: 'দালালৰ কম দাম',
    fairHarvestRate: 'ফেয়াৰ হাৰ্ভেষ্ট ন্যায্য দাম',
    metroRate: 'গুৱাহাটী / দিল্লী বজাৰ দৰ',
    priceGain: 'কৃষকৰ লাভ বৃদ্ধি',
    joinPool: 'পুলে যোগদান কৰক',
    targetMet: 'সংগ্ৰহৰ অগ্ৰগতি',
    pooledQuantity: 'এতিয়ালৈ সংগ্ৰহ',
    remaining: 'বাকী থকা পৰিমাণ',
    fairCalculator: 'ন্যায্য দাম আৰু লাভ গণনা',
    calcSubtitle: 'দালালৰ তুলনাত আপুনি কিমান বেছি লাভ পাব চাওক',
    selectCrop: 'ফচল বাছক',
    enterQuantity: 'পৰিমাণ লিখক বা কওক',
    calculateNow: 'লাভ হিচাপ কৰক',
    extraIncomeMsg: 'দালালক এৰাই পোনপটীয়া বিক্ৰীৰ জৰিয়তে আপোনাৰ হাতত অধিক উপাৰ্জন আহিব।',
    freightSchedule: 'পাহাৰীয়া গাড়ীৰ সময়সূচী',
    reserveSpace: 'ক্ৰেট বুক কৰক',
    voiceAssistant: 'ভয়েচ সাথী (অসমীয়াত কওক)',
    listening: 'আপোনাৰ কথা শুনা হৈছে...',
    askVoiceHelp: 'মাইক্ৰ’ফোন টিপি কি ফচল আৰু কিমান বেচিব খোজে কওক',
    lowLiteracyFriendly: 'সহজ ছবি আৰু কণ্ঠ নিৰ্দেশনা সক্ৰিয়'
  },
  hi: {
    appName: 'फेयर हार्वेस्ट',
    tagline: 'पूर्वोत्तर किसानों के लिए सीधा बाजार और सामूहिक पूलिंग',
    switchRoleFarmer: 'किसान दृश्य (Kisan View)',
    switchRoleBuyer: 'थोक खरीदार दृश्य',
    mandiPrices: 'दैनिक मंडी भाव और उचित दाम',
    producePools: 'ग्राम सामूहिक पूलिंग (Produce Pools)',
    farmerGroups: 'किसान समूह व क्लस्टर (FPG)',
    transportPooling: 'साझा पहाड़ी परिवहन व मालगाड़ी',
    buyerDemand: 'सत्यापित थोक खरीदार मांग',
    myListings: 'मेरी उपज',
    addProduceBtn: 'उपज बेचें / लिस्ट करें',
    audioListenBtn: 'आवाज़ में सुनें',
    middlemanOffer: 'बिचौलियों का कम भाव',
    fairHarvestRate: 'फेयर हार्वेस्ट सीधा दाम',
    metroRate: 'दिल्ली / कोलकाता थोक मंडी',
    priceGain: 'किसान को अतिरिक्त मुनाफा',
    joinPool: 'पूल में फसल जोड़ें',
    targetMet: 'पूलिंग प्रगति',
    pooledQuantity: 'अब तक जमा',
    remaining: 'बल्क ऑर्डर के लिए शेष',
    fairCalculator: 'उचित मूल्य व मुनाफा कैलकुलेटर',
    calcSubtitle: 'देखें बिचौलियों के मुकाबले फेयर हार्वेस्ट से कितना ज्यादा मुनाफा मिलता है',
    selectCrop: 'फसल चुनें',
    enterQuantity: 'मात्रा दर्ज करें (किलो)',
    calculateNow: 'मुनाफा जोड़ें',
    extraIncomeMsg: 'बिचौलियों को हटाकर सीधे बड़े खरीदारों को बेचने पर पूरी कमाई सीधे आपके खाते में।',
    freightSchedule: 'पहाड़ी वाहन पिकअप समय सारणी',
    reserveSpace: 'क्रेट स्थान बुक करें',
    voiceAssistant: 'वॉयस साथी (बोलकर बताएं)',
    listening: 'आपकी आवाज सुनी जा रही है...',
    askVoiceHelp: 'माइक दबाकर बताएं कि आप कौन सी फसल और कितनी मात्रा बेचना चाहते हैं',
    lowLiteracyFriendly: 'सरल आवाज़ व चित्र मोड चालू है'
  },
  bn: {
    appName: 'ফেয়ার হারভেস্ট',
    tagline: 'উত্তর-পূর্বের কৃষকদের সরাসরি বাজার ও কালেক্টিভ পুলিং',
    switchRoleFarmer: 'কৃষক ভিউ (Kisan Mode)',
    switchRoleBuyer: 'পাইকারি ক্রেতা ভিউ',
    mandiPrices: 'দৈনিক মান্ডি দর ও ন্যায্য দাম',
    producePools: 'গ্রামীন কালেক্টিভ পুল (Produce Pools)',
    transportPooling: 'শেয়ার্ড পরিবহন ও ফ্রেইট',
    buyerDemand: 'যাচাইকৃত ক্রেতার চাহিদা',
    myListings: 'আমার ফসলের তালিকা',
    addProduceBtn: 'ফসল বিক্রির জন্য দিন',
    audioListenBtn: 'অডিও শুনুন',
    middlemanOffer: 'দালালের কম দাম',
    fairHarvestRate: 'ফেয়ার হারভেস্ট সরাসরি দাম',
    metroRate: 'কলকাতা / দিল্লী পাইকারি দর',
    priceGain: 'কৃষকের বাড়তি মুনাফা',
    joinPool: 'পুলে যুক্ত হন',
    targetMet: 'পুলের অগ্রগতি',
    pooledQuantity: 'মোট জমা হয়েছে',
    remaining: 'অর্ডারের জন্য বাকি',
    fairCalculator: 'ন্যায্য মূল্য ও লাভ ক্যালকুলেটর',
    calcSubtitle: 'দালালের তুলনায় আপনি কত বেশি লাভ পাবেন যাচাই করুন',
    selectCrop: 'ফসল নির্বাচন করুন',
    enterQuantity: 'পরিমাণ দিন (কেজি)',
    calculateNow: 'মুনাফা হিসেব করুন',
    extraIncomeMsg: 'মধ্যস্বত্বভোগী বাদ দিয়ে সরাসরি বিক্রয়ে সর্বোচ্চ মূল্য নিশ্চিত হয়।',
    freightSchedule: 'পাহাড়ী পরিবহন পিকআপ সময়সূচি',
    reserveSpace: 'ক্রেট বুক করুন',
    voiceAssistant: 'ভয়েস সহকারী (মুখে বলুন)',
    listening: 'শোনা হচ্ছে...',
    askVoiceHelp: 'মাইক্রোফোনে ক্লিক করে বলুন কি ফসল এবং কত কেজি বিক্রি করতে চান',
    lowLiteracyFriendly: 'সহজ ছবি ও ভয়েস মোড সক্রিয়'
  },
  kha: {
    appName: 'Fair Harvest',
    tagline: 'Ka Iew kaba Beit na ka bynta ki Nongrep ka Dong Shatei Lam Mihngi',
    switchRoleFarmer: 'Nongrep View (Kisan)',
    switchRoleBuyer: 'Nongthied Wholesale View',
    mandiPrices: 'Ka Dor Mandi & Dor kaba Hok',
    producePools: 'Ka jinglum lang ia ki mar rep (Pools)',
    transportPooling: 'Ka kali kit mar kaba iashem lang',
    buyerDemand: 'Ki Nongthied kiba shisha',
    myListings: 'Ki mar rep jong nga',
    addProduceBtn: 'Die ia ki mar rep',
    audioListenBtn: 'Sngap ha ka sur kren',
    middlemanOffer: 'Ka dor ki Middlemen',
    fairHarvestRate: 'Ka dor Beit Fair Harvest',
    metroRate: 'Ka dor ha Guwahati / Kolkata',
    priceGain: 'Ka jingioh nong jong u Nongrep',
    joinPool: 'Iasoh lang ha ka Pool',
    targetMet: 'Ka jingkiew ka jinglum lang',
    pooledQuantity: 'Kaba la lum haduh mynta',
    remaining: 'Kaba dang sah',
    fairCalculator: 'Ka jingkhein ia ka dor kaba biang',
    calcSubtitle: 'Peit katno phin ioh tam lada die beit sha Fair Harvest',
    selectCrop: 'Jied ia u mar rep',
    enterQuantity: 'Kano ka jingthew (Kg)',
    calculateNow: 'Khein ia ka jingioh',
    extraIncomeMsg: 'Bym don middlemen, ka pisa ka poi beit ha ki kti jong phi.',
    freightSchedule: 'Ka por jong ki kali kit mar',
    reserveSpace: 'Buh jaka ha ka crate',
    voiceAssistant: 'Kren da ka Ktien Khasi',
    listening: 'Dang sngap ia ka sur kren...',
    askVoiceHelp: 'Kren ha u mic ia ka mar rep bad katno kiba kwah ban die',
    lowLiteracyFriendly: 'Ka rukom pyndonkam da ki dur bad ka sur kren'
  },
  lus: {
    appName: 'Fair Harvest',
    tagline: 'Hmarchhak Lo Neite Tana Direct Bazar Leh Pooling',
    switchRoleFarmer: 'Lo Nei Tu View (Kisan)',
    switchRoleBuyer: 'Thil Lei Tu Lian View',
    mandiPrices: 'Vawiin Mandi & Man Dik',
    producePools: 'Khawvel Produce Pools',
    transportPooling: 'Motor Inṭawm Phurhna',
    buyerDemand: 'Lei Tu Lian Mamawh',
    myListings: 'Ka Thil Neih Te',
    addProduceBtn: 'Thil Hralh Rawh',
    audioListenBtn: 'Aw Rawng Ngaithla Rawh',
    middlemanOffer: 'A Karlak Tu Te Man Pek',
    fairHarvestRate: 'Fair Harvest Man Dik',
    metroRate: 'Guwahati / Kolkata Bazar Man',
    priceGain: 'Lo Nei Tu Hlawkna',
    joinPool: 'Pool-ah Tel Ve Rawh',
    targetMet: 'Thlen Chin',
    pooledQuantity: 'Lakhawm Tawh Zat',
    remaining: 'Mamawh Belh Zat',
    fairCalculator: 'Hlawkna Chhutna Khawl',
    calcSubtitle: 'A karlak tu te aia i hlawk zawk dan chhut rawh',
    selectCrop: 'Thlai Thlang Rawh',
    enterQuantity: 'Zat Chhut Lut Rawh (Kg)',
    calculateNow: 'Hlawkna Chhut Rawh',
    extraIncomeMsg: 'A karlak tu tel lovin, pawisa a lut ngei ngei ang.',
    freightSchedule: 'Khua aṭanga Motor Tlan Hun',
    reserveSpace: 'Crate Hmun Hauh Rawh',
    voiceAssistant: 'Aw Rawng Puihna',
    listening: 'I aw kan ngaithla mek e...',
    askVoiceHelp: 'Mic hmet la, eng thlai leh zat nge i hralh duh sawi rawh',
    lowLiteracyFriendly: 'Aw leh Lim Hmanga Hman Awlsam'
  },
  mni: {
    appName: 'ফেয়ার হারভেস্ট',
    tagline: 'নোংপোক থংবা লৌমীশিংগী হকথেংনবা কৈথেল অমসুং পুলিং',
    switchRoleFarmer: 'লৌমীগী মওং (Kisan View)',
    switchRoleBuyer: 'লৈবীবা মীওইগী মওং',
    mandiPrices: 'নোংমগী মান্দি মমল অমসুং অচুম্বা মমল',
    producePools: 'খুঙ্গংগী পোত্থোক পুল (Pools)',
    transportPooling: 'পুন্না চৎমিন্নবা গারী',
    buyerDemand: 'চুম্লবা লৈবীবশিংগী অপাম্বা',
    myListings: 'ঐহাক্কী পোত্থোকশিং',
    addProduceBtn: 'পোত্থোক য়োল্লু',
    audioListenBtn: 'খোল্লাওদা তারসি',
    middlemanOffer: 'মীদিলমেনগী নেম্বা মমল',
    fairHarvestRate: 'ফেয়ার হারভেস্টকী হকথেংনবা মমল',
    metroRate: 'মেত্রো কৈথেলগী মমল',
    priceGain: 'লৌমীদা ফংলিবা কান্নবা',
    joinPool: 'পুলদা য়াওবীয়ু',
    targetMet: 'পুলগী মায়পাকপা',
    pooledQuantity: 'হৌজিক ফাওবদা খোমজিনবা',
    remaining: 'মথৌ তাবা',
    fairCalculator: 'অচুম্বা মমল অমসুং কান্নবা শেম্বা',
    calcSubtitle: 'দালালদগী লৌমীনা কয়াম হেন্না ফংগদগে য়েংবীয়ু',
    selectCrop: 'পোত্থোক খনবীয়ু',
    enterQuantity: 'চাং চংশিল্লু (Kg)',
    calculateNow: 'কান্নবা থিদোকউ',
    extraIncomeMsg: 'দালাল য়াওদনা হকথেংনবা য়োন্দুনা শেল হেন্না ফংবীয়ু।',
    freightSchedule: 'গারী পুখৎ-পুথোক্কী মতম',
    reserveSpace: 'ক্ৰেট বুক তৌবীয়ু',
    voiceAssistant: 'ভয়েস সাথি (ৱা ঙাংবীয়ু)',
    listening: 'নহাক্কী খোঞ্জেল তারে...',
    askVoiceHelp: 'মাইক নম্বীয়ু অমসুং নহাক্না য়োল্লিবা পোত্থোক্কী মমিং ঙাংবীয়ু',
    lowLiteracyFriendly: 'লাই অমসুং খোঞ্জেলগী মওং চৎনরে'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioGuideActive, setAudioGuideActive] = useState<boolean>(true);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speak = (text: string, customLang?: Language) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const targetLang = customLang || language;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate locale
    if (targetLang === 'hi') utterance.lang = 'hi-IN';
    else if (targetLang === 'bn') utterance.lang = 'bn-IN';
    else if (targetLang === 'as') utterance.lang = 'as-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.92; // Slightly measured pace for rural clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleAudioGuide = () => {
    setAudioGuideActive(prev => !prev);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speak,
        stopSpeaking,
        isSpeaking,
        audioGuideActive,
        toggleAudioGuide
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
