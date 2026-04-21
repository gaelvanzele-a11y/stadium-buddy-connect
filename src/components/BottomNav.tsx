import { Home, Search, CalendarDays, Ticket, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isManager?: boolean;
}

const BottomNav = ({ activeTab, onTabChange, isManager = false }: BottomNavProps) => {
  const { t } = useLanguage();

  // Hub manager has no bottom nav at all (KPI dashboard only)
  if (isManager) return null;

  const tabs = [
    { id: "home", label: t("home"), icon: Home },
    { id: "search", label: t("search"), icon: Search },
    { id: "bookings", label: t("bookings"), icon: CalendarDays },
    { id: "feedback", label: t("concerns"), icon: MessageSquare },
    { id: "ticketshop", label: t("ticketshopShort"), icon: Ticket },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card card-shadow-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
