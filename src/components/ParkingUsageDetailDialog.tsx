import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Car, Zap, Accessibility, Clock, MapPin } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const ParkingUsageDetailDialog = ({ open, onOpenChange }: Props) => {
  const { lang, t } = useLanguage();
  const nl = lang === "nl";

  // Match the user-facing zones in ParkingMobilityView
  const zones = [
    { key: "northGate" as const, total: 400, occupied: 312 },
    { key: "eastWing" as const, total: 250, occupied: 98 },
    { key: "southGate" as const, total: 350, occupied: 340 },
    { key: "westVIP" as const, total: 80, occupied: 22 },
  ];

  const total = zones.reduce((a, z) => a + z.total, 0);
  const occupied = zones.reduce((a, z) => a + z.occupied, 0);
  const free = total - occupied;
  const pct = Math.round((occupied / total) * 100);

  const donutData = [
    { name: nl ? "Bezet" : "Occupied", value: occupied, color: "hsl(var(--primary))" },
    { name: nl ? "Vrij" : "Free", value: free, color: "hsl(var(--secondary))" },
  ];

  const breakdown = [
    {
      label: nl ? "Standaard plaatsen" : "Standard spots",
      icon: Car,
      occupied: Math.round(occupied * 0.82),
      total: Math.round(total * 0.85),
      color: "text-primary",
    },
    {
      label: nl ? "EV-laadplaatsen" : "EV charging spots",
      icon: Zap,
      occupied: Math.round(occupied * 0.12),
      total: Math.round(total * 0.10),
      color: "text-energy-leaf",
    },
    {
      label: nl ? "Mindervaliden" : "Disabled spots",
      icon: Accessibility,
      occupied: Math.round(occupied * 0.06),
      total: Math.round(total * 0.05),
      color: "text-accent",
    },
  ];

  const hourly = [
    { h: "08", v: 45 },
    { h: "10", v: 120 },
    { h: "12", v: 190 },
    { h: "14", v: 230 },
    { h: "16", v: 260 },
    { h: "18", v: 210 },
    { h: "20", v: 140 },
    { h: "22", v: 70 },
  ];

  const reservations = [
    { time: "14:30", name: nl ? "Vergadering Loge A" : "Meeting Lounge A", spots: 8 },
    { time: "15:00", name: nl ? "Event hoofdtribune" : "Main stand event", spots: 24 },
    { time: "16:15", name: nl ? "Training jeugdteam" : "Youth team training", spots: 12 },
    { time: "17:45", name: nl ? "VIP-gasten" : "VIP guests", spots: 6 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold uppercase text-accent">
            {nl ? "Parkeergebruik – Detail" : "Parking Usage – Details"}
          </DialogTitle>
          <DialogDescription>
            {nl
              ? "Realtime overzicht van bezetting, types en reserveringen."
              : "Real-time overview of occupancy, types and reservations."}
          </DialogDescription>
        </DialogHeader>

        {/* Donut */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-card p-4 card-shadow">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {nl ? "Huidige bezetting" : "Current occupancy"}
            </p>
            <div className="relative h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {donutData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-extrabold text-foreground">{pct}%</span>
                <span className="text-[11px] text-muted-foreground">
                  {occupied}/{total}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-xl bg-card p-4 card-shadow">
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              {nl ? "Per type" : "By type"}
            </p>
            <div className="space-y-3">
              {breakdown.map((b) => {
                const p = Math.round((b.occupied / b.total) * 100);
                return (
                  <div key={b.label}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <b.icon className={`h-3.5 w-3.5 ${b.color}`} />
                        <span className="text-xs text-foreground">{b.label}</span>
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {b.occupied}/{b.total}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Per zone */}
        <div className="rounded-xl bg-card p-4 card-shadow">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {nl ? "Per zone" : "By zone"}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {zones.map((z) => {
              const p = Math.round((z.occupied / z.total) * 100);
              const almostFull = p >= 90;
              return (
                <div key={z.key} className="rounded-lg bg-secondary/40 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{t(z.key)}</span>
                    <span className={`text-[11px] font-bold ${almostFull ? "text-destructive" : "text-primary"}`}>
                      {p}%
                    </span>
                  </div>
                  <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full ${almostFull ? "bg-destructive" : "bg-primary"}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {z.occupied}/{z.total} {nl ? "plaatsen bezet" : "spots occupied"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trend */}
        <div className="rounded-xl bg-card p-4 card-shadow">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {nl ? "Bezetting vandaag (piekuren)" : "Occupancy today (peak hours)"}
          </p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="h" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming */}
        <div className="rounded-xl bg-card p-4 card-shadow">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {nl ? "Komende reserveringen" : "Upcoming reservations"}
          </p>
          <div className="space-y-2">
            {reservations.map((r) => (
              <div
                key={r.time}
                className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-primary">{r.time}</span>
                  <span className="text-sm text-foreground">{r.name}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {r.spots} {nl ? "plaatsen" : "spots"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParkingUsageDetailDialog;
