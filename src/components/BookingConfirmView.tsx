import { ArrowLeft, Calendar, Clock, CreditCard } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { rooms } from "@/data/rooms";

interface BookingConfirmViewProps {
  roomId: string;
  onBack: () => void;
  onConfirm: () => void;
}

const BookingConfirmView = ({ roomId, onBack, onConfirm }: BookingConfirmViewProps) => {
  const { t } = useLanguage();
  const [addMobility, setAddMobility] = useState(false);
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return null;

  return (
    <div className="px-5 pb-24 pt-6">
      <button onClick={onBack} className="mb-4 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h2 className="mb-5 font-display text-lg font-extrabold text-accent">
        {t("bookingConfirm")}
      </h2>

      {/* Booking summary */}
      <div className="mb-5 rounded-xl border border-border bg-card p-4 card-shadow">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">15 Oct, 14:00-16:00</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">2 {t("hours")} - €{room.pricePerHour * 2}</span>
        </div>
      </div>

      {/* Mobility toggle */}
      <div className="mb-5 rounded-xl border border-border bg-card p-4 card-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{t("addMobility")}</p>
            <p className="text-xs text-muted-foreground">{t("addMobilityDesc")}</p>
          </div>
          <button
            onClick={() => setAddMobility(!addMobility)}
            className={`relative h-7 w-12 rounded-full transition-colors ${addMobility ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform ${addMobility ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Payment methods */}
      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-foreground">{t("paymentMethod")}</p>
        <div className="flex gap-3">
          {["iDEAL", "Bancontact", "CC"].map((method) => (
            <button
              key={method}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-3 text-xs font-medium text-foreground transition-colors hover:border-primary"
            >
              <CreditCard className="h-4 w-4" />
              {method}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onConfirm}
        className="w-full rounded-xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground"
      >
        {t("payAndBook")}
      </button>
    </div>
  );
};

export default BookingConfirmView;
