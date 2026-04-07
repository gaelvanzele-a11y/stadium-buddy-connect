import { Users, Zap, Car, Activity, Calendar, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

const GovernanceDashboard = () => {
  const { t } = useLanguage();

  const kpis = [
    { label: t("kpiRoomOccupancy"), value: "78%", pct: 78, icon: Calendar, color: "text-primary" },
    { label: t("kpiParkingUsage"), value: "72%", pct: 72, icon: Car, color: "text-mobility-blue" },
    { label: t("kpiEnergyShared"), value: "104 kW", pct: 52, icon: Zap, color: "text-energy-leaf" },
    { label: t("kpiActiveUsers"), value: "1,247", pct: 62, icon: Users, color: "text-accent" },
  ];

  const stakeholders = [
    { name: t("hubManager"), role: t("roleOperations"), status: "online" },
    { name: t("cityCouncil"), role: t("rolePolicy"), status: "online" },
    { name: t("energyProvider"), role: t("roleEnergy"), status: "offline" },
    { name: t("mobilityPartner"), role: t("roleMobility"), status: "online" },
    { name: t("communityRep"), role: t("roleCommunity"), status: "online" },
  ];

  const recentActivity = [
    { text: t("activityEnergy"), time: "2m", icon: Zap },
    { text: t("activityBooking"), time: "15m", icon: Calendar },
    { text: t("activityFeedback"), time: "1h", icon: MessageSquare },
    { text: t("activityParking"), time: "2h", icon: Car },
  ];

  return (
    <div className="px-5 pb-24 pt-6">
      <h2 className="mb-1 font-display text-lg font-extrabold text-accent uppercase">
        {t("governancePortal")}
      </h2>
      <p className="mb-5 text-xs text-muted-foreground">{t("governanceDesc")}</p>

      {/* KPIs */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl bg-card p-4 card-shadow"
          >
            <div className="flex items-center gap-1.5">
              <kpi.icon className={`h-3.5 w-3.5 ${kpi.color}`} />
              <span className="text-[11px] text-muted-foreground">{kpi.label}</span>
            </div>
            <p className="mt-1 font-display text-xl font-extrabold text-foreground">{kpi.value}</p>
            <Progress value={kpi.pct} className="mt-2 h-1.5 bg-secondary [&>div]:bg-primary" />
          </motion.div>
        ))}
      </div>

      {/* Stakeholders */}
      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-foreground">
        <Users className="h-4 w-4 text-primary" /> {t("stakeholders")}
      </h3>
      <div className="mb-5 space-y-2">
        {stakeholders.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            className="flex items-center justify-between rounded-xl bg-card p-3 card-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${s.status === "online" ? "bg-energy-leaf" : "bg-muted-foreground"}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">{s.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-foreground">
        <Activity className="h-4 w-4 text-primary" /> {t("recentActivity")}
      </h3>
      <div className="space-y-2">
        {recentActivity.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.04 }}
            className="flex items-center gap-3 rounded-xl bg-card p-3 card-shadow"
          >
            <a.icon className="h-4 w-4 text-muted-foreground" />
            <p className="flex-1 text-sm text-foreground">{a.text}</p>
            <span className="text-[11px] text-muted-foreground">{a.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GovernanceDashboard;
