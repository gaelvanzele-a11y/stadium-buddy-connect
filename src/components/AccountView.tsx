import { useState } from "react";
import { User, Mail, Lock, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const AccountView = () => {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
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
              <p className="font-display text-base font-bold text-foreground">{email}</p>
              <p className="text-xs text-muted-foreground">{t("loggedIn")}</p>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => { setIsLoggedIn(false); setEmail(""); setPassword(""); }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 font-display text-sm font-bold text-destructive"
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
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{t("email")}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
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
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground"
        >
          <LogIn className="h-4 w-4" />
          {t("login")}
        </button>
      </motion.form>
    </div>
  );
};

export default AccountView;
