import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI client with required header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Localized fallback knowledge for Northeast agriculture
const FALLBACK_KNOWLEDGE: Record<string, Record<string, { answer: string; speech: string; crop: string; action: string }>> = {
  hi: {
    kiwi: {
      answer: 'ज़ीरो वैली ऑर्गेनिक कीवी का आज का फेयर हार्वेस्ट सीधा भाव ₹165 प्रति किलो है। स्थानीय बिचौलिए केवल ₹75 दे रहे हैं। हापोली विलेज सेंटर पर सक्रिय पूल खुला है, जहाँ 18 किसानों ने मिलकर 2,650 किलो कीवी जमा किया है। आप 25 किलो से भी पूल में जुड़ सकते हैं।',
      speech: 'ज़ीरो कीवी का आज का भाव ₹165 प्रति किलो है। बिचौलिया केवल ₹75 देता है। हापोली केंद्र में अपना कीवी जमा करें।',
      crop: 'kiwi',
      action: 'view_pool',
    },
    orange: {
      answer: 'डाम्बुक रसीले संतरे का आज का फेयर हार्वेस्ट भाव ₹85 प्रति किलो है, जबकि बिचौलिए ₹35 से ज्यादा नहीं देते। डाम्बुक काउंसिल डिपो से साझा बोलेरो कैंपर गुरुवार सुबह 6:00 बजे डिब्रूगढ़ के लिए रवाना होगी। प्रति क्रेट भाड़ा मात्र ₹60 है।',
      speech: 'डाम्बुक संतरा ₹85 प्रति किलो बिक रहा है। गुरुवार सुबह 6 बजे साझा गाड़ी डिब्रूगढ़ जाएगी।',
      crop: 'orange',
      action: 'book_truck',
    },
    cardamom: {
      answer: 'सिक्किम बड़ी इलायची (बड़ी इलाइची) का आज का प्रमाणित ऑर्गेनिक भाव ₹1,380 प्रति किलो है। मंगन किसान उत्पादक केंद्र पर 1,200 किलो का एक्सपोर्ट बैच पूरा हो चुका है। अगला बैच 2 दिनों में खुलेगा।',
      speech: 'सिक्किम बड़ी इलायची का सीधा भाव ₹1,380 प्रति किलो है। मंगन केंद्र पर नया बैच जल्द शुरू होगा।',
      crop: 'cardamom',
      action: 'view_pool',
    },
    ginger: {
      answer: 'कार्बी आंगलोंग हाई-ऑयल अदरक का भाव आज ₹68 प्रति किलो है। बिचौलिए केवल ₹28 देते हैं। दीफू एपीएमसी यार्ड से गुवाहाटी के लिए प्रतिदिन मालगाड़ी वाहन उपलब्ध है, जिसका प्रति क्रेट खर्च मात्र ₹45 है।',
      speech: 'कार्बी अदरक का भाव ₹68 प्रति किलो है। दीफू से गुवाहाटी के लिए हर रोज़ गाड़ी जाती है।',
      crop: 'ginger',
      action: 'book_truck',
    },
    default: {
      answer: 'नमस्ते किसान साथी! फेयर हार्वेस्ट पूर्वोत्तर के किसानों को बिचौलियों से बचाकर सीधे होटल और व्यापारियों से जोड़ता है। आप कीवी, संतरा, बड़ी इलायची या अदरक का आज का भाव जान सकते हैं या साझा गाड़ी बुक कर सकते हैं।',
      speech: 'नमस्ते! आप किसी भी फसल का आज का मंडी भाव पूछ सकते हैं या गाड़ी बुक कर सकते हैं।',
      crop: 'general',
      action: 'check_prices',
    },
  },
  as: {
    kiwi: {
      answer: 'জিৰো উপত্যকাৰ জৈৱিক কিৱিৰ আজিৰ ফেয়াৰ হাৰ্ভেষ্ট ন্যায্য মূল্য প্ৰতি কিলোগ্ৰামত ₹১৬৫। স্থানীয় দালালে মাত্ৰ ₹৭৫ দিয়ে। হাপোলি কেন্দ্ৰত সংগ্ৰহ পুল চলি আছে য’ত ১৮ জন কৃষকে মিলি ২,৬৫০ কেজি জমা কৰিছে। আপুনিও যোগ দিব পাৰে।',
      speech: 'জিৰো কিৱিৰ আজিৰ দাম প্ৰতি কেজিত ₹১৬৫। দালালে মাত্ৰ ₹৭৫ দিয়ে। হাপোলি কেন্দ্ৰত পুলত যোগ দিয়ক।',
      crop: 'kiwi',
      action: 'view_pool',
    },
    orange: {
      answer: 'ডামবুকৰ কমোলা টেঙাৰ আজিৰ ন্যায্য দাম প্ৰতি কেজিত ₹৮৫, দালালে দিয়ে মাত্ৰ ₹৩৫। ডামবুকৰ পৰা ডিব্ৰুগড়লৈ উমৈহতীয়া বলেৰ’ গাড়ী বৃহস্পতিবাৰে পুৱা ৬ বজাত যাব। প্ৰতি ক্ৰেটৰ ভাড়া মাত্ৰ ₹৬০।',
      speech: 'ডামবুক কমোলাৰ দাম ₹৮৫ টকা। বৃহস্পতিবাৰে পুৱা ডিব্ৰুগড়লৈ যোৱা গাড়ীৰ বাবে ক্ৰেট বুক কৰক।',
      crop: 'orange',
      action: 'book_truck',
    },
    cardamom: {
      answer: 'ছিকিমৰ বৰ ইলাচিৰ আজিৰ প্ৰমাণিত জৈৱিক দৰ প্ৰতি কেজিত ₹১,৩৮০। মংগন কৃষক কেন্দ্ৰত মুম্বাই আৰু দিল্লীৰ ক্ৰেতাই পোনে পোনে ক্ৰয় কৰিছে। দালালৰ ₹৭৫০ ৰ তুলনাত আপুনি বহুগুণে বেছি লাভ পাব।',
      speech: 'ছিকিমৰ বৰ ইলাচিৰ দাম ₹১,৩৮০ টকা। মংগন কেন্দ্ৰত পোনপটীয়া সংগ্ৰহ চলিছে।',
      crop: 'cardamom',
      action: 'view_pool',
    },
    ginger: {
      answer: 'কাৰ্বি আংলংৰ তেলযুক্ত সতেজ আদাৰ আজিৰ দাম প্ৰতি কেজিত ₹৬৮। দালালে মাত্ৰ ₹২৮ দিয়ে। ডিফু বজাৰৰ পৰা গুৱাহাটীলৈ দৈনিক গাড়ী চলে, প্ৰতি ক্ৰেটৰ ভাড়া মাত্ৰ ₹৪৫।',
      speech: 'কাৰ্বি আদাৰ দাম প্ৰতি কেজিত ₹৬৮ টকা। ডিফুৰ পৰা গুৱাহাটীলৈ প্ৰতিদিনে গাড়ী উপলব্ধ।',
      crop: 'ginger',
      action: 'book_truck',
    },
    default: {
      answer: 'নমস্কাৰ কৃষক বন্ধু! ফেয়াৰ হাৰ্ভেষ্টে অসম আৰু উত্তৰ-পূবৰ খেতিয়কসকলক দালালৰ শোষণৰ পৰা ৰক্ষা কৰে। আপোনাৰ ফচলৰ ন্যায্য মূল্য জানিবলৈ বা উমৈহতীয়া গাড়ী বুক কৰিবলৈ মোক কওক।',
      speech: 'নমস্কাৰ! আপোনাৰ ফচলৰ আজিৰ বজাৰ দৰ আৰু গাড়ীৰ সময় জানিবলৈ মোক কওক।',
      crop: 'general',
      action: 'check_prices',
    },
  },
  mni: {
    kiwi: {
      answer: 'জিরো ভ্যালিগী ওর্গানিক কিৱিগী ঙসিগী অচুম্বা মমল কিলো অমদা ₹১৬৫ নি। স্থানীয় দালালনা মমল নেম্না ₹৭৫ খক্তমক পীরি। হাপোলীগী পুলদা লৌমী ১৮ না পুন্না ২,৬৫০ কেজি খোমজিনখ্রে। নহাক্না ২৫ কেজিদগী হৌনা য়াওবা য়াই।',
      speech: 'জিরোগী কিৱি মমল কেজিদা ₹১৬৫ নি। দালালগী ₹৭৫ দগী য়াম্না হেন্না ফংগনি।',
      crop: 'kiwi',
      action: 'view_pool',
    },
    orange: {
      answer: 'দাম্বুক কমোলাগী অচুম্বা মমল কিলো অমদা ₹৮৫ নি। দাম্বুকতগী ডিব্রুগড় ফাওবা চৎকদবা পুন্না চৎমিন্নবা গারী শুগলহাক নুমিৎকী অয়ুক পুং ৬:০০ তা থোক্কনি। ক্রেত অমগী ভাড়া ₹৬০ খক্তনি।',
      speech: 'দাম্বুক কমোলা মমল কেজিদা ₹৮৫ নি। শুগলহাক নুমিৎতা ডিব্রুগড় ফাওবা গারী চৎকনি।',
      crop: 'orange',
      action: 'book_truck',
    },
    cardamom: {
      answer: 'সিক্কিমগী ইলাইচি (Badi Elaichi) গী ওর্গানিক মমল কিলোদা ₹১,৩৮০ নি। দালালনা ₹৭৫০ খক্তমক পীদুনা নম্থৈরি। সিক্কিমগী মংগন সেন্তরদা হকথেংনবা মমল ফংহনখ্রে।',
      speech: 'সিক্কিম ইলাইচি মমল কেজিদা ₹১,৩৮০ নি। হকথেংননা য়োল্লগা কান্নবা লৌবীয়ু।',
      crop: 'cardamom',
      action: 'view_pool',
    },
    ginger: {
      answer: 'কার্বি আংলোং শিংগী মমল কিলোদা ₹৬৮ নি। দালালগী মমলদি ₹২৮ নি। দিফু এ.পি.এম.সি. দগী গুৱাহাটী ফাওবা গারী নুমিৎ খুদিংগী লৈ, ক্রেত অমদা ভাড়া ₹৪৫ খক্তনি।',
      speech: 'কার্বি শিংগী মমল কিলোদা ₹৬৮ নি। দিফুদগী গুৱাহাটী ফাওবা নোংমগী গারী লৈ।',
      crop: 'ginger',
      action: 'book_truck',
    },
    default: {
      answer: 'খুরুমজরি লৌমী ইচিল-ইনাও! ফেয়ার হারভেস্টনা নোংপোক লমদমগী লৌমীশিংদা দালাল য়াওদনা হকথেংনবা কৈথেল মমল ফংহন্নবা পাউতাক পীরি। কিৱি, কমোলা, শিং অমসুং ইলাইচিগী মমল হংবীয়ু।',
      speech: 'খুরুমজরি! নহাক্না য়োল্লিবা পোত্থোক্কী মমল অমসুং গারীগী মতম হংবীয়ু।',
      crop: 'general',
      action: 'check_prices',
    },
  },
  en: {
    kiwi: {
      answer: 'Ziro Valley Organic Kiwi is trading at a guaranteed Fair Harvest rate of ₹165/kg today, compared to local middlemen offers of only ₹75/kg. The Hapoli Village pool has 2,650 kg collected from 18 farmers.',
      speech: "Today's Ziro Kiwi direct rate is ₹165 per kilo versus ₹75 from middlemen. Hapoli collection hub is open.",
      crop: 'kiwi',
      action: 'view_pool',
    },
    orange: {
      answer: 'Dambuk Mandarin Orange direct rate is ₹85/kg (middleman rate is ₹35/kg). A shared hill Bolero camper departs Dambuk Council Depot for Dibrugarh on Thursday at 6:00 AM at ₹60 per crate.',
      speech: 'Dambuk Oranges are ₹85 per kilo. Shared truck departs Thursday morning at ₹60 per crate.',
      crop: 'orange',
      action: 'book_truck',
    },
    cardamom: {
      answer: 'Sikkim Large Cardamom (Badi Elaichi) certified organic rate is ₹1,380/kg direct to exporters versus ₹750/kg from touts. Mangan Organic Collective hub is accepting consignments.',
      speech: 'Sikkim Large Cardamom direct rate is ₹1,380 per kilo. Mangan center is accepting bookings.',
      crop: 'cardamom',
      action: 'view_pool',
    },
    ginger: {
      answer: 'Karbi Anglong High-Oil Ginger is priced at ₹68/kg today (middlemen offer only ₹28/kg). The Diphu to Guwahati agro shuttle runs daily at ₹45 per crate.',
      speech: 'Karbi Ginger is ₹68 per kilo. Daily freight to Guwahati is ₹45 per crate from Diphu.',
      crop: 'ginger',
      action: 'book_truck',
    },
    default: {
      answer: 'Hello farmer friend! Fair Harvest connects Northeast growers directly with bulk buyers, bypassing middlemen. You can ask for live mandi rates, join village produce pools, or book shared hill trucks.',
      speech: 'Hello! Ask me about daily mandi rates, village pools, or scheduled truck departures.',
      crop: 'general',
      action: 'check_prices',
    },
  },
};

