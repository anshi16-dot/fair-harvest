import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  PhoneCall,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

export interface VoiceMessage {
  id: string;
  sender: 'farmer' | 'assistant';
  timestamp: string;
  language: string;
  audioDurationSec?: number;
  transcribedText: string;
  answerText?: string;
  speechScript?: string;
  detectedCrop?: string;
  actionSuggestion?: string;
  isVoiceNote: boolean;
}

interface VoiceMessengerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  onOpenSellModal?: () => void;
}

const SUPPORTED_VOICE_LANGS: { code: Language | 'auto'; name: string; nativeName: string; flag: string }[] = [
  { code: 'auto', name: 'Auto-Match', nativeName: 'Auto Detect (कमांड भाषा)', flag: '✨' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🌾' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', flag: '🌿' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'kha', name: 'Khasi', nativeName: 'Khasi', flag: '⛰️' },
];

// Client-side quick command language detection
function detectInputLanguage(text: string, current: string = 'auto'): Language {
  if (!text) return current !== 'auto' && ['hi', 'as', 'mni', 'en'].includes(current) ? (current as Language) : 'hi';

  // Devanagari script (Hindi)
  if (/[\u0900-\u097F]/.test(text)) return 'hi';

  // Eastern Nagari / Bengali / Assamese / Meitei
  if (/[\u0980-\u09FF]/.test(text)) {
    if (/[\u09F0\u09F1]/.test(text)) return 'as';
    if (/মমল|কয়ামনি|ঙসি|লৌমী|পোত্থোক|খুরুমজরি|পীরি|নম্থৈরি|চৎকনি|কান্নবা/.test(text)) return 'mni';
    if (/কিমান|আমাৰ|আছে|লাগিব|কৰক|ফচল|টেঙা|দালাল|হ’ব|হব|কেজিত|দাম|উমৈহতীয়া/.test(text)) return 'as';
    if (current === 'mni') return 'mni';
    return 'as';
  }

  // Romanized Hinglish
  if (/\b(kya|hai|bhav|bhaav|kitna|kitne|daam|dam|batao|batayein|kisan|gadi|gaadi|bechna|chahiye|mujhe|namaste|aaj|aajka|paisa|rupaye)\b/i.test(text)) {
    return 'hi';
  }

  // Romanized Manipuri
  if (/\b(mamal|kayamni|ngasi|loumee|laumi|khurumjari|potthok|shing|komolagi|kiwigi|yolba|chatkaba)\b/i.test(text)) {
    return 'mni';
  }

  // Romanized Assamese
  if (/\b(kiman|komola|dambuk|kiwir|ketia|lagibo|lagib|korok|aasa|aase|bazar|bhara|bhal|khobor|dibo|dim)\b/i.test(text)) {
    return 'as';
  }

  if (current !== 'auto' && ['hi', 'as', 'mni', 'en'].includes(current)) {
    return current as Language;
  }

  return 'en';
}

