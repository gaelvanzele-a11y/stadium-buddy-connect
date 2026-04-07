import { ArrowLeft, Sun, Zap, Home, TrendingUp, Leaf, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

const EnergySharingView = ({ onBack }: { onBack: () => void }) => {
  const { t } = useLanguage();

  const neighbours = [
    { nameKey: "communityCenter" as const, distance: "0.3 km", allocation: 18, active: true },
    { nameKey: "localSchool" as const, distance: "0.5 km", allocation: 25, active: true },
    { nameKey: "residentialBlockA" as const, distance: "0.2 km", allocation: 30, active: true },
    { nameKey: "sportsClinic" as const, distance: "0.4 km", allocation: 12, active: false },
    { nameKey: "cafeDistrict" as const, distance: "0.6 km", allocation: 15, active: true },
  ];

  const solarOutput = 142;
  const solarCapacity = 200;
  const stadiumUsage = 38;
  const surplus = solarOutput - stadiumUsage;
  const sharedEnergy = neighbours.filter((n) => n.active).reduce((a, n) => a + n.allocation, 0);

  return (
    <div className="px-5 pb-24 pt-2">
      <button onClick={onBack} className="mb-4 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h2 className="mb-5 font-display text-lg font-extrabold text-accent uppercase">
        {t("neighborhoodEnergy")}
      </h2>

      <div className="mb-5 grid grid-cols-2 gap-3">
        {[
          { label: t("solarOutput"), value: `${solarOutput} kW`, pct: (solarOutput / solarCapacity) * 100, icon: Sun },
          { label: t("co2Saved"), value: "47.3 kg", pct: 47, icon: Leaf },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl bg-card p-4 card-shadow"
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <stat.icon className="h-3.5 w-3.5 text-energy-leaf" />
              <span className="text-[11px]">{stat.label}</span>
            </div>
            <p className="mt-1 font-display text-xl font-extrabold text-foreground">{stat.value}</p>
            <Progress value={stat.pct} className="mt-2 h-1.5 bg-secondary [&>div]:bg-energy-leaf" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-5 rounded-xl bg-energy-leaf/10 p-4"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-energy-leaf" />
          <div>
            <p className="text-sm font-bold text-foreground">{surplus} kW {t("surplus")}</p>
            <p className="text-xs text-muted-foreground">{t("noMatchToday")}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-energy-leaf" />
          <span className="text-xs font-semibold text-energy-leaf">{sharedEnergy} kW {t("sharedWithNeighbors")}</span>
        </div>
      </motion.div>

      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-foreground">
        <Home className="h-4 w-4 text-energy-leaf" /> {t("localNeighbours")}
      </h3>
      <div className="space-y-2">
        {neighbours.map((n, i) => (
          <motion.div
            key={n.nameKey}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center justify-between rounded-xl bg-card p-3 card-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${n.active ? "bg-energy-leaf" : "bg-muted-foreground"}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{t(n.nameKey)}</p>
                <p className="text-[11px] text-muted-foreground">{n.distance}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-bold text-energy-leaf">{n.allocation} kW</p>
                <p className="text-[11px] text-muted-foreground">{n.active ? t("receiving") : t("offline")}</p>
              </div>
              {n.active && <ArrowRight className="h-3.5 w-3.5 text-energy-leaf/50" />}
            </div>
          </motion.div>
        ))}
      </div>

      <button className="mt-5 w-full rounded-xl border border-energy-leaf/30 bg-card py-3 font-display text-sm font-bold text-energy-leaf">
        <Sun className="mr-2 inline-block h-4 w-4" />
        {t("manageEnergy")}
      </button>
    </div>
  );
};

export default EnergySharingView;
