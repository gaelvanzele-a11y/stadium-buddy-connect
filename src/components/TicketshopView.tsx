import { useMemo, useState } from "react";
import { ArrowLeft, Ticket, CreditCard, CheckCircle2, History, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBookings, type Booking } from "@/contexts/BookingsContext";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface TicketshopViewProps {
  onBack: () => void;
}

interface SportEvent {
  id: string;
  sportKey: "football" | "hockey";
  matchKey: string;
  date: string;
  basePrice: number;
}

const events: SportEvent[] = [
  { id: "fb1", sportKey: "football", matchKey: "matchFootball1", date: "26 Apr 2026 · 20:00", basePrice: 18 },
  { id: "fb2", sportKey: "football", matchKey: "matchFootball2", date: "03 May 2026 · 14:30", basePrice: 18 },
  { id: "hk1", sportKey: "hockey", matchKey: "matchHockey1", date: "28 Apr 2026 · 19:00", basePrice: 12 },
  { id: "hk2", sportKey: "hockey", matchKey: "matchHockey2", date: "05 May 2026 · 15:00", basePrice: 12 },
];

const topUpOptions = [10, 20, 50, 100];

// Stadium layout with price tiers per section
const sections = [
  { id: "A", tierKey: "sectionPremium", multiplier: 1.6 },
  { id: "B", tierKey: "sectionStandard", multiplier: 1.2 },
  { id: "C", tierKey: "sectionStandard", multiplier: 1.0 },
  { id: "D", tierKey: "sectionEconomy", multiplier: 0.75 },
];
const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
const seatsPerRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

interface SeatSelection {
  section: string;
  row: string;
  seat: string;
}

interface PendingPayment {
  type: "ticket" | "topup";
  label: string;
  amount: number;
  meta?: Record<string, string>;
  build: () => Booking;
}

const computePrice = (base: number, sectionId: string, seatId: string) => {
  const sec = sections.find((s) => s.id === sectionId);
  const seatNum = parseInt(seatId, 10) || 0;
  const seatBoost = seatNum <= 3 ? 1.15 : seatNum >= 8 ? 0.95 : 1; // front seats premium
  return Math.round(base * (sec?.multiplier ?? 1) * seatBoost);
};

