import { ArrowLeft, Calendar, Clock, CreditCard, UserPlus, X, Mail } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { rooms } from "@/data/rooms";

interface BookingConfirmViewProps {
  roomId: string;
  date: Date;
  startTime: string;
  endTime: string;
  onBack: () => void;
  onConfirm: () => void;
}

const BookingConfirmView = ({ roomId, date, startTime, endTime, onBack, onConfirm }: BookingConfirmViewProps) => {
  const { t, lang } = useLanguage();
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitees, setInvitees] = useState<string[]>([]);
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return null;

  const toMin = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  const hours = Math.max(1, (toMin(endTime) - toMin(startTime)) / 60);
  const dateLabel = format(date, lang === "nl" ? "d MMM yyyy" : "MMM d, yyyy");

  const addInvitee = () => {
    const email = inviteEmail.trim();
    if (!email || invitees.includes(email)) return;
    setInvitees((prev) => [...prev, email]);
    setInviteEmail("");
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="px-5 pb-24 pt-6">
      <button onClick={onBack} className="mb-4 text-muted-foreground" aria-label="Back">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h2 className="mb-5 font-display text-lg font-extrabold text-accent">
        {t("bookingConfirm")}
      </h2>

      {/* Booking summary */}
      <div className="mb-5 rounded-xl border border-border bg-card p-4 card-shadow">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{dateLabel}, {startTime}-{endTime}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{hours} {t("hours")} - €{room.pricePerHour * hours}</span>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-border bg-card p-4 card-shadow">
        <div className="mb-2 flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">{t("inviteToSession")}</p>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">{t("inviteToSessionDesc")}</p>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInvitee(); } }}
              placeholder={t("inviteEmailPlaceholder")}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="button"
            onClick={addInvitee}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            {t("addInvitee")}
          </button>
        </div>

        {invitees.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {invitees.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-foreground"
              >
                {email}
                <button
                  onClick={() => setInvitees((prev) => prev.filter((e) => e !== email))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Remove ${email}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <span className="self-center text-[11px] text-muted-foreground">
              · {invitees.length} {t("inviteesAdded")}
            </span>
          </div>
        )}
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
        onClick={handleConfirm}
        className="w-full rounded-xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground"
      >
        {t("payAndBook")}
      </button>
    </div>
  );
};

export default BookingConfirmView;