// Dynamic language detection from user command text/script
function detectCommandLanguage(text: string, preferred: string = 'en'): 'hi' | 'as' | 'mni' | 'en' {
  if (!text) return ['hi', 'as', 'mni'].includes(preferred) ? (preferred as any) : 'en';

  const lower = text.toLowerCase();

  // 1. Devanagari script detection (Hindi)
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }

  // 2. Eastern Nagari / Bengali / Assamese / Meitei script detection
  if (/[\u0980-\u09FF]/.test(text)) {
    // Unique Assamese characters (U+09F0 = ৰ, U+09F1 = ৱ)
    if (/[\u09F0\u09F1]/.test(text)) {
      return 'as';
    }
    // Manipuri specific keywords
    if (/মমল|কয়ামনি|ঙসি|লৌমী|পোত্থোক|খুরুমজরি|পীরি|নম্থৈরি|চৎকনি|কান্নবা/.test(text)) {
      return 'mni';
    }
    // Assamese specific keywords
    if (/কিমান|আমাৰ|আছে|লাগিব|কৰক|ফচল|টেঙা|দালাল|হ’ব|হব|কেজিত|দাম|উমৈহতীয়া/.test(text)) {
      return 'as';
    }
    if (preferred === 'mni') return 'mni';
    if (preferred === 'as') return 'as';
    return 'as'; // Default for eastern script
  }

  // 3. Romanized / Transliterated text detection
  // Hinglish keywords
  if (/\b(kya|hai|bhav|bhaav|kitna|kitne|daam|dam|batao|batayein|kisan|gadi|gaadi|bechna|chahiye|mujhe|namaste|aaj|aajka|paisa|rupaye)\b/i.test(lower)) {
    return 'hi';
  }

  // Romanized Manipuri keywords
  if (/\b(mamal|kayamni|ngasi|loumee|laumi|khurumjari|potthok|shing|komolagi|kiwigi|yolba|chatkaba)\b/i.test(lower)) {
    return 'mni';
  }

  // Romanized Assamese keywords
  if (/\b(kiman|komola|dambuk|kiwir|ketia|lagibo|lagib|korok|aasa|aase|bazar|bhara|bhal|khobor|dibo|dim)\b/i.test(lower)) {
    return 'as';
  }

  // If user selected a specific language preference and text is generic, respect it
  if (['hi', 'as', 'mni'].includes(preferred)) {
    return preferred as any;
  }

  return 'en';
}

