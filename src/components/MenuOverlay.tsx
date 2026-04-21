import { X, Home, Briefcase, Bike, Leaf, MessageSquare, Ticket, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (target: string) => void;
  onLogout: () => void;
  isManager?: boolean;
  userName?: string;
}

const MenuOverlay = ({ open, onClose, onNavigate, onLogout, isManager = false, userName }: MenuOverlayProps) => {
  const { t } = useLanguage();

  const items = isManager
    ? []
    : [
        { id: "home", label: t("home"), icon: Home },
        { id: "rooms", label: t("workspaces"), icon: Briefcase },
        { id: "mobility", label: t("sharedMobility"), icon: Bike },
        { id: "energy", label: t("neighborhoodEnergy"), icon: Leaf },
        { id: "ticketshop", label: t("ticketshop"), icon: Ticket },
        { id: "feedback", label: t("communityFeedback"), icon: MessageSquare },
      ];

  const handleClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-5 pt-4">
            <span className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wide">
              {userName}
            </span>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mx-auto flex w-full max-w-sm flex-col gap-3 px-5 pt-10">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleClick(item.id)}
                  className="flex w-full items-center gap-4 rounded-xl bg-card p-4 card-shadow transition-all active:scale-[0.97] text-left"
                >
                  <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-display text-sm font-bold text-foreground uppercase tracking-wide text-left">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: items.length * 0.05 + 0.05 }}
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="mt-3 flex w-full items-center gap-4 rounded-xl border border-destructive/30 bg-card p-4 card-shadow transition-all active:scale-[0.97] text-left"
            >
              <LogOut className="h-5 w-5 text-destructive flex-shrink-0" />
              <span className="font-display text-sm font-bold text-destructive uppercase tracking-wide text-left">
                {t("logout")}
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuOverlay;
