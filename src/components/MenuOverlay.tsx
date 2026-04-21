import { X, Home, Briefcase, Bike, Leaf, MessageSquare, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (target: string) => void;
}

const MenuOverlay = ({ open, onClose, onNavigate }: MenuOverlayProps) => {
  const { t } = useLanguage();

  const items = [
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
          <div className="flex items-center justify-end px-5 pt-4">
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 pt-16">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleClick(item.id)}
                  className="flex w-64 items-center gap-4 rounded-xl bg-card p-4 card-shadow transition-all active:scale-[0.97]"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-display text-sm font-bold text-foreground uppercase tracking-wide">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuOverlay;
