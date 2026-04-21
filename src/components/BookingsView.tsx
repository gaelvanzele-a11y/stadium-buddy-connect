import { CalendarDays, Clock, MapPin, Car, Ticket, CreditCard, Briefcase, Bike, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBookings, type BookingKind } from "@/contexts/BookingsContext";

interface BookingsViewProps {
  onReserveCar: () => void;
}

const iconForKind = (kind: BookingKind) => {
  switch (kind) {
    case "room": return Briefcase;
    case "bike": return Bike;
    case "car": return Car;
    case "carpool": return Users;
    case "ticket": return Ticket;
    case "topup": return CreditCard;
  }
};

const BookingsView = ({ onReserveCar }: BookingsViewProps) => {
  const { t } = useLanguage();
  const { bookings } = useBookings();

  const upcoming = bookings.filter((b) => b.kind !== "topup");
  const tickets = bookings.filter((b) => b.kind === "ticket");

  return (
    <div className="px-5 pb-24 pt-6">
      <h2 className="mb-5 font-display text-lg font-extrabold text-accent uppercase">
        {t("bookings")}
      </h2>

      {/* Quick action: shared car */}
      <button
        onClick={onReserveCar}
        className="mb-5 flex w-full items-center justify-between rounded-xl bg-card p-4 card-shadow transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mobility-blue">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="font-display text-sm font-bold text-foreground">{t("reserveSharedCar")}</p>
            <p className="text-[11px] text-muted-foreground">{t("reserveSharedCarDesc")}</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-primary">{t("open")}</span>
      </button>

      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-display text-sm font-bold text-muted-foreground">{t("noBookings")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("noBookingsDesc")}</p>
        </div>
      ) : (
        <>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("upcomingBookings")}
          </p>
          <div className="space-y-3">
            {upcoming.map((b, i) => {
              const Icon = iconForKind(b.kind);
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl bg-card p-4 card-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-sm font-bold text-foreground">{b.roomName}</h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" /> {b.date}
                        </span>
                        {b.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {b.time}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {b.location}
                        </span>
                      </div>
                      {b.section && (
                        <p className="mt-1 text-[11px] text-primary">
                          {t("section")} {b.section} · {t("row")} {b.row} · {t("seat")} {b.seat}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {tickets.length > 0 && (
        <div className="mt-7">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("myTickets")}
          </p>
          <div className="space-y-2">
            {tickets.map((tk) => (
              <div key={tk.id} className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                <div>
                  <p className="text-xs font-bold text-foreground">{tk.roomName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {tk.date} · {t("section")} {tk.section} · {t("row")} {tk.row} · {t("seat")} {tk.seat}
                  </p>
                </div>
                <span className="font-display text-xs font-extrabold text-foreground">€{tk.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsView;
