import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, Briefcase, Bike, Leaf } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import MenuOverlay from "@/components/MenuOverlay";
import RoomListView from "@/components/RoomListView";
import RoomDetailView from "@/components/RoomDetailView";
import BookingConfirmView from "@/components/BookingConfirmView";
import BookingSuccessView from "@/components/BookingSuccessView";
import ParkingMobilityView from "@/components/ParkingMobilityView";
import EnergySharingView from "@/components/EnergySharingView";
import AccountView from "@/components/AccountView";
import SearchView from "@/components/SearchView";
import BookingsView, { type Booking } from "@/components/BookingsView";
import CommunityFeedbackView from "@/components/CommunityFeedbackView";
import GovernanceDashboard from "@/components/GovernanceDashboard";
import { rooms } from "@/data/rooms";

export type AppView =
  | { type: "home" }
  | { type: "search" }
  | { type: "bookingsList" }
  | { type: "rooms" }
  | { type: "roomDetail"; roomId: string }
  | { type: "bookingConfirm"; roomId: string }
  | { type: "bookingSuccess"; roomId: string }
  | { type: "mobility" }
  | { type: "energy" }
  | { type: "account" }
  | { type: "feedback" }
  | { type: "governance" };

const Index = () => {
  const { t } = useLanguage();
  const [view, setView] = useState<AppView>({ type: "home" });
  const [bottomTab, setBottomTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const goHome = () => {
    setView({ type: "home" });
    setBottomTab("home");
  };

  const handleBottomTab = (tab: string) => {
    setBottomTab(tab);
    if (tab === "home") setView({ type: "home" });
    if (tab === "search") setView({ type: "search" });
    if (tab === "bookings") setView({ type: "bookingsList" });
    if (tab === "account") setView({ type: "account" });
    if (tab === "feedback") setView({ type: "feedback" });
  };

  const handleMenuNavigate = (target: string) => {
    if (target === "home") { goHome(); return; }
    if (target === "rooms") { setView({ type: "rooms" }); setBottomTab(""); return; }
    if (target === "mobility") { setView({ type: "mobility" }); setBottomTab(""); return; }
    if (target === "energy") { setView({ type: "energy" }); setBottomTab(""); return; }
    if (target === "feedback") { setView({ type: "feedback" }); setBottomTab("feedback"); return; }
  };

  const handleBookingSuccess = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      const newBooking: Booking = {
        id: Date.now().toString(),
        roomName: room.name,
        date: "15 Oct 2026",
        time: "14:00 - 16:00",
        location: t("stadiumEntrance"),
      };
      setBookings((prev) => [newBooking, ...prev]);
    }
    setView({ type: "bookingSuccess", roomId });
  };

  const handleGovernanceLogin = () => {
    setView({ type: "governance" });
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
      case "search":
        return (
          <SearchView
            onSelectRoom={(id) => setView({ type: "roomDetail", roomId: id })}
            onGoMobility={() => setView({ type: "mobility" })}
            onGoEnergy={() => setView({ type: "energy" })}
          />
        );
      case "bookingsList":
        return <BookingsView bookings={bookings} />;
      case "rooms":
        return <RoomListView onBack={goHome} onSelectRoom={(id) => setView({ type: "roomDetail", roomId: id })} />;
      case "roomDetail":
        return <RoomDetailView roomId={view.roomId} onBack={() => setView({ type: "rooms" })} onBook={() => setView({ type: "bookingConfirm", roomId: view.roomId })} />;
      case "bookingConfirm":
        return <BookingConfirmView roomId={view.roomId} onBack={() => setView({ type: "roomDetail", roomId: view.roomId })} onConfirm={() => handleBookingSuccess(view.roomId)} />;
      case "bookingSuccess":
        return <BookingSuccessView roomId={view.roomId} onBack={goHome} />;
      case "mobility":
        return <ParkingMobilityView onBack={goHome} />;
      case "energy":
        return <EnergySharingView onBack={goHome} />;
      case "account":
        return <AccountView onGovernanceLogin={handleGovernanceLogin} />;
      case "feedback":
        return <CommunityFeedbackView />;
      case "governance":
        return <GovernanceDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background pb-20">
      <TopBar onHomeClick={() => setMenuOpen(true)} showMenu={view.type !== "home"} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={handleMenuNavigate} />

      <AnimatePresence mode="wait">
        {view.type === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5 pt-2"
          >
            <div className="mb-5">
              <h1 className="font-display text-xl font-extrabold text-accent leading-tight">
                {t("welcome")}
              </h1>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                onFocus={() => { setView({ type: "search" }); setBottomTab("search"); }}
              />
            </div>

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
