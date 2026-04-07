import { ArrowLeft, Car, Bike, Battery, Zap, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

const parkingZones = [
  { zone: "North Gate", total: 400, occupied: 312, evChargers: 12, evAvailable: 4 },
  { zone: "East Wing", total: 250, occupied: 98, evChargers: 8, evAvailable: 6 },
  { zone: "South Gate", total: 350, occupied: 340, evChargers: 10, evAvailable: 1 },
  { zone: "West VIP", total: 80, occupied: 22, evChargers: 6, evAvailable: 5 },
];

const bikes = [
  { id: "E-01", battery: 92, location: "North Gate", status: "available" as const },
  { id: "E-02", battery: 78, location: "East Wing", status: "available" as const },
  { id: "E-03", battery: 45, location: "South Gate", status: "in-use" as const },
  { id: "E-04", battery: 100, location: "West VIP", status: "available" as const },
  { id: "E-05", battery: 15, location: "North Gate", status: "charging" as const },
  { id: "E-06", battery: 63, location: "East Wing", status: "available" as const },
];

const ParkingMobilityView = ({ onBack }: { onBack: () => void }) => {
  const { t } = useLanguage();
  const totalSpaces = parkingZones.reduce((a, z) => a + z.total, 0);
  const totalOccupied = parkingZones.reduce((a, z) => a + z.occupied, 0);
  const totalFree = totalSpaces - totalOccupied;

  return (
    <div className="px-5 pb-24 pt-6">
      <button onClick={onBack} className="mb-4 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h2 className="mb-5 font-display text-lg font-extrabold text-accent uppercase">
        {t("sharedMobility")}
      </h2>

      {/* Summary */}
      <div className="mb-5 rounded-xl bg-card p-5 card-shadow">
        <p className="text-sm text-muted-foreground">{t("parkingSpaces")}</p>
        <p className="font-display text-4xl font-extrabold text-mobility-blue">{totalFree}</p>
        <Progress value={(totalOccupied / totalSpaces) * 100} className="mt-3 h-2 bg-secondary [&>div]:bg-mobility-blue" />
      </div>

      {/* Zones */}
      <div className="mb-6 space-y-3">
        {parkingZones.map((zone, i) => {
          const free = zone.total - zone.occupied;
          const pct = (zone.occupied / zone.total) * 100;
          return (
            <motion.div
              key={zone.zone}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl bg-card p-4 card-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-mobility-blue" />
                  <span className="font-display text-sm font-bold text-foreground">{zone.zone}</span>
                </div>
                <span className={`font-display text-lg font-extrabold ${free < 20 ? "text-destructive" : "text-primary"}`}>
                  {free}
                </span>
              </div>
              <Progress value={pct} className={`mt-2 h-1.5 bg-secondary ${pct > 90 ? "[&>div]:bg-destructive" : "[&>div]:bg-mobility-blue"}`} />
              <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Zap className="h-3 w-3" /> {zone.evAvailable}/{zone.evChargers} {t("evChargers")}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* E-Bikes */}
      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-foreground">
        <Bike className="h-4 w-4 text-primary" /> {t("eBikes")}
      </h3>
      <div className="space-y-2">
        {bikes.map((bike, i) => (
          <motion.div
            key={bike.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            className="flex items-center justify-between rounded-xl bg-card p-3 card-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <Bike className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Bike {bike.id}</p>
                <p className="text-[11px] text-muted-foreground">{bike.location}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-xs">
                <Battery className={`h-3 w-3 ${bike.battery < 30 ? "text-destructive" : "text-primary"}`} />
                <span className="text-muted-foreground">{bike.battery}%</span>
              </div>
              {bike.status === "available" ? (
                <button className="rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  {t("rent")}
                </button>
              ) : (
                <span className="text-[11px] text-muted-foreground capitalize">{bike.status}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ParkingMobilityView;
