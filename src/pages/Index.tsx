import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, Briefcase, Bike, Leaf, Ticket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBookings, type Booking } from "@/contexts/BookingsContext";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import MenuOverlay from "@/components/MenuOverlay";
import RoomListView from "@/components/RoomListView";
import RoomDetailView from "@/components/RoomDetailView";
import BookingConfirmView from "@/components/BookingConfirmView";
import BookingSuccessView from "@/components/BookingSuccessView";
import ParkingMobilityView from "@/components/ParkingMobilityView";
import EnergySharingView from "@/components/EnergySharingView";
import SearchView from "@/components/SearchView";
import BookingsView from "@/components/BookingsView";
import CommunityFeedbackView from "@/components/CommunityFeedbackView";
import GovernanceDashboard from "@/components/GovernanceDashboard";
import ChatbotWidget from "@/components/ChatbotWidget";
import LoginGate from "@/components/LoginGate";
import TicketshopView from "@/components/TicketshopView";
import LanguageToggle from "@/components/LanguageToggle";
import { LogOut } from "lucide-react";
import { rooms } from "@/data/rooms";
import { format } from "date-fns";

export type AppView =
  | { type: "home" }
  | { type: "search" }
  | { type: "bookingsList" }
  | { type: "rooms" }
  | { type: "roomDetail"; roomId: string; date: Date; time: string }
  | { type: "bookingConfirm"; roomId: string; date: Date; time: string }
  | { type: "bookingSuccess"; roomId: string; date: Date; time: string }
  | { type: "mobility" }
  | { type: "energy" }
  | { type: "feedback" }
  | { type: "governance" }
  | { type: "ticketshop" };

const Index = () => {
  const { t, lang } = useLanguage();
  const { addBooking, reset } = useBookings();
  const [authedUser, setAuthedUser] = useState<{ name: string; isManager: boolean } | null>(null);
  const [view, setView] = useState<AppView>({ type: "home" });
  const [bottomTab, setBottomTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const goHome = () => {
    setView({ type: "home" });
    setBottomTab("home");
  };

  const goToBookingsList = () => {
    setView({ type: "bookingsList" });
    setBottomTab("bookings");
  };

  const goToMobility = () => {
    setView({ type: "mobility" });
    setBottomTab("");
  };

  const handleBottomTab = (tab: string) => {
    setBottomTab(tab);
    if (tab === "home") setView({ type: "home" });
    if (tab === "search") setView({ type: "search" });
    if (tab === "bookings") setView({ type: "bookingsList" });
    if (tab === "feedback") setView({ type: "feedback" });
    if (tab === "ticketshop") setView({ type: "ticketshop" });
  };

  const handleMenuNavigate = (target: string) => {
    if (target === "home") { goHome(); return; }
    if (target === "rooms") { setView({ type: "rooms" }); setBottomTab(""); return; }
    if (target === "mobility") { setView({ type: "mobility" }); setBottomTab(""); return; }
    if (target === "energy") { setView({ type: "energy" }); setBottomTab(""); return; }
    if (target === "feedback") { setView({ type: "feedback" }); setBottomTab("feedback"); return; }
    if (target === "ticketshop") { setView({ type: "ticketshop" }); setBottomTab("ticketshop"); return; }
  };

  const handleLogout = () => {
    setAuthedUser(null);
    setView({ type: "home" });
    setBottomTab("home");
    reset();
  };

  const handleBookingSuccess = (roomId: string, date: Date, time: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      const [hh, mm] = time.split(":").map(Number);
      const endTime = `${String((hh + 2) % 24).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
      const dateISO = format(date, "yyyy-MM-dd");
      const newBooking: Booking = {
        id: Date.now().toString(),
        kind: "room",
        roomName: room.name,
        date: format(date, lang === "nl" ? "d MMM yyyy" : "MMM d, yyyy"),
        dateISO,
        time: `${time} - ${endTime}`,
        startTime: time,
        roomId,
        location: t("stadiumEntrance"),
      };
      addBooking(newBooking);
    }
    setView({ type: "bookingSuccess", roomId, date, time });
  };

  const defaultDate = new Date();
  const defaultTime = "14:00";

  const categories = [
    { id: "workspaces", label: t("workspaces"), icon: Briefcase, bgClass: "bg-accent", action: () => setView({ type: "rooms" }) },
    { id: "mobility", label: t("sharedMobility"), icon: Bike, bgClass: "bg-mobility-blue", action: () => setView({ type: "mobility" }) },
    { id: "energy", label: t("neighborhoodEnergy"), icon: Leaf, bgClass: "bg-energy-leaf", action: () => setView({ type: "energy" }) },
    { id: "ticketshop", label: t("ticketshop"), icon: Ticket, bgClass: "bg-primary", action: () => { setView({ type: "ticketshop" }); setBottomTab("ticketshop"); } },
  ];

  const renderView = () => {
    switch (view.type) {
      case "search":
        return (
          <SearchView
            onSelectRoom={(id) => setView({ type: "roomDetail", roomId: id, date: defaultDate, time: defaultTime })}
            onGoMobility={() => setView({ type: "mobility" })}
            onGoEnergy={() => setView({ type: "energy" })}
          />
        );
      case "bookingsList":
        return <BookingsView onReserveCar={goToMobility} />;
      case "rooms":
        return (
          <RoomListView
            onBack={goHome}
            onSelectRoom={(id, date, time) => setView({ type: "roomDetail", roomId: id, date, time })}
          />
        );
      case "roomDetail":
        return (
          <RoomDetailView
            roomId={view.roomId}
            onBack={() => setView({ type: "rooms" })}
            onBook={() => setView({ type: "bookingConfirm", roomId: view.roomId, date: view.date, time: view.time })}
          />
        );
      case "bookingConfirm":
        return (
          <BookingConfirmView
            roomId={view.roomId}
            date={view.date}
            time={view.time}
            onBack={() => setView({ type: "roomDetail", roomId: view.roomId, date: view.date, time: view.time })}
            onConfirm={() => handleBookingSuccess(view.roomId, view.date, view.time)}
          />
        );
      case "bookingSuccess":
        return <BookingSuccessView roomId={view.roomId} date={view.date} time={view.time} onBack={goHome} />;
      case "mobility":
        return <ParkingMobilityView onBack={goHome} onViewBookings={goToBookingsList} />;
      case "energy":
        return <EnergySharingView onBack={goHome} />;
      case "feedback":
        return <CommunityFeedbackView />;
      case "governance":
        return <GovernanceDashboard />;
      case "ticketshop":
        return <TicketshopView onBack={goHome} />;
      default:
        return null;
    }
  };

  if (!authedUser) {
    return (
      <LoginGate
        onLogin={(name, isManager) => {
          setAuthedUser({ name, isManager });
          if (isManager) setView({ type: "governance" });
          else setView({ type: "home" });
        }}
      />
    );
  }

  if (authedUser.isManager) {
    return (
      <div className="mx-auto min-h-screen max-w-lg bg-background pb-10">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <LanguageToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-destructive transition-colors hover:bg-muted"
            aria-label={t("logout")}
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
        <GovernanceDashboard />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background pb-20">
      <TopBar onHomeClick={() => setMenuOpen(true)} showMenu={view.type !== "home"} />
      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleMenuNavigate}
        onLogout={handleLogout}
        userName={authedUser.name}
      />

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

      <ChatbotWidget />
      <BottomNav activeTab={bottomTab} onTabChange={handleBottomTab} isManager={authedUser.isManager} />
    </div>
  );
};

export default Index;
