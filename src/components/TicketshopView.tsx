import { useState } from "react";
import { ArrowLeft, Ticket, CreditCard, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface TicketshopViewProps {
  onBack: () => void;
}

interface SportEvent {
  id: string;
  sportKey: "football" | "hockey";
  matchKey: string;
  date: string;
  price: number;
}

const events: SportEvent[] = [
  { id: "fb1", sportKey: "football", matchKey: "matchFootball1", date: "26 Apr 2026 · 20:00", price: 18 },
  { id: "fb2", sportKey: "football", matchKey: "matchFootball2", date: "03 May 2026 · 14:30", price: 18 },
  { id: "hk1", sportKey: "hockey", matchKey: "matchHockey1", date: "28 Apr 2026 · 19:00", price: 12 },
  { id: "hk2", sportKey: "hockey", matchKey: "matchHockey2", date: "05 May 2026 · 15:00", price: 12 },
];

const topUpOptions = [10, 20, 50, 100];

// Stadium layout: sections, rows, seats per row
const sections = ["A", "B", "C", "D"];
const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
const seatsPerRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

interface SeatSelection {
  section: string;
  row: string;
  seat: string;
}

const TicketshopView = ({ onBack }: TicketshopViewProps) => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"tickets" | "card">("tickets");
  const [sportFilter, setSportFilter] = useState<"all" | "football" | "hockey">("all");
  const [selections, setSelections] = useState<Record<string, SeatSelection>>({});
  const [topUp, setTopUp] = useState<number>(20);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const filteredEvents = events.filter(
    (e) => sportFilter === "all" || e.sportKey === sportFilter
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

  const buyTicket = (event: SportEvent) => {
    const sel = selections[event.id];
    if (!sel || !sel.section || !sel.row || !sel.seat) return;
    setConfirmation(
      `${t(event.matchKey as never)} — ${t("section")} ${sel.section}, ${t("row")} ${sel.row}, ${t("seat")} ${sel.seat} — €${event.price}`
    );
    setSelections((prev) => {
      const copy = { ...prev };
      delete copy[event.id];
      return copy;
    });
  };

  const topUpCard = () => {
    setConfirmation(`${t("topUpConfirmed")}: €${topUp}`);
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
            {t("ticketshop")}
          </h2>
          <p className="text-[11px] text-muted-foreground">{t("ticketshopSubtitle")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-2 rounded-xl bg-secondary p-1">
        <button
          onClick={() => setTab("tickets")}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
            tab === "tickets" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
          }`}
        >
          {t("buyTickets")}
        </button>
        <button
          onClick={() => setTab("card")}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
            tab === "card" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
          }`}
        >
          {t("consumptionCard")}
        </button>
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
                    <p className="font-display text-sm font-extrabold text-foreground">
                      €{event.price}
                    </p>
                  </div>

                  {/* Seat selection */}
                  <div className="mt-3 space-y-2 rounded-lg border border-border bg-background p-3">
                    <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                      {t("selectSeat")}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <SelectGroup
                        label={t("section")}
                        options={sections}
                        value={sel.section}
                        onChange={(v) => updateSelection(event.id, "section", v)}
                      />
                      <SelectGroup
                        label={t("row")}
                        options={rows}
                        value={sel.row}
                        onChange={(v) => updateSelection(event.id, "row", v)}
                      />
                      <SelectGroup
                        label={t("seat")}
                        options={seatsPerRow}
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
                    onClick={() => buyTicket(event)}
                    disabled={!ready}
                    className="mt-3 w-full rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground disabled:opacity-40"
                  >
                    {ready ? t("buy") : t("pickSeatFirst")}
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
            <p className="mt-3 font-display text-2xl font-extrabold">€42,50</p>
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
              onClick={topUpCard}
              className="mt-4 w-full rounded-xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground"
            >
              {t("topUpNow")} €{topUp}
            </button>
          </div>
        </div>
      )}

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
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

const SelectGroup = ({ label, options, value, onChange }: SelectGroupProps) => (
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
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

export default TicketshopView;
