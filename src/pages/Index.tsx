import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, Briefcase, Bike, Leaf } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import RoomListView from "@/components/RoomListView";
import RoomDetailView from "@/components/RoomDetailView";
import BookingConfirmView from "@/components/BookingConfirmView";
import BookingSuccessView from "@/components/BookingSuccessView";
import ParkingMobilityView from "@/components/ParkingMobilityView";
import EnergySharingView from "@/components/EnergySharingView";
import AccountView from "@/components/AccountView";

export type AppView =
  | { type: "home" }
  | { type: "rooms" }
  | { type: "roomDetail"; roomId: string }
  | { type: "bookingConfirm"; roomId: string }
  | { type: "bookingSuccess"; roomId: string }
  | { type: "mobility" }
  | { type: "energy" }
  | { type: "account" };

const Index = () => {
  const { t } = useLanguage();
  const [view, setView] = useState<AppView>({ type: "home" });
  const [bottomTab, setBottomTab] = useState("home");

  const goHome = () => {
    setView({ type: "home" });
    setBottomTab("home");
  };

  const handleBottomTab = (tab: string) => {
    setBottomTab(tab);
    if (tab === "home") setView({ type: "home" });
    if (tab === "account") setView({ type: "account" });
  };

  const categories = [
    {
      id: "workspaces",
      label: t("workspaces"),
      icon: Briefcase,
      bgClass: "bg-accent",
      action: () => setView({ type: "rooms" }),
    },
    {
      id: "mobility",
      label: t("sharedMobility"),
      icon: Bike,
      bgClass: "bg-mobility-blue",
      action: () => setView({ type: "mobility" }),
    },
    {
      id: "energy",
      label: t("neighborhoodEnergy"),
      icon: Leaf,
      bgClass: "bg-energy-leaf",
      action: () => setView({ type: "energy" }),
    },
  ];

  const renderView = () => {
    switch (view.type) {
      case "rooms":
        return <RoomListView onBack={goHome} onSelectRoom={(id) => setView({ type: "roomDetail", roomId: id })} />;
      case "roomDetail":
        return <RoomDetailView roomId={view.roomId} onBack={() => setView({ type: "rooms" })} onBook={() => setView({ type: "bookingConfirm", roomId: view.roomId })} />;
      case "bookingConfirm":
        return <BookingConfirmView roomId={view.roomId} onBack={() => setView({ type: "roomDetail", roomId: view.roomId })} onConfirm={() => setView({ type: "bookingSuccess", roomId: view.roomId })} />;
      case "bookingSuccess":
        return <BookingSuccessView roomId={view.roomId} onBack={goHome} />;
      case "mobility":
        return <ParkingMobilityView onBack={goHome} />;
      case "energy":
        return <EnergySharingView onBack={goHome} />;
      case "account":
        return <AccountView />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background pb-20">
      {/* TopBar with language toggle + hamburger menu on all screens */}
      <TopBar onHomeClick={goHome} showMenu={view.type !== "home"} />

      <AnimatePresence mode="wait">
        {view.type === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5 pt-2"
          >
            {/* Header */}
            <div className="mb-5">
              <h1 className="font-display text-xl font-extrabold text-accent leading-tight">
                {t("welcome")}
              </h1>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Categories */}
            <div className="mb-6 space-y-3">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={cat.action}
                    className="flex w-full items-center justify-between rounded-xl bg-card p-4 card-shadow transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-display text-base font-bold text-foreground uppercase tracking-wide">
                        {cat.label}
                      </span>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.bgClass}`}>
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Energy savings banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl bg-energy-leaf p-4 card-shadow"
            >
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary-foreground" />
                <div>
                  <p className="font-display text-sm font-bold text-primary-foreground">
                    {t("todaySaving")}
                  </p>
                  <p className="font-display text-lg font-extrabold text-primary-foreground">
                    €1.2k {t("inEnergy")}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={view.type}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderView()}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeTab={bottomTab} onTabChange={handleBottomTab} />
    </div>
  );
};

export default Index;
