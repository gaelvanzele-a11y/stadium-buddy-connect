import { useState } from "react";
import { MessageCircle, X, Send, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

type ChatAction = { label: string; target: "carpool" };

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  action?: ChatAction;
}

interface ChatbotWidgetProps {
  onNavigateCarpool?: () => void;
}

const ChatbotWidget = ({ onNavigateCarpool }: ChatbotWidgetProps) => {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", text: t("chatbotWelcome"), isBot: true },
  ]);

  // Reset welcome message when language changes
  // (only if user hasn't sent any messages yet)
  if (messages.length === 1 && messages[0].id === "welcome" && messages[0].text !== t("chatbotWelcome")) {
    setMessages([{ id: "welcome", text: t("chatbotWelcome"), isBot: true }]);
  }

  const getBotResponse = (userMsg: string): { text: string; action?: ChatAction } => {
    const lower = userMsg.toLowerCase();

    // Bilingual keyword matching
    const carpoolKeys = lang === "nl"
      ? ["carpool", "samenrijden", "rit"]
      : ["carpool", "rideshare", "ride"];
    const parkingKeys = lang === "nl"
      ? ["parkeer", "parking", "auto", "wagen"]
      : ["parking", "park", "car"];
    const roomKeys = lang === "nl"
      ? ["ruimte", "loge", "boek", "werkplek", "vergader"]
      : ["room", "loge", "book", "space", "workspace", "meeting"];
    const energyKeys = lang === "nl"
      ? ["energie", "zonne", "zon", "stroom"]
      : ["energy", "solar", "power"];
    const bikeKeys = lang === "nl"
      ? ["fiets", "huur"]
      : ["bike", "rent"];
    const priceKeys = lang === "nl"
      ? ["prijs", "kost", "tarief"]
      : ["price", "cost", "rate"];

    // Check carpool first so it doesn't get caught by parking ("auto") or bike ("rit"-like)
    if (carpoolKeys.some((k) => lower.includes(k))) {
      return {
        text: t("chatbotResponseCarpool"),
        action: { label: t("chatbotGoToCarpool"), target: "carpool" },
      };
    }
    if (parkingKeys.some((k) => lower.includes(k))) return { text: t("chatbotResponseParking") };
    if (roomKeys.some((k) => lower.includes(k))) return { text: t("chatbotResponseRoom") };
    if (energyKeys.some((k) => lower.includes(k))) return { text: t("chatbotResponseEnergy") };
    if (bikeKeys.some((k) => lower.includes(k))) return { text: t("chatbotResponseBike") };
    if (priceKeys.some((k) => lower.includes(k))) return { text: t("chatbotResponsePrice") };

    return { text: t("chatbotFallback") };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const response = getBotResponse(input);
    const userMsg: Message = { id: `u-${Date.now()}`, text: input, isBot: false };
    const botMsg: Message = {
      id: `b-${Date.now()}`,
      text: response.text,
      isBot: true,
      action: response.action,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleAction = (action: ChatAction) => {
    if (action.target === "carpool") {
      onNavigateCarpool?.();
      setIsOpen(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            aria-label={t("chatbotTitle")}
          >
            <MessageCircle className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-4 left-4 z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
            style={{ maxHeight: "60vh" }}
          >
            <div className="flex items-center justify-between bg-primary p-3">
              <span className="font-display text-sm font-bold text-primary-foreground">
                {t("chatbotTitle")}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto p-3" style={{ maxHeight: "40vh" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex max-w-[85%] flex-col gap-2 ${
                    msg.isBot ? "self-start items-start" : "self-end items-end"
                  }`}
                >
                  <div
                    className={`rounded-xl px-3 py-2 text-sm ${
                      msg.isBot
                        ? "bg-secondary text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.isBot && msg.action && (
                    <button
                      onClick={() => handleAction(msg.action!)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-mobility-blue px-3 py-1.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      {msg.action.label}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

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
                aria-label="Send"
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
