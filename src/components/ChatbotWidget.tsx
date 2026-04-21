import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const faqResponses: Record<string, string> = {
  parking:
    "The stadium has 1,080 parking spaces across 4 zones. Check the Shared Mobility section for real-time availability.",
  room:
    "We have 3 bookable spaces: Loge 'De Koolmijn', Press Room A, and Stadium Workspace. Go to Workspaces to browse and book.",
  energy:
    "The stadium's solar panels generate up to 200 kW. Surplus energy is shared with 5 local neighbours in the community.",
  bike:
    "We have 6 e-bikes available at various locations. Check the E-Bike tab in Shared Mobility to rent one.",
  price:
    "Room prices range from €10/hr (Workspace) to €25/hr (Press Room). VIP Loge is €15/hr.",
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm the Stadium Assistant. How can I help you today?",
      isBot: true,
    },
  ]);

  const getBotResponse = (userMsg: string): string => {
    const lower = userMsg.toLowerCase();
    for (const [key, response] of Object.entries(faqResponses)) {
      if (lower.includes(key)) return response;
    }
    if (lower.includes("car") || lower.includes("auto")) return faqResponses.parking;
    if (lower.includes("book") || lower.includes("loge") || lower.includes("space")) return faqResponses.room;
    if (lower.includes("solar") || lower.includes("power")) return faqResponses.energy;
    if (lower.includes("rent")) return faqResponses.bike;
    if (lower.includes("cost")) return faqResponses.price;

    return "I can help with questions about parking, rooms, energy, bikes, and prices. Feel free to ask!";
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
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            aria-label="Open Stadium Assistant"
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
                Stadium Assistant
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

            <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
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