const TicketshopView = ({ onBack }: TicketshopViewProps) => {
  const { t, lang } = useLanguage();
  const { bookings, cardBalance, addBooking, topUpCard } = useBookings();
  const [tab, setTab] = useState<"tickets" | "card">("tickets");
  const [sportFilter, setSportFilter] = useState<"all" | "football" | "hockey">("all");
  const [selections, setSelections] = useState<Record<string, SeatSelection>>({});
  const [topUp, setTopUp] = useState<number>(20);
  const [isCustomTopUp, setIsCustomTopUp] = useState(false);
  const [customTopUp, setCustomTopUp] = useState<string>("");
  const [pending, setPending] = useState<PendingPayment | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const filteredEvents = events.filter(
    (e) => sportFilter === "all" || e.sportKey === sportFilter
  );

  const transactions = useMemo(
    () => bookings.filter((b) => b.kind === "ticket" || b.kind === "topup"),
    [bookings]
  );

  const updateSelection = (eventId: string, field: keyof SeatSelection, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [eventId]: {
        section: prev[eventId]?.section || "",
        row: prev[eventId]?.row || "",
        seat: prev[eventId]?.seat || "",
        [field]: value,
      },
    }));
  };

  const initiateTicket = (event: SportEvent) => {
    const sel = selections[event.id];
    if (!sel?.section || !sel?.row || !sel?.seat) return;
    const price = computePrice(event.basePrice, sel.section, sel.seat);
    setPending({
      type: "ticket",
      label: `${t(event.matchKey as never)} — ${t("section")} ${sel.section}, ${t("row")} ${sel.row}, ${t("seat")} ${sel.seat}`,
      amount: price,
      build: () => ({
        id: `tk-${Date.now()}`,
        kind: "ticket",
        roomName: t(event.matchKey as never),
        date: event.date,
        time: "",
        location: t("ticketshop"),
        matchKey: event.matchKey,
        section: sel.section,
        row: sel.row,
        seat: sel.seat,
        price,
        sportKey: event.sportKey,
      }),
    });
  };

  const initiateTopUp = () => {
    setPending({
      type: "topup",
      label: `${t("clubConsumptionCard")} — €${topUp}`,
      amount: topUp,
      build: () => topUpCard(topUp), // produces the booking via context
    });
  };

  const completePayment = () => {
    if (!pending) return;
    if (pending.type === "ticket") {
      const booking = pending.build();
      addBooking(booking);
      setSelections((prev) => {
        const copy = { ...prev };
        Object.keys(copy).forEach((k) => {
          if (copy[k].section && copy[k].row && copy[k].seat) delete copy[k];
        });
        return copy;
      });
    } else {
      pending.build(); // topUpCard already adds booking
    }
    setConfirmation(pending.label);
    setPending(null);
  };

  return (
    <div className="px-5 pb-24 pt-6">
      <button onClick={onBack} className="mb-4 text-muted-foreground" aria-label="Back">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Ticket className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-extrabold text-accent leading-tight">
            {t("ticketshopMenu")}
          </h2>
          <p className="text-[11px] text-muted-foreground">{t("ticketshopSubtitle")}</p>
        </div>
      </div>

      <div className="mt-5 flex gap-1 rounded-xl bg-secondary p-1">
        {([
          { id: "tickets" as const, label: t("buyTickets") },
          { id: "card" as const, label: t("consumptionCard") },
        ]).map((it) => (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className={`flex-1 rounded-lg py-2 text-[11px] font-semibold transition-colors ${
              tab === it.id ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>

      {tab === "tickets" && (
        <div className="mt-5">
          <div className="mb-4 flex gap-2">
            {(["all", "football", "hockey"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSportFilter(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  sportFilter === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {t(s === "all" ? "allSports" : s === "football" ? "football" : "hockey")}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredEvents.map((event, i) => {
              const sel = selections[event.id] || { section: "", row: "", seat: "" };
              const ready = sel.section && sel.row && sel.seat;
              const livePrice = ready
                ? computePrice(event.basePrice, sel.section, sel.seat)
                : event.basePrice;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl bg-card p-4 card-shadow"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                        {t(event.sportKey)}
                      </span>
                      <h3 className="mt-1.5 font-display text-sm font-bold text-foreground">
                        {t(event.matchKey as never)}
                      </h3>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-sm font-extrabold text-foreground">
                        €{livePrice}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {t("pricePerSeat")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 rounded-lg border border-border bg-background p-3">
                    <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                      {t("selectSeat")}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <SelectGroup
                        label={t("section")}
                        options={sections.map((s) => `${s.id} (${t(s.tierKey as never)})`)}
                        rawOptions={sections.map((s) => s.id)}
                        value={sel.section}
                        onChange={(v) => updateSelection(event.id, "section", v)}
                      />
                      <SelectGroup
                        label={t("row")}
                        options={rows}
                        rawOptions={rows}
                        value={sel.row}
                        onChange={(v) => updateSelection(event.id, "row", v)}
                      />
                      <SelectGroup
                        label={t("seat")}
                        options={seatsPerRow}
                        rawOptions={seatsPerRow}
                        value={sel.seat}
                        onChange={(v) => updateSelection(event.id, "seat", v)}
                      />
                    </div>
                    {ready && (
                      <p className="text-[11px] text-primary">
                        {t("selectedSeat")}: {t("section")} {sel.section}, {t("row")} {sel.row}, {t("seat")} {sel.seat}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => initiateTicket(event)}
                    disabled={!ready}
                    className="mt-3 w-full rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground disabled:opacity-40"
                  >
                    {ready ? `${t("confirmAndPay")} €${livePrice}` : t("pickSeatFirst")}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "card" && (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-5 text-primary-foreground card-shadow">
            <div className="flex items-center gap-2 text-xs uppercase opacity-90">
              <CreditCard className="h-3.5 w-3.5" />
              {t("clubConsumptionCard")}
            </div>
            <p className="mt-3 font-display text-2xl font-extrabold">
              €{cardBalance.toFixed(2).replace(".", lang === "nl" ? "," : ".")}
            </p>
            <p className="mt-1 text-xs opacity-90">{t("currentBalance")}</p>
            <p className="mt-3 text-[11px] opacity-90">{t("validForAllSports")}</p>
          </div>

          <div className="rounded-xl bg-card p-4 card-shadow">
            <p className="mb-3 font-display text-sm font-bold text-foreground">{t("topUpAmount")}</p>
            <div className="grid grid-cols-4 gap-2">
              {topUpOptions.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUp(amt)}
                  className={`rounded-lg border py-3 text-sm font-bold transition-colors ${
                    topUp === amt
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  €{amt}
                </button>
              ))}
            </div>

            <button
              onClick={initiateTopUp}
              className="mt-4 w-full rounded-xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground"
            >
              {t("confirmAndPay")} €{topUp}
            </button>
          </div>

          {/* Transaction history (now under Consumption Card) */}
          <div className="rounded-xl bg-card p-4 card-shadow">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <History className="h-4 w-4 text-primary" />
              <p className="font-display text-sm font-bold">{t("transactionHistory")}</p>
            </div>
            {transactions.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">{t("noTransactions")}</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => {
                  // Determine signed amount: top-ups can be positive (credit) or negative (fee).
                  const rawAmount =
                    tx.kind === "topup" ? (tx.amount ?? 0) : -(tx.price ?? 0);
                  const isCredit = rawAmount > 0;
                  const isFee = tx.kind === "topup" && rawAmount < 0;
                  const label = isFee
                    ? t("lateCancelFee")
                    : tx.kind === "topup"
                      ? t("toppedUp")
                      : tx.roomName;
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isCredit ? "bg-energy-leaf/20" : "bg-destructive/10"
                        }`}>
                          {isCredit ? (
                            <Wallet className="h-4 w-4 text-energy-leaf" />
                          ) : isFee ? (
                            <Wallet className="h-4 w-4 text-destructive" />
                          ) : (
                            <Ticket className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{label}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {tx.date}{tx.section ? ` · ${t("section")} ${tx.section}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className={`font-display text-sm font-extrabold ${
                        isCredit ? "text-energy-leaf" : "text-destructive"
                      }`}>
                        {isCredit ? "+" : "-"}€{Math.abs(rawAmount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mandatory payment dialog */}
      <Dialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle className="font-display text-base font-extrabold text-accent">
            {t("paymentSummary")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {pending?.label}
          </DialogDescription>

          <div className="mt-2 rounded-xl border border-border bg-secondary/40 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("item")}</span>
              <span className="text-right text-foreground">{pending?.label}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="font-display text-sm font-bold text-foreground">{t("total")}</span>
              <span className="font-display text-lg font-extrabold text-accent">€{pending?.amount}</span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            {["iDEAL", "Bancontact", "CC"].map((m) => (
              <div
                key={m}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card py-2 text-[11px] font-medium text-foreground"
              >
                <CreditCard className="h-3.5 w-3.5" />
                {m}
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setPending(null)}
              className="flex-1 rounded-xl border border-border bg-card py-3 text-xs font-bold text-foreground"
            >
              {t("cancel")}
            </button>
            <button
              onClick={completePayment}
              className="flex-1 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground"
            >
              {t("payNow")} €{pending?.amount}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success */}
      <Dialog open={confirmation !== null} onOpenChange={(o) => !o && setConfirmation(null)}>
        <DialogContent className="max-w-sm rounded-2xl text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto -mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
          >
            <CheckCircle2 className="h-9 w-9 text-primary" />
          </motion.div>
          <DialogTitle className="text-center font-display text-lg font-extrabold text-accent">
            {t("purchaseConfirmed")}
          </DialogTitle>
          <DialogDescription className="text-center">{confirmation}</DialogDescription>
          <button
            onClick={() => setConfirmation(null)}
            className="mt-2 w-full rounded-xl bg-primary py-3 font-display text-sm font-bold text-primary-foreground"
          >
            {t("close")}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface SelectGroupProps {
  label: string;
  options: string[]; // display labels
  rawOptions: string[]; // values
  value: string;
  onChange: (v: string) => void;
}

const SelectGroup = ({ label, options, rawOptions, value, onChange }: SelectGroupProps) => (
  <div>
    <label className="mb-1 block text-[10px] font-semibold uppercase text-muted-foreground">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-border bg-card px-2 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      <option value="">—</option>
      {rawOptions.map((raw, i) => (
        <option key={raw} value={raw}>
          {options[i]}
        </option>
      ))}
    </select>
  </div>
);

export default TicketshopView;
