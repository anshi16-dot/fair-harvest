import React, { useState } from 'react';
import { X, Mic, Volume2, PhoneCall, Sparkles, Check, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CROP_DATA, INITIAL_ROUTES } from '../data/mockData';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSellModal: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpenSellModal,
}) => {
  const { t, speak, isSpeaking, stopSpeaking, language } = useLanguage();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>(
    language === 'hi'
      ? 'नमस्ते किसान साथी! आप बोलकर मंडी भाव, सामूहिक पूलिंग या पहाड़ी वाहन के बारे में पूछ सकते हैं।'
      : language === 'as'
      ? 'নমস্কাৰ কৃষক বন্ধু! আপুনি মুখেৰে কৈ দৈনিক দাম, সংগ্ৰহ পুল বা বাহনৰ সময়সূচী জানিব পাৰে।'
      : 'Hello Farmer Friend! Tap the microphone to ask about daily mandi rates, active village pools, or truck schedules in your dialect.'
  );

  if (!isOpen) return null;

  const quickVoicePrompts = [
    {
      label: language === 'hi' ? 'कीवी का आज का भाव?' : language === 'as' ? 'কিৱিৰ আজিৰ দাম কিমান?' : "Today's Kiwi Price?",
      query: "What is today's rate for Ziro Valley Kiwi?",
      reply:
        language === 'hi'
          ? 'ज़ीरो वैली ऑर्गेनिक कीवी का आज का फेयर हार्वेस्ट भाव ₹165 प्रति किलो है। स्थानीय बिचौलिया केवल ₹75 दे रहा है। सामूहिक पूल में शामिल होकर ₹90 प्रति किलो अधिक मुनाफा पाएं!'
          : language === 'as'
          ? 'জিৰো উপত্যকাৰ কিৱিৰ আজিৰ ন্যায্য মূল্য প্ৰতি কেজিত ₹১৬৫। দালালে মাত্ৰ ₹৭৫ দিয়ে। পুলে যোগ দি প্ৰতি কেজিত ₹৯০ বেছি লাভ কৰক!'
          : "Today's Fair Harvest price for Ziro Valley Kiwi is ₹165/kg. Middlemen pay only ₹75/kg. Direct pooling earns you ₹90/kg more!"
    },
    {
      label: language === 'hi' ? 'डाम्बुक से अगली गाड़ी कब है?' : language === 'as' ? 'ডামবুকৰ পৰা গাড়ী কেতিয়া?' : "Next truck from Dambuk?",
      query: "When is the next shared truck from Dambuk?",
      reply:
        language === 'hi'
          ? 'डाम्बुक से पासीघाट और डिब्रूगढ़ के लिए बोलेरो कैंपर गुरुवार सुबह 6:00 बजे रवाना होगी। प्रति क्रेट किराया ₹60 है। डाम्बुक काउंसिल डिपो पर क्रेट लाएं।'
          : language === 'as'
          ? 'ডামবুকৰ পৰা পাচিঘাট আৰু ডিব্ৰুগড়লৈ গাড়ী বৃহস্পতিবাৰে পুৱা ৬:০০ বজাত যাব। প্ৰতি ক্ৰেটৰ ভাড়া ₹৬০।'
          : 'The next shared Bolero from Dambuk departs Thursday at 6:00 AM. Freight is ₹60 per crate to Dibrugarh logistics terminal.'
    },
    {
      label: language === 'hi' ? '100 किलो अदरक का मुनाफा?' : language === 'as' ? '১০০ কেজি আদাৰ লাভ কিমান?' : 'Profit on 100kg Ginger?',
      query: "How much extra profit on 100 kg ginger?",
      reply:
        language === 'hi'
          ? '100 किलो कार्बी अदरक फेयर हार्वेस्ट से बेचने पर ₹6,800 मिलेंगे। बिचौलिया केवल ₹2,800 देगा। आपको सीधा ₹4,000 का अतिरिक्त शुद्ध लाभ होगा!'
          : language === 'as'
          ? '১০০ কেজি কাৰ্বি আদা বিক্ৰী কৰিলে আপুনি ₹৬,৮০০ পাব। দালালে দিব মাত্ৰ ₹২,৮০০। আপোনাৰ পোনে পোনে ₹৪,০০০ অতিৰিক্ত লাভ হ’ব!'
          : 'For 100kg Karbi Ginger, Fair Harvest pays ₹6,800 vs middleman ₹2,800. You earn ₹4,000 net extra profit!'
    }
  ];

  const handleTriggerPrompt = (query: string, reply: string) => {
    setUserQuery(query);
    setAiResponse(reply);
    speak(reply);
  };

  const handleMicClick = () => {
    setIsListening(true);
    setUserQuery('Listening to your voice...');

    // Attempt web speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'as' ? 'as-IN' : 'en-IN';
        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setUserQuery(text);
          setIsListening(false);
          processVoiceQuery(text);
        };
        recognition.onerror = () => {
          handleSimulatedVoice();
        };
        recognition.start();
        return;
      } catch (e) {
        handleSimulatedVoice();
      }
    } else {
      handleSimulatedVoice();
    }
  };

  const handleSimulatedVoice = () => {
    setTimeout(() => {
      const simulatedText =
        language === 'hi'
          ? 'सिक्किम बड़ी इलायची का भाव बताओ'
          : language === 'as'
          ? 'ছিকিমৰ বৰ ইলাচিৰ দাম কিমান'
          : 'Check large cardamom price in Sikkim';

      const simulatedResponse =
        language === 'hi'
          ? 'सिक्किम बड़ी इलायची (बड़ी इलाइची) का आज का उचित भाव ₹1,380 प्रति किलो है। मंगन संग्रह केंद्र पर वजन कराएं।'
          : language === 'as'
          ? 'ছিকিমৰ বৰ ইলাচিৰ আজিৰ উচিত মূল্য প্ৰতি কেজিত ₹১,৩৮০। মংগন কেন্দ্ৰত পোনপটীয়াকৈ সংগ্ৰহ চলিছে।'
          : 'Today Sikkim Large Cardamom direct rate is ₹1,380 per kilogram. Mangan Hub collective is open.';

      setUserQuery(simulatedText);
      setAiResponse(simulatedResponse);
      setIsListening(false);
      speak(simulatedResponse);
    }, 1800);
  };

  const processVoiceQuery = (text: string) => {
    const lower = text.toLowerCase();
    let reply = '';
    if (lower.includes('kiwi') || lower.includes('कीवी') || lower.includes('কিৱি')) {
      reply = `Ziro Kiwi is trading at ₹165/kg on Fair Harvest vs ₹75 from middlemen. 18 farmers have pooled 2,650 kg.`;
    } else if (lower.includes('orange') || lower.includes('संतरा') || lower.includes('কমোলা')) {
      reply = `Dambuk Mandarin Orange is ₹85/kg on Fair Harvest vs ₹35 from local middlemen.`;
    } else if (lower.includes('truck') || lower.includes('गाड़ी') || lower.includes('transport') || lower.includes('পৰিবহণ')) {
      reply = `Scheduled cold truck from Ziro leaves tomorrow at 5:30 AM. Freight is ₹75 per crate.`;
    } else {
      reply = `Fair Harvest guarantees direct payments for Northeast farmers. Today's active pools are open in Ziro, Dambuk, Mangan, and Diphu.`;
    }
    setAiResponse(reply);
    speak(reply);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-start justify-between pb-4 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Voice-First Rural Assistant
            </div>
            <h3 className="text-xl font-bold text-stone-900 mt-0.5">
              Kisan Voice Sathi (কণ্ঠ সহায়ক)
            </h3>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Audio / Mic Interaction Zone */}
        <div className="py-6 flex flex-col items-center text-center">
          <button
            onClick={handleMicClick}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-100 shadow-lg'
                : 'bg-emerald-800 hover:bg-emerald-900 text-amber-300 ring-8 ring-emerald-50 shadow-md'
            }`}
          >
            <Mic className="w-10 h-10" />
          </button>

          <div className="mt-4 text-xs font-semibold text-stone-700">
            {isListening ? 'Listening to your voice... Speak now' : 'Tap big button and speak in your language'}
          </div>

          {userQuery && (
            <div className="mt-3 px-3 py-1.5 bg-stone-100 rounded-lg text-xs text-stone-600 italic max-w-xs">
              "{userQuery}"
            </div>
          )}
        </div>

        {/* Voice Sathi Response Card */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-6">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase text-emerald-900 flex items-center gap-1.5">
              <span>🌾 Sathi Audio Voice Response:</span>
            </span>

            <button
              onClick={() => speak(aiResponse)}
              className="p-1 rounded bg-white text-emerald-800 hover:bg-emerald-100 transition-colors"
              title="Repeat audio read-out"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm font-medium text-emerald-950 leading-relaxed">
            {aiResponse}
          </p>
        </div>

        {/* Quick Voice Question Suggestions */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-stone-600 mb-2">
            Or tap common farmer questions:
          </div>
          <div className="flex flex-wrap gap-2">
            {quickVoicePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTriggerPrompt(p.query, p.reply)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors text-left"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Action Bottom Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-200 text-xs">
          <div className="flex items-center gap-1.5 text-stone-600">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kisan Call Center: <strong>1800-180-1551</strong> (Toll Free)</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenSellModal();
            }}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold transition-colors shadow-xs"
          >
            Sell Produce Now
          </button>
        </div>
      </div>
    </div>
  );
};
