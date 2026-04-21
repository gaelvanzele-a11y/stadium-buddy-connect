import { useState } from "react";
import { User, Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

interface LoginGateProps {
  onLogin: (username: string, isManager: boolean) => void;
}

// Hardcoded credentials. Username matching is case-insensitive and trims whitespace.
const VALID_USERS: { username: string; password: string; isManager: boolean; displayName: string }[] = [
  { username: "hub manager", password: "1234", isManager: true, displayName: "Hub Manager" },
  { username: "hubmanager", password: "1234", isManager: true, displayName: "Hub Manager" },
  { username: "robyn van rompaey", password: "4321", isManager: false, displayName: "Robyn Van Rompaey" },
];

const LoginGate = ({ onLogin }: LoginGateProps) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const normalized = username.trim().toLowerCase();
    const match = VALID_USERS.find((u) => u.username === normalized);
    if (!match) {
      setError(t("invalidCredentials"));
      return;
    }
    if (match.password !== password) {
      setError(t("wrongPassword"));
      return;
    }
    onLogin(match.displayName, match.isManager);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background px-5 pb-10 pt-6">
      <div className="flex justify-end">
        <LanguageToggle />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="font-display text-2xl font-extrabold text-accent leading-tight">
            {t("loginWelcome")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("loginSubtitle")}</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-4 rounded-xl bg-card p-5 card-shadow">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                {t("username")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("usernamePlaceholder")}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                {t("password")}
              </label>
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
        </motion.form>
      </div>
    </div>
  );
};

export default LoginGate;
