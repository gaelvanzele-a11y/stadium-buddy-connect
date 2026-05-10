import { useState } from "react";
import { CalendarDays, Clock, MapPin, Car, Ticket, CreditCard, Briefcase, Bike, Users, X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBookings, type BookingKind, type Booking } from "@/contexts/BookingsContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface BookingsViewProps {
  onReserveCar?: () => void;
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

const BookingsView = ({}: BookingsViewProps) => {
  const { t } = useLanguage();
  const { bookings, cancelBooking, minutesUntilStart } = useBookings();
  const [pendingCancel, setPendingCancel] = useState<Booking | null>(null);

  const upcoming = bookings.filter((b) => b.kind !== "topup" && b.kind !== "ticket" && !(b.kind === "carpool" && b.offeredByUser));
  const offeredRides = bookings.filter((b) => b.kind === "carpool" && b.offeredByUser);
  const tickets = bookings.filter((b) => b.kind === "ticket");

  const isLateCancel = (b: Booking) => {
    const mins = minutesUntilStart(b);
    return mins !== null && mins < 60 && mins > -60;
  };

  const handleConfirmCancel = () => {
    if (!pendingCancel) return;
    const late = cancelBooking(pendingCancel.id);
    if (late) toast.error(t("cancellationLate"));
    else toast.success(t("cancellationFree"));
    setPendingCancel(null);
  };

  const renderCancelButton = (b: Booking) => (
    <button
      onClick={() => setPendingCancel(b)}
      className="mt-2 inline-flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-1 text-[11px] font-semibold text-destructive transition-colors hover:bg-destructive/10"
    >
      <X className="h-3 w-3" />
      {b.kind === "carpool" && b.offeredByUser ? t("cancelRide") : t("cancelBooking")}
    </button>
  );

  const renderBookingCard = (b: Booking, i: number) => {
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
            {renderCancelButton(b)}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="px-5 pb-24 pt-6">
      <h2 className="mb-5 font-display text-lg font-extrabold text-accent uppercase">
        {t("bookings")}
      </h2>

      {upcoming.length === 0 && offeredRides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-display text-sm font-bold text-muted-foreground">{t("noBookings")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("noBookingsDesc")}</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t("upcomingBookings")}
              </p>
              <div className="space-y-3">
                {upcoming.map((b, i) => renderBookingCard(b, i))}
              </div>
            </>
          )}

          {offeredRides.length > 0 && (
            <div className="mt-7">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t("myOfferedRides")}
              </p>
              <div className="space-y-3">
                {offeredRides.map((b, i) => renderBookingCard(b, i))}
              </div>
            </div>
          )}
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

      <AlertDialog open={pendingCancel !== null} onOpenChange={(o) => !o && setPendingCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("cancelConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingCancel && isLateCancel(pendingCancel) ? t("cancelLateDesc") : t("cancelFreeDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("keepBooking")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("confirmCancel")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingsView;