// API Endpoint for AI Assistant Voice Messenger
app.post('/api/voice-assistant', async (req: Request, res: Response): Promise<void> => {
  try {
    const { queryText, audioBase64, language = 'auto', audioMimeType = 'audio/webm' } = req.body;

    let transcribedUserText = queryText || '';

    // Step 1: If audioBase64 was uploaded and Gemini AI is available, transcribe using gemini-3.5-transcribe
    if (!transcribedUserText && audioBase64 && ai) {
      try {
        const transcribeResponse = await ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: audioMimeType,
                  data: audioBase64,
                },
              },
              {
                text: `You are an audio transcriber for rural Northeast Indian farmers. Transcribe the spoken audio into text preserving the farmer's exact spoken language (Hindi, Assamese, Manipuri, or English). Return only the transcribed text in its native script.`,
              },
            ],
          },
        });
        transcribedUserText = transcribeResponse.text?.trim() || '';
      } catch (transcribeError) {
        console.warn('Audio transcription error, using text fallback:', transcribeError);
      }
    }

    if (!transcribedUserText) {
      transcribedUserText =
        language === 'hi'
          ? 'कीवी का आज का भाव क्या है?'
          : language === 'as'
          ? 'কিৱিৰ আজিৰ দাম কিমান?'
          : language === 'mni'
          ? 'কিৱিগী মমল কয়ামনি?'
          : "What is today's price for kiwi?";
    }

    // Determine the exact language of the user's command
    const detectedLang = detectCommandLanguage(transcribedUserText, language);

    // Step 2: Use Gemini 3.8 Flash to decode and answer in the user's exact command language
    if (ai) {
      try {
        const systemPrompt = `You are 'Kisan Voice Sathi' (किसान साथी / কিষাণ ভয়েচ সাথী / লৌমী সাথি), an AI Voice Messenger designed for farmers in Northeast India.
CRITICAL MANDATE:
The user has spoken or written a command. YOU MUST DETECT THE EXACT LANGUAGE OF THE USER'S COMMAND AND REPLY IN THAT EXACT SAME LANGUAGE.
- If user command is in Hindi (हिन्दी) -> Respond ONLY in clear, helpful Hindi (Devanagari script).
- If user command is in Assamese (অসমীয়া) -> Respond ONLY in fluent, natural Assamese (অসমীয়া লিপি).
- If user command is in Manipuri (মৈতৈলোন্ / Meiteilon) -> Respond ONLY in natural Manipuri (Meiteilon) using Bengali/Meitei script.
- If user command is in English -> Respond ONLY in simple, helpful English.
- If user command is in Hinglish or transliterated Hindi -> Respond in Hindi (Devanagari script).

Northeast Agricultural Intelligence:
- Ziro Valley Organic Kiwi (Arunachal): Fair Harvest direct rate ₹165/kg (middleman pays ₹75/kg). Hapoli village pool.
- Dambuk Mandarin Orange (Arunachal): Fair Harvest ₹85/kg (middleman pays ₹35/kg). Thursday 6am shared truck to Dibrugarh (₹60/crate).
- Sikkim Large Cardamom (Badi Elaichi): Fair Harvest ₹1,380/kg (middleman pays ₹750/kg). Mangan hub.
- Karbi Anglong High-Oil Ginger (Assam): Fair Harvest ₹68/kg (middleman pays ₹28/kg). Daily Diphu truck (₹45/crate).
- Produce pooling: Individual farmers with 10-100 kg pool together to fulfill bulk orders for hotels and processing plants.

Return valid JSON with these keys:
{
  "detectedLanguage": "hi" | "as" | "mni" | "en",
  "transcribedText": "Farmer's query in native script",
  "answerText": "Detailed helpful answer in the EXACT SAME LANGUAGE as the user's command (2-3 sentences max, warm tone)",
  "speechScript": "Short, clear conversational sentence suitable for voice decoding / text-to-speech reading aloud in that language (under 35 words)",
  "detectedCrop": "kiwi" | "orange" | "cardamom" | "ginger" | "turmeric" | "general",
  "actionSuggestion": "view_pool" | "check_prices" | "book_truck" | "sell_produce"
}`;

        // Call Gemini with a 4-second timeout for snappy voice UX
        const callPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Farmer voice command: "${transcribedUserText}". Preferred hint: ${detectedLang}`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 4000)
        );

        const geminiResponse: any = await Promise.race([callPromise, timeoutPromise]);

        const responseText = geminiResponse.text?.trim() || '{}';
        const parsed = JSON.parse(responseText);

        const finalLang = parsed.detectedLanguage || detectedLang;

        if (parsed.answerText) {
          res.json({
            transcribedText: parsed.transcribedText || transcribedUserText,
            answerText: parsed.answerText,
            speechScript: parsed.speechScript || parsed.answerText,
            detectedCrop: parsed.detectedCrop || 'general',
            actionSuggestion: parsed.actionSuggestion || 'check_prices',
            language: finalLang,
          });
          return;
        }
      } catch (geminiError) {
        console.warn('Gemini generateContent error, activating local knowledge engine:', geminiError);
      }
    }

    // Fallback: Domain knowledge engine for Northeast crops in the detected language
    const queryLower = transcribedUserText.toLowerCase();
    let cropKey = 'default';
    if (queryLower.includes('kiwi') || queryLower.includes('कीवी') || queryLower.includes('কিৱি')) cropKey = 'kiwi';
    else if (queryLower.includes('orange') || queryLower.includes('संतरा') || queryLower.includes('কমোলা') || queryLower.includes('dambuk')) cropKey = 'orange';
    else if (queryLower.includes('cardamom') || queryLower.includes('इलायची') || queryLower.includes('ইলাচি') || queryLower.includes('sikkim')) cropKey = 'cardamom';
    else if (queryLower.includes('ginger') || queryLower.includes('अदरक') || queryLower.includes('আদা') || queryLower.includes('karbi') || queryLower.includes('শিং')) cropKey = 'ginger';

    const kb = (FALLBACK_KNOWLEDGE[detectedLang] || FALLBACK_KNOWLEDGE.en)[cropKey] || (FALLBACK_KNOWLEDGE[detectedLang] || FALLBACK_KNOWLEDGE.en).default;

    res.json({
      transcribedText: transcribedUserText,
      answerText: kb.answer,
      speechScript: kb.speech,
      detectedCrop: kb.crop,
      actionSuggestion: kb.action,
      language: detectedLang,
    });
  } catch (err: any) {
    console.error('Voice assistant endpoint failure:', err);
    res.status(500).json({
      error: 'Failed to process voice message',
      message: err.message,
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fair Harvest server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
