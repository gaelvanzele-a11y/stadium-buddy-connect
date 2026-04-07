import { motion } from "framer-motion";
import { Sun, Zap, Home, TrendingUp, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const neighbours = [
  { name: "Community Center", distance: "0.3 km", allocation: 18, active: true },
  { name: "Local School", distance: "0.5 km", allocation: 25, active: true },
  { name: "Residential Block A", distance: "0.2 km", allocation: 30, active: true },
  { name: "Sports Clinic", distance: "0.4 km", allocation: 12, active: false },
  { name: "Café District", distance: "0.6 km", allocation: 15, active: true },
];

const EnergySharing = () => {
  const solarOutput = 142; // kW current
  const solarCapacity = 200; // kW max
  const stadiumUsage = 38; // kW (low — no match day)
  const surplus = solarOutput - stadiumUsage;
  const sharedEnergy = neighbours.filter((n) => n.active).reduce((a, n) => a + n.allocation, 0);
  const co2Saved = 47.3; // kg today

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Sun className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Energy Sharing</h2>
          <p className="text-sm text-muted-foreground">Solar panels powering the local community</p>
        </div>
      </div>

      {/* Energy Overview */}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Solar Output", value: `${solarOutput} kW`, max: solarCapacity, icon: Sun, color: "primary" },
          { label: "Stadium Usage", value: `${stadiumUsage} kW`, max: solarOutput, icon: Zap, color: "accent" },
          { label: "CO₂ Saved Today", value: `${co2Saved} kg`, max: 100, icon: Leaf, color: "primary" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-4 glow-green"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <stat.icon className="h-4 w-4 text-primary" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">{stat.value}</p>
            <Progress
              value={
                stat.label === "CO₂ Saved Today"
                  ? (co2Saved / stat.max) * 100
                  : stat.label === "Solar Output"
                    ? (solarOutput / solarCapacity) * 100
                    : (stadiumUsage / solarOutput) * 100
              }
              className="mt-2 h-1.5 bg-secondary [&>div]:bg-primary"
            />
          </motion.div>
        ))}
      </div>

      {/* Surplus banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-5 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {surplus} kW surplus available
            </p>
            <p className="text-xs text-muted-foreground">
              No match today — players' solar contribution active
            </p>
          </div>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {sharedEnergy} kW shared
        </span>
      </motion.div>

      {/* Neighbours */}
      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
        <Home className="h-4 w-4 text-primary" /> Local Neighbours
      </h3>
      <div className="space-y-2">
        {neighbours.map((n, i) => (
          <motion.div
            key={n.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${n.active ? "bg-primary animate-pulse-glow" : "bg-muted-foreground"}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{n.name}</p>
                <p className="text-[11px] text-muted-foreground">{n.distance}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">{n.allocation} kW</p>
                <p className="text-[11px] text-muted-foreground">{n.active ? "Receiving" : "Offline"}</p>
              </div>
              {n.active && <ArrowRight className="h-4 w-4 text-primary/50" />}
            </div>
          </motion.div>
        ))}
      </div>

      <Button variant="outline" className="mt-4 w-full border-primary/20 text-primary hover:bg-primary/5">
        <Sun className="mr-2 h-4 w-4" />
        Manage Energy Distribution
      </Button>
    </section>
  );
};

export default EnergySharing;
