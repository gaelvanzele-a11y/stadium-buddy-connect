import { useState } from "react";
import { ArrowLeft, UserPlus, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface InvitePeopleViewProps {
  onBack: () => void;
}

const InvitePeopleView = ({ onBack }: InvitePeopleViewProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(t("inviteSent"));
    setEmail("");
    setMessage("");
  };

  return (
    <div className="px-5 pb-24 pt-6">
      <button onClick={onBack} className="mb-4 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h2 className="mb-1 font-display text-lg font-extrabold text-accent uppercase">
        {t("invitePeople")}
      </h2>
      <p className="mb-5 text-xs text-muted-foreground">{t("inviteDesc")}</p>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleInvite}
        className="rounded-xl bg-card p-5 card-shadow space-y-4"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{t("inviteEmail")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("inviteEmailPlaceholder")}
            className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{t("inviteRole")}</label>
          <div className="flex gap-2">
            {["user", "manager"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
                  role === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {r === "user" ? t("inviteUser") : t("inviteManager")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{t("inviteMessage")}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("inviteMessagePlaceholder")}
            rows={3}
            className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground"
        >
          <Send className="h-4 w-4" />
          {t("sendInvite")}
        </button>
      </motion.form>
    </div>
  );
};

export default InvitePeopleView;