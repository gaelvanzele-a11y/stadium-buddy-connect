import { useState } from "react";
import { User, Lock, LogIn, LogOut, Shield, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface AccountViewProps {
  onGovernanceLogin?: () => void;
  onInvitePeople?: () => void;
}

const AccountView = ({ onGovernanceLogin, onInvitePeople }: AccountViewProps) => {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === "hubmanager") {
      if (password === "1234") {
        setIsLoggedIn(true);
        onGovernanceLogin?.();
        return;
      }
      setError(t("wrongPassword"));
      return;
    }

    if (username && password) {
      setIsLoggedIn(true);
      return;
    }
    setError(t("invalidCredentials"));
  };

  if (isLoggedIn && username !== "hubmanager") {
    return (
      <div className="px-5 pb-24 pt-6">
        <h2 className="mb-5 font-display text-lg font-extrabold text-accent uppercase">
          {t("account")}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card p-5 card-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-display text-base font-bold text-foreground">{username}</p>
              <p className="text-xs text-muted-foreground">{t("loggedIn")}</p>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => onInvitePeople?.()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-display text-sm font-bold text-primary-foreground"
        >
          <UserPlus className="h-4 w-4" />
          {t("invitePeople")}
        </button>

        <button
          onClick={() => { setIsLoggedIn(false); setUsername(""); setPassword(""); }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 font-display text-sm font-bold text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pb-24 pt-6">
      <h2 className="mb-5 font-display text-lg font-extrabold text-accent uppercase">
        {t("login")}
      </h2>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleLogin}
        className="space-y-4"
      >
        <div className="rounded-xl bg-card p-5 card-shadow space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{t("username")}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("usernamePlaceholder")}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{t("password")}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
            >
              {error}
            </motion.p>
          )}
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground"
        >
          <LogIn className="h-4 w-4" />
          {t("login")}
        </button>

        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3 text-[11px] text-muted-foreground">
          <Shield className="h-4 w-4 flex-shrink-0" />
          <span>{t("hubManagerHint")}</span>
        </div>
      </motion.form>
    </div>
  );
};

export default AccountView;