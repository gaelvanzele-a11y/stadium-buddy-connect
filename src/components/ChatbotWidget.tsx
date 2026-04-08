import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const faqResponses: Record<string, { en: string; nl: string }> = {
  parking: {
    en: "The stadium has 1,080 parking spaces across 4 zones. Check the Shared Mobility section for real-time availability.",
    nl: "Het stadion heeft 1.080 Parkeerplaatsen verspreid over 4 zones. Bekijk de Deelmobiliteit sectie voor actuele beschikbaarheid.",
  },
  room: {
    en: "We have 3 bookable spaces: Loge 'De Koolmijn', Persruimte A, and Werkplek Stadion. Go to Workspaces to browse and book.",
    nl: "We hebben 3 ruimtes: Loge 'De Koolmijn', Persruimte A en Werkplek Stadion. Ga naar Werkplekken om te bladeren en te boeken.",
  },
  energy: {
    en: "The stadium's solar panels generate up to 200 kW. Surplus energy is shared with 5 local neighbours in the community.",
    nl: "De zonnepanelen van het stadion genereren tot 200 kW. Overtollige energie wordt gedeeld met 5 lokale buren in de buurt.",
  },
  bike: {
    en: "We have 6 e-bikes available at various locations. Check the E-Bike tab in Shared Mobility to rent one.",
    nl: "We hebben 6 e-bikes beschikbaar op verschillende locaties. Bekijk het E-Fiets tabblad in Deelmobiliteit om er een te huren.",
  },
  price: {
    en: "Room prices range from €10/hr (Workspace) to €25/hr (Press Room). VIP Loge is €15/hr.",
    nl: "Kamerprijzen variëren van €10/u (Werkplek) tot €25/u (Persruimte). VIP Loge kost €15/u.",
  },
};

const ChatbotWidget = () => {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", text: t("chatbotWelcome"), isBot: true },
  ]);

  const getBotResponse = (userMsg: string): string => {
    const lower = userMsg.toLowerCase();
    for (const [key, responses] of Object.entries(faqResponses)) {
      if (lower.includes(key)) {
        return responses[lang];
      }
    }
    // Check for Dutch keywords
    if (lower.includes("parkeer") || lower.includes("auto")) return faqResponses.parking[lang];
    if (lower.includes("ruimte") || lower.includes("boek") || lower.includes("loge")) return faqResponses.room[lang];
    if (lower.includes("energie") || lower.includes("zonne") || lower.includes("solar")) return faqResponses.energy[lang];
    if (lower.includes("fiets") || lower.includes("e-bike")) return faqResponses.bike[lang];
    if (lower.includes("prijs") || lower.includes("kost") || lower.includes("price") || lower.includes("cost")) return faqResponses.price[lang];

    return lang === "nl"
      ? "Ik kan u helpen met vragen over parkeren, ruimtes, energie, fietsen en prijzen. Stel gerust uw vraag!"
      : "I can help with questions about parking, rooms, energy, bikes, and prices. Feel free to ask!";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: `u-${Date.now()}`, text: input, isBot: false };
    const botMsg: Message = { id: `b-${Date.now()}`, text: getBotResponse(input), isBot: true };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-4 left-4 z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
            style={{ maxHeight: "60vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary p-3">
              <span className="font-display text-sm font-bold text-primary-foreground">{t("chatbotTitle")}</span>
              <button onClick={() => setIsOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-2 overflow-y-auto p-3" style={{ maxHeight: "40vh" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.isBot
                      ? "self-start bg-secondary text-foreground"
                      : "self-end bg-primary text-primary-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatbotPlaceholder")}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;