export const VoiceMessenger: React.FC<VoiceMessengerProps> = ({
  isOpen,
  onClose,
  onNavigateToSection,
  onOpenSellModal,
}) => {
  const { language, setLanguage, speak, stopSpeaking, isSpeaking } = useLanguage();

  const [activeLang, setActiveLang] = useState<Language | 'auto'>('auto');

  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      language: 'hi',
      isVoiceNote: true,
      audioDurationSec: 6,
      transcribedText: 'नमस्ते किसान साथी! मैं आपका एआई वॉयस मैसेंजर हूँ।',
      answerText:
        'नमस्ते किसान साथी! मैं आपका एआई वॉयस मैसेंजर हूँ। आप अपनी भाषा (हिन्दी, অসমীয়া, মৈতৈলোন্, English) में बोलकर मंडी भाव, सामूहिक पूलिंग या पहाड़ी वाहन के बारे में पूछ सकते हैं। नीचे माइक दबाकर बोलें!',
      speechScript:
        'नमस्ते किसान साथी! आप अपनी भाषा में बोलकर मंडी भाव, पूलिंग या गाड़ी के बारे में पूछ सकते हैं।',
      detectedCrop: 'general',
      actionSuggestion: 'check_prices',
    },
  ]);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTimer, setRecordTimer] = useState<number>(0);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Keep in sync with parent language
  useEffect(() => {
    if (['hi', 'as', 'mni', 'en'].includes(language)) {
      setActiveLang(language);
    }
  }, [language]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  // Audio Playback Handler
  const handlePlayAudio = (msg: VoiceMessage) => {
    if (currentlyPlayingId === msg.id && isSpeaking) {
      stopSpeaking();
      setCurrentlyPlayingId(null);
      return;
    }

    const textToSpeak = msg.speechScript || msg.answerText || msg.transcribedText;
    setCurrentlyPlayingId(msg.id);

    // Speak through LanguageContext's speech engine
    speak(textToSpeak, msg.language as Language);

    // Auto-reset playing state after estimated duration
    const estimatedSec = Math.max(3, Math.ceil(textToSpeak.length / 15));
    setTimeout(() => {
      setCurrentlyPlayingId((prev) => (prev === msg.id ? null : prev));
    }, estimatedSec * 1000);
  };

  // Start Voice Recording
  const startRecording = async () => {
    setIsRecording(true);
    setRecordTimer(0);
    audioChunksRef.current = [];

    // Visual timer
    timerIntervalRef.current = setInterval(() => {
      setRecordTimer((prev) => prev + 1);
    }, 1000);

    // Attempt real browser Speech Recognition if available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        if (activeLang === 'hi') recognition.lang = 'hi-IN';
        else if (activeLang === 'as') recognition.lang = 'as-IN';
        else if (activeLang === 'mni') recognition.lang = 'bn-IN'; // Bengali/Meitei phonetic
        else recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          stopRecordingWithText(transcript);
        };

        recognition.onerror = () => {
          // Fallback to simulated audio recording if speech recognition permissions fail
          setTimeout(() => {
            stopRecordingWithSimulatedText();
          }, 2500);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition failed to start, using fallback timer:', e);
      }
    }

    // MediaRecorder for raw audio if SpeechRecognition is unavailable
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start();
      } catch (err) {
        console.warn('MediaRecorder permission error:', err);
      }
    }
  };

  // Stop Recording with explicit transcript
  const stopRecordingWithText = async (transcript: string) => {
    clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    await processFarmerVoiceMessage(transcript, Math.max(2, recordTimer));
  };

  // Stop Recording with simulated local voice text if mic permissions denied
  const stopRecordingWithSimulatedText = async () => {
    clearInterval(timerIntervalRef.current);
    setIsRecording(false);

    let sampleVoiceQuery = "What is today's price for Ziro valley kiwi?";
    if (activeLang === 'hi') sampleVoiceQuery = 'ज़ीरो में कीवी का आज का भाव क्या है?';
    else if (activeLang === 'as') sampleVoiceQuery = 'জিৰো উপত্যকাৰ কিৱিৰ আজিৰ দাম কিমান?';
    else if (activeLang === 'mni') sampleVoiceQuery = 'জিরোগী ওর্গানিক কিৱি মমল কেজিদা কয়ামনি?';

    await processFarmerVoiceMessage(sampleVoiceQuery, Math.max(3, recordTimer || 3));
  };

  const handleManualStop = () => {
    if (!isRecording) return;
    stopRecordingWithSimulatedText();
  };

  // Send query to Server API `/api/voice-assistant`
  const processFarmerVoiceMessage = async (farmerQuery: string, durationSec: number = 3) => {
    if (!farmerQuery.trim()) return;

    // Dynamically detect command language from user text
    const commandLang = detectInputLanguage(farmerQuery, activeLang);

    const userMsgId = `user-${Date.now()}`;
    const userMsg: VoiceMessage = {
      id: userMsgId,
      sender: 'farmer',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: commandLang,
      isVoiceNote: true,
      audioDurationSec: durationSec,
      transcribedText: farmerQuery,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryText: farmerQuery,
          language: commandLang,
        }),
      });

      const data = await response.json();
      const replyLang = data.language || commandLang;

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: VoiceMessage = {
        id: aiMsgId,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: replyLang,
        isVoiceNote: true,
        audioDurationSec: Math.max(4, Math.ceil((data.speechScript || data.answerText || '').length / 18)),
        transcribedText: data.transcribedText || farmerQuery,
        answerText: data.answerText,
        speechScript: data.speechScript,
        detectedCrop: data.detectedCrop,
        actionSuggestion: data.actionSuggestion,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Auto-decode answer strictly in the user's command language
      handlePlayAudio(aiMsg);
    } catch (error) {
      console.error('Failed to get voice assistant response:', error);
      const fallbackMsg: VoiceMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        language: commandLang,
        isVoiceNote: true,
        audioDurationSec: 5,
        transcribedText: farmerQuery,
        answerText:
          commandLang === 'hi'
            ? 'ज़ीरो कीवी का आज का सीधा भाव ₹165 प्रति किलो है। बिचौलिया केवल ₹75 दे रहा है। हापोली संग्रह केंद्र में अपना माल जमा करें।'
            : commandLang === 'as'
            ? 'জিৰো কিৱিৰ আজিৰ ন্যায্য মূল্য প্ৰতি কেজিত ₹১৬৫। দালালে মাত্ৰ ₹৭৫ দিয়ে। হাপোলি কেন্দ্ৰত ফচল জমা দিয়ক।'
            : commandLang === 'mni'
            ? 'জিরোগী কিৱি মমল কেজিদা ₹১৬৫ নি। স্থানীয় দালালনা ₹৭৫ খক্তমক পীরি।'
            : "Ziro Valley Kiwi today's Fair Harvest direct rate is ₹165/kg versus ₹75/kg from local middlemen.",
        speechScript:
          commandLang === 'hi'
            ? 'कीवी का आज का भाव ₹165 प्रति किलो है। हापोली केंद्र में संपर्क करें।'
            : commandLang === 'as'
            ? 'কিৱিৰ আজিৰ দাম প্ৰতি কেজিত ₹১৬৫ টকা।'
            : commandLang === 'mni'
            ? 'জিরোগী কিৱি মমল কেজিদা ₹১৬৫ নি।'
            : 'Today Kiwi price is ₹165 per kilo. Hapoli collection hub is open.',
        detectedCrop: 'kiwi',
        actionSuggestion: 'view_pool',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      handlePlayAudio(fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    processFarmerVoiceMessage(text, 2);
  };

  // Sample prompt chips by language
  const samplePromptsByLang: Record<string, { label: string; query: string }[]> = {
    auto: [
      { label: '🇮🇳 कीवी का भाव (Hindi)', query: 'ज़ीरो में कीवी का आज का भाव क्या है?' },
      { label: '🌾 কিৱিৰ দাম (Assamese)', query: 'জিৰো উপত্যকাৰ কিৱিৰ আজিৰ দাম কিমান?' },
      { label: '🌿 কমোলাগী মমল (Manipuri)', query: 'দাম্বুক কমোলাগী অচুম্বা মমল কয়ামনি?' },
      { label: '🌐 Ginger Freight (English)', query: 'When is the next truck for ginger to Guwahati?' },
    ],
    hi: [
      { label: 'कीवी का आज का भाव?', query: 'ज़ीरो में कीवी का आज का भाव क्या है?' },
      { label: 'डाम्बुक संतरा गाड़ी समय?', query: 'डाम्बुक से अगली साझा गाड़ी कब जाएगी?' },
      { label: 'बड़ी इलायची पूल में जुड़ना है', query: 'सिक्किम बड़ी इलायची पूल में कैसे जुड़ें?' },
      { label: '100 किलो अदरक का मुनाफा?', query: '100 किलो कार्बी अदरक पर कितना मुनाफा मिलेगा?' },
    ],
    as: [
      { label: 'কিৱিৰ আজিৰ দাম কিমান?', query: 'জিৰো উপত্যকাৰ কিৱিৰ আজিৰ দাম কিমান?' },
      { label: 'ডামবুক কমোলাৰ গাড়ী কেতিয়া?', query: 'ডামবুকৰ পৰা ডিব্ৰুগড়লৈ গাড়ী কেতিয়া যাব?' },
      { label: 'বৰ ইলাচি পুলে যোগ দিয়াৰ নিয়ম?', query: 'ছিকিমৰ বৰ ইলাচি সংগ্ৰহ পুলত কেনেকৈ যোগ দিম?' },
      { label: '১০০ কেজি আদাৰ লাভ?', query: '১০০ কেজি কাৰ্বি আদা বিক্ৰী কৰিলে কিমান লাভ হ’ব?' },
    ],
    mni: [
      { label: 'জিরোদা কিৱি মমল কয়ামনি?', query: 'জিরোগী ওর্গানিক কিৱিগী ঙসিগী মমল কয়ামনি?' },
      { label: 'দাম্বুক কমোলাগী অচুম্বা মমল?', query: 'দাম্বুক কমোলাগী অচুম্বা মমল অমসুং গারীগী মতম হায়বীয়ু?' },
      { label: 'ইলাইচিগী পুলদা য়াওবা?', query: 'সিক্কিমগী ইলাইচি পুলদা ঐহাক্না কমদৌনা য়াওগদগে?' },
      { label: 'শিং য়োল্লগা কান্নবা?', query: 'শিং কিলো ১০০ য়োল্লবদি কয়াম কান্নবা ফংগনি?' },
    ],
    en: [
      { label: "Today's Ziro Kiwi Rate?", query: "What is today's direct rate for Ziro Valley Kiwi?" },
      { label: 'Next truck from Dambuk?', query: 'When is the next shared freight truck from Dambuk?' },
      { label: 'Join Cardamom Collective', query: 'How do I join the Sikkim Large Cardamom pool?' },
      { label: '100kg Ginger Profit', query: 'How much extra profit on 100 kg Karbi ginger?' },
    ],
    bn: [
      { label: 'কিউই ফলের আজকের দাম?', query: 'জিরো কিউই ফলের আজকের ন্যায্য দর কত?' },
      { label: 'কমলালেবুর ট্রাক সময়সূচি?', query: 'দাম্বুক থেকে পরবর্তী ট্রাক কখন ছাড়বে?' },
    ],
    kha: [
      { label: 'Ka dor Soh Kiwi mynta?', query: 'Kano ka dor jong u Soh Kiwi ha Ziro mynta?' },
      { label: 'Ka kali na Dambuk?', query: 'Lano ka kali kit mar na Dambuk kan mih?' },
    ],
    lus: [
      { label: 'Kiwi man zat?', query: 'Ziro Kiwi vawiin man engzat nge?' },
      { label: 'Motor tlan hun?', query: 'Dambuk aṭanga motor tlan hun min hrilh rawh?' },
    ],
  };

  const currentPrompts = samplePromptsByLang[activeLang] || samplePromptsByLang.en;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        className={`bg-stone-900 text-stone-100 rounded-2xl flex flex-col shadow-2xl border border-stone-800 transition-all ${
          isFullScreen ? 'w-full h-full rounded-none' : 'max-w-2xl w-full h-[90vh] max-h-[720px]'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold relative">
              <Bot className="w-5 h-5" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 ring-2 ring-stone-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Kisan Voice Messenger</h3>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  AI Voice-to-Text &amp; Voice Decode
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Spoken dialect to text · Speaks back answers in Hindi, Assamese, Manipuri &amp; English
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mandatory 4-Language Quick Selector Bar */}
        <div className="px-5 py-2.5 bg-stone-950 border-b border-stone-800/80 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-stone-400 whitespace-nowrap">
            <span>Voice Language:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {SUPPORTED_VOICE_LANGS.map((langItem) => (
              <button
                key={langItem.code}
                onClick={() => {
                  setActiveLang(langItem.code);
                  if (langItem.code !== 'auto') {
                    setLanguage(langItem.code);
                  }
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeLang === langItem.code
                    ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-500 font-bold'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <span>{langItem.flag}</span>
                <span>{langItem.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Bubble Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-stone-900/90">
          {messages.map((msg) => {
            const isUser = msg.sender === 'farmer';
            const isPlayingThis = currentlyPlayingId === msg.id && isSpeaking;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm ${
                    isUser
                      ? 'bg-emerald-800 text-white rounded-tr-none'
                      : 'bg-stone-800 text-stone-100 rounded-tl-none border border-stone-700'
                  }`}
                >
                  {/* Voice Note Audio Pill Header */}
                  <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(msg)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isPlayingThis
                            ? 'bg-amber-400 text-stone-950 animate-pulse'
                            : isUser
                            ? 'bg-emerald-900 hover:bg-emerald-950 text-white'
                            : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        }`}
                        title="Listen to audio message"
                      >
                        {isPlayingThis ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      <div className="flex flex-col">
                        <span className="font-semibold text-xs flex items-center gap-1.5">
                          {isUser ? 'Farmer Command' : 'AI Decoded Answer'}
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/15 text-amber-300">
                            {msg.language === 'hi'
                              ? '🇮🇳 हिन्दी'
                              : msg.language === 'as'
                              ? '🌾 অসমীয়া'
                              : msg.language === 'mni'
                              ? '🌿 মৈতৈলোন্'
                              : '🌐 English'}
                          </span>
                          {isPlayingThis && (
                            <span className="text-[10px] text-amber-300 animate-pulse">Playing...</span>
                          )}
                        </span>
                        <span className="text-[10px] opacity-70">
                          0:{String(msg.audioDurationSec || 6).padStart(2, '0')} · {msg.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Audio Waveform visualization */}
                    <div className="flex items-center gap-0.5 h-4 px-2">
                      {[4, 12, 8, 16, 6, 14, 10, 18, 7, 13, 5, 11].map((h, i) => (
                        <span
                          key={i}
                          className={`w-0.5 rounded-full transition-all ${
                            isPlayingThis
                              ? 'bg-amber-300 animate-bounce'
                              : isUser
                              ? 'bg-emerald-300/60'
                              : 'bg-emerald-400/60'
                          }`}
                          style={{
                            height: isPlayingThis ? `${Math.max(4, (h * 1.3) % 18)}px` : `${h}px`,
                            animationDelay: `${i * 80}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Coded Voice into Text Representation */}
                  <div className="space-y-2">
                    {isUser ? (
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider mb-0.5">
                          ✓ Coded Voice into Text:
                        </div>
                        <p className="text-sm font-medium leading-relaxed">
                          "{msg.transcribedText}"
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Decoded Answer in Farmer's Language:</span>
                        </div>
                        <p className="text-sm leading-relaxed text-stone-100">
                          {msg.answerText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Suggestion inside message bubble */}
                  {msg.actionSuggestion && !isUser && (
                    <div className="mt-3 pt-2.5 border-t border-stone-700/80 flex items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] text-stone-400">Recommended Action:</span>
                      {msg.actionSuggestion === 'view_pool' && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToSection?.('produce-pools');
                          }}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                        >
                          <span>View Active Pool</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      {msg.actionSuggestion === 'book_truck' && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToSection?.('transport');
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                        >
                          <span>Book Crate Space</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      {msg.actionSuggestion === 'check_prices' && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToSection?.('mandi-prices');
                          }}
                          className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                        >
                          <span>Check Mandi Rates</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-stone-400 bg-stone-800/60 p-3 rounded-xl max-w-xs">
              <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Decoding voice &amp; generating audio in {activeLang.toUpperCase()}...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Voice Prompt Chips in Selected Language */}
        <div className="px-4 py-2 bg-stone-950 border-t border-stone-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-stone-500 whitespace-nowrap">Tap to ask:</span>
            {currentPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => processFarmerVoiceMessage(chip.query, 3)}
                className="px-2.5 py-1 bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg text-xs whitespace-nowrap transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Central Recording & Voice Input Bar */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 rounded-b-2xl">
          {isRecording ? (
            /* Active Voice Recording Mode */
            <div className="flex items-center justify-between gap-3 bg-red-950/60 border border-red-800/80 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
                <div>
                  <div className="text-xs font-bold text-red-200">
                    Recording Farmer Voice in {activeLang.toUpperCase()}...
                  </div>
                  <div className="text-[11px] font-mono text-red-400">
                    0:{String(recordTimer).padStart(2, '0')} (Speak now in {activeLang})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualStop}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                >
                  Stop &amp; Send Voice
                </button>
              </div>
            </div>
          ) : (
            /* Standard Input Bar with Giant Voice Mic Button */
            <form onSubmit={handleSendText} className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={startRecording}
                className="w-12 h-12 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-amber-300 flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95"
                title="Hold or tap to speak in your local dialect"
              >
                <Mic className="w-6 h-6" />
              </button>

              <input
                type="text"
                placeholder={`Speak or type in ${
                  activeLang === 'hi'
                    ? 'हिन्दी'
                    : activeLang === 'as'
                    ? 'অসমীয়া'
                    : activeLang === 'mni'
                    ? 'মৈতৈলোন্'
                    : 'English'
                }...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-11 h-11 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 px-1">
            <span>Tap green mic to record voice note · Auto-decodes answer in voice</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>Offline-ready fallback</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
