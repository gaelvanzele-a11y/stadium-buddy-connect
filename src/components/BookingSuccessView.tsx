import { CheckCircle2, Calendar, Clock, QrCode, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { rooms } from "@/data/rooms";

interface BookingSuccessViewProps {
  roomId: string;
  date: Date;
  startTime: string;
  endTime: string;
  onBack: () => void;
}

const BookingSuccessView = ({ roomId, date, startTime, endTime, onBack }: BookingSuccessViewProps) => {
  const { t, lang } = useLanguage();
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return null;

  const toMin = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  const hours = Math.max(1, (toMin(endTime) - toMin(startTime)) / 60);
  const dateLabel = format(date, lang === "nl" ? "d MMM yyyy" : "MMM d, yyyy", { locale: lang === "nl" ? nl : enUS });

  const handleDirections = () => {
    window.open(
      "https://www.google.com/maps/dir/UHasselt+Building+D,+Agoralaan,+3590+Diepenbeek/Mijnstadion,+Beringen",
      "_blank"
    );
  };

  return (
    <div className="flex flex-col items-center px-5 pb-24 pt-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <CheckCircle2 className="h-16 w-16 text-primary" />
      </motion.div>

      <h2 className="mt-4 font-display text-lg font-extrabold text-accent">
        {t("bookingConfirmed")}
      </h2>

      <div className="mt-4 w-full rounded-xl border border-border bg-card p-4 card-shadow text-left">
        <div className="flex items-center gap-3 mb-1">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{dateLabel}, {startTime}-{endTime}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{hours} {t("hours")} - €{room.pricePerHour * hours}</span>
        </div>
      </div>

      {/* Digital Key / QR */}
      <div className="mt-5 w-full rounded-xl border border-border bg-card p-5 card-shadow">
        <p className="mb-1 font-display text-sm font-bold text-foreground">{t("digitalKey")}</p>
        <p className="mb-4 text-xs text-muted-foreground">{t("scanAtEntrance")}</p>
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary">
          <QrCode className="h-16 w-16 text-foreground" />
        </div>
      </div>

      <div className="mt-5 w-full space-y-3">
        <button
          onClick={handleDirections}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 font-display text-sm font-bold text-foreground"
        >
          <Navigation className="h-4 w-4" />
          {t("routeDescription")}
        </button>
      </div>

      <button onClick={onBack} className="mt-4 text-sm text-primary font-medium">
        {t("backToHome")}
      </button>
    </div>
  );
};

export default BookingSuccessView;