import { useState } from "react";
import { MessageSquare, Send, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeedbackItem {
  id: string;
  author: string;
  message: string;
  date: string;
  likes: number;
  category: string;
}

const CommunityFeedbackView = () => {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([
    { id: "1", author: "Jan D.", message: t("feedbackExample1"), date: "06 Apr 2026", likes: 12, category: "facilities" },
    { id: "2", author: "Lisa V.", message: t("feedbackExample2"), date: "05 Apr 2026", likes: 8, category: "energy" },
    { id: "3", author: "Mohammed A.", message: t("feedbackExample3"), date: "04 Apr 2026", likes: 5, category: "mobility" },
  ]);

  const categories = [
    { id: "general", label: t("general") },
    { id: "facilities", label: t("facilities") },
    { id: "mobility", label: t("mobilityCategory") },
    { id: "energy", label: t("energyCategory") },
    { id: "safety", label: t("safety") },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newItem: FeedbackItem = {
      id: Date.now().toString(),
      author: t("you"),
      message,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      likes: 0,
      category,
    };
    setFeedbackList([newItem, ...feedbackList]);
    setMessage("");
  };

  const handleLike = (id: string) => {
    setFeedbackList(feedbackList.map((f) => (f.id === id ? { ...f, likes: f.likes + 1 } : f)));
  };

  return (
    <div className="px-5 pb-24 pt-6">
      <h2 className="mb-5 font-display text-lg font-extrabold text-accent uppercase">
        {t("communityFeedback")}
      </h2>

      {/* Submit form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="mb-6 rounded-xl bg-card p-4 card-shadow"
      >
        <div className="mb-3 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                category === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("feedbackPlaceholder")}
            className="flex-1 rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </motion.form>

      {/* Feedback list */}
      <div className="space-y-3">
        {feedbackList.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card p-4 card-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{item.author}</p>
                  <p className="text-[11px] text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {categories.find((c) => c.id === item.category)?.label}
              </span>
            </div>
            <p className="mt-2 text-sm text-foreground">{item.message}</p>
            <button
              onClick={() => handleLike(item.id)}
              className="mt-2 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <ThumbsUp className="h-3 w-3" /> {item.likes}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeedbackView;
