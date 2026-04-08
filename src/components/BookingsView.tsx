import { useState } from "react";
import { CalendarDays, Clock, MapPin, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar } from "@/components/ui/calendar";

export interface Booking {
  id: string;
  roomName: string;
  date: string;
  time: string;
  location: string;
}

interface BookingsViewProps {
  bookings: Booking[];
  onBookSlot?: (date: Date, slot: string) => void;
}

const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
];

// Simulate some booked slots
const bookedSlots: Record<string, string[]> = {
  "2026-04-09": ["10:00 - 12:00", "14:00 - 16:00"],
  "2026-04-10": ["08:00 - 10:00", "12:00 - 14:00", "16:00 - 18:00"],
  "2026-04-11": ["14:00 - 16:00"],
  "2026-04-15": ["10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00"],
};

const BookingsView = ({ bookings, onBookSlot }: BookingsViewProps) => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const dateKey = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "";

  const bookedForDate = bookedSlots[dateKey] || [];

  return (
    <div className="px-5 pb-24 pt-6">
      <h2 className="mb-5 font-display text-lg font-extrabold text-accent uppercase">
        {t("bookings")}
      </h2>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 rounded-xl bg-card p-4 card-shadow"
      >
        <h3 className="mb-3 font-display text-sm font-bold text-foreground">
          {t("calendarTitle")}
        </h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="pointer-events-auto mx-auto"
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </motion.div>

      {/* Time slots for selected date */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-xl bg-card p-4 card-shadow"
        >
          <h3 className="mb-3 font-display text-sm font-bold text-foreground">
            {selectedDate.toLocaleDateString("nl-BE", { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          <div className="space-y-2">
            {timeSlots.map((slot) => {
              const isBooked = bookedForDate.includes(slot);
              return (
                <div
                  key={slot}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{slot}</span>
                  </div>
                  {isBooked ? (
                    <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive">
                      <X className="h-3 w-3" />
                      {t("booked")}
                    </span>
                  ) : (
                    <button
                      onClick={() => onBookSlot?.(selectedDate, slot)}
                      className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <Check className="h-3 w-3" />
                      {t("available")}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {!selectedDate && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-display text-sm font-bold text-muted-foreground">{t("noBookings")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("noBookingsDesc")}</p>
        </div>
      )}

      {/* Existing bookings */}
      {bookings.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display text-sm font-bold text-foreground">{t("bookings")}</h3>
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
