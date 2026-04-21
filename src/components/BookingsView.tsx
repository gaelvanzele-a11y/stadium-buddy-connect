import { CalendarDays, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Booking {
  id: string;
  roomName: string;
  date: string;
  time: string;
  location: string;
}

interface BookingsViewProps {
  bookings: Booking[];
}

const BookingsView = ({ bookings }: BookingsViewProps) => {
  const { t } = useLanguage();

  return (
    <div className="px-5 pb-24 pt-6">
      <h2 className="mb-5 font-display text-lg font-extrabold text-accent uppercase">
        {t("bookings")}
      </h2>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-display text-sm font-bold text-muted-foreground">{t("noBookings")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("noBookingsDesc")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl bg-card p-4 card-shadow"
            >
              <h3 className="font-display text-sm font-bold text-foreground">{b.roomName}</h3>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> {b.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {b.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {b.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsView;
