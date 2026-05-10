import { useState } from "react";
import { User, Lock, LogIn, UserPlus, ArrowLeft, Building2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import loginBg from "@/assets/login-bg.jpg";

interface LoginGateProps {
  onLogin: (username: string, isManager: boolean) => void;
}

type Mode = "landing" | "login" | "register";

interface LocalUser {
  username: string;
  password: string;
  displayName: string;
}

const LOCAL_USERS_KEY = "mijnstadion.localUsers";

// Hardcoded credentials. Username matching is case-insensitive and trims whitespace.
const VALID_USERS: { username: string; password: string; isManager: boolean; displayName: string }[] = [
  { username: "hub manager", password: "1234", isManager: true, displayName: "Hub Manager" },
  { username: "hubmanager", password: "1234", isManager: true, displayName: "Hub Manager" },
  { username: "robyn van rompaey", password: "4321", isManager: false, displayName: "Robyn Van Rompaey" },
  { username: "frans", password: "1234", isManager: false, displayName: "Frans" },
];

const readLocalUsers = (): LocalUser[] => {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalUsers = (users: LocalUser[]) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const LoginGate = ({ onLogin }: LoginGateProps) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("landing");

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const resetMessages = () => {
    setError("");
    setInfo("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const normalized = username.trim().toLowerCase();
    const builtIn = VALID_USERS.find((u) => u.username === normalized);
    if (builtIn) {
      if (builtIn.password !== password) {
        setError(t("wrongPassword"));
        return;
      }
      onLogin(builtIn.displayName, builtIn.isManager);
      return;
    }
    const local = readLocalUsers().find((u) => u.username === normalized);
    if (!local) {
      setError(t("invalidCredentials"));
      return;
    }
    if (local.password !== password) {
      setError(t("wrongPassword"));
      return;
    }
    onLogin(local.displayName, false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const normalized = regUsername.trim().toLowerCase();
    const existsBuiltIn = VALID_USERS.some((u) => u.username === normalized);
    const users = readLocalUsers();
    const existsLocal = users.some((u) => u.username === normalized);
    if (existsBuiltIn || existsLocal) {
      setError(t("userAlreadyExists"));
      return;
    }
    if (regPassword !== regConfirm) {
      setError(t("passwordsDontMatch"));
      return;
    }
    const newUser: LocalUser = {
      username: normalized,
      password: regPassword,
      displayName: regName.trim() || regUsername.trim(),
    };
    writeLocalUsers([...users, newUser]);
    // Pre-fill login and switch back
    setUsername(regUsername.trim());
    setPassword("");
    setRegName("");
    setRegUsername("");
    setRegPassword("");
    setRegConfirm("");
    setMode("login");
    setInfo(t("accountCreated"));
  };

  const goToMode = (next: Mode) => {
    resetMessages();
    setMode(next);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background px-5 pb-10 pt-6">
      <div className="flex justify-end">
        <LanguageToggle />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          {mode === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
                  <Building2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h1 className="font-display text-3xl font-extrabold leading-tight text-accent">
                  {t("loginWelcome")}
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">{t("landingTagline")}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => goToMode("login")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground"
                >
                  <LogIn className="h-4 w-4" />
                  {t("signIn")}
                </button>
                <button
                  onClick={() => goToMode("register")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-card py-3.5 font-display text-sm font-bold text-primary"
                >
                  <UserPlus className="h-4 w-4" />
                  {t("signUp")}
                </button>
              </div>
            </motion.div>
          )}

          {mode === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => goToMode("landing")}
                className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("backToWelcome")}
              </button>

              <div className="mb-6 text-center">
                <h1 className="font-display text-2xl font-extrabold leading-tight text-accent">
                  {t("signIn")}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">{t("loginSubtitle")}</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
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

                  {info && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-energy-leaf/10 px-3 py-2 text-xs font-semibold text-energy-leaf"
                    >
                      {info}
                    </motion.p>
                  )}

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

                <button
                  type="button"
                  onClick={() => goToMode("register")}
                  className="block w-full text-center text-xs font-semibold text-muted-foreground"
                >
                  {t("noAccountYet")}{" "}
                  <span className="text-primary underline-offset-2 hover:underline">
                    {t("signUp")}
                  </span>
                </button>
              </form>
            </motion.div>
          )}

          {mode === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => goToMode("landing")}
                className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("backToWelcome")}
              </button>

              <div className="mb-6 text-center">
                <h1 className="font-display text-2xl font-extrabold leading-tight text-accent">
                  {t("createAccount")}
                </h1>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-4 rounded-xl bg-card p-5 card-shadow">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                      {t("fullName")}
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={t("fullNamePlaceholder")}
                      className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                      {t("username")}
                    </label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder={t("usernamePlaceholder")}
                      className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                      {t("password")}
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder={t("passwordPlaceholder")}
                      className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                      minLength={4}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                      {t("confirmPassword")}
                    </label>
                    <input
                      type="password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      placeholder={t("passwordPlaceholder")}
                      className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                      minLength={4}
                    />
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
                  <UserPlus className="h-4 w-4" />
                  {t("register")}
                </button>

                <button
                  type="button"
                  onClick={() => goToMode("login")}
                  className="block w-full text-center text-xs font-semibold text-muted-foreground"
                >
                  {t("alreadyHaveAccount")}{" "}
                  <span className="text-primary underline-offset-2 hover:underline">
                    {t("signIn")}
                  </span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginGate;
