import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export type ZoneKey = "northGate" | "eastWing" | "southGate" | "westVIP";

interface StadiumMapProps {
  highlighted?: ZoneKey | null;
  onSelect?: (zone: ZoneKey) => void;
  /** Optional counts shown in tooltip-style labels per zone (e.g. number of available bikes/cars) */
  counts?: Partial<Record<ZoneKey, number>>;
  countLabel?: string;
}

// SVG coordinates for a stylised stadium plan (200x140 viewBox)
const ZONES: Record<
  ZoneKey,
  { x: number; y: number; labelX: number; labelY: number; anchor: "start" | "middle" | "end" }
> = {
  northGate: { x: 120, y: 27, labelX: 120, labelY: 17, anchor: "middle" },
  eastWing: { x: 188, y: 75, labelX: 196, labelY: 78, anchor: "start" },
  southGate: { x: 120, y: 123, labelX: 120, labelY: 140, anchor: "middle" },
  westVIP: { x: 52, y: 75, labelX: 44, labelY: 78, anchor: "end" },
};

const StadiumMap = ({ highlighted, onSelect, counts, countLabel }: StadiumMapProps) => {
  const { t } = useLanguage();
  const zoneKeys: ZoneKey[] = ["northGate", "eastWing", "southGate", "westVIP"];

  return (
    <div className="mb-4 overflow-hidden rounded-xl bg-card p-3 card-shadow">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-display text-xs font-bold uppercase tracking-wide text-foreground">
          {t("stadiumMap")}
        </p>
        <p className="text-[10px] text-muted-foreground">{t("mapHint")}</p>
      </div>

      <svg
        viewBox="0 0 240 150"
        className="h-auto w-full"
        role="img"
        aria-label={t("stadiumMap")}
        overflow="visible"
      >
        {/* Outer stadium ring */}
        <ellipse
          cx="120"
          cy="75"
          rx="78"
          ry="52"
          className="fill-secondary"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        {/* Inner field */}
        <ellipse
          cx="100"
          cy="70"
          rx="58"
          ry="34"
          className="fill-energy-leaf/20"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        <line
          x1="100"
          y1="36"
          x2="100"
          y2="104"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="0.6"
          strokeDasharray="2 2"
        />
        <circle
          cx="100"
          cy="70"
          r="8"
          fill="none"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="0.6"
        />

        {zoneKeys.map((key) => {
          const z = ZONES[key];
          const isActive = highlighted === key;
          const count = counts?.[key];
          return (
            <g
              key={key}
              className={cn(
                "cursor-pointer transition-all",
                onSelect && "hover:opacity-90"
              )}
              onClick={() => onSelect?.(key)}
            >
              {/* Pulsing halo when active */}
              {isActive && (
                <motion.circle
                  cx={z.x}
                  cy={z.y}
                  r={10}
                  className="fill-mobility-blue/30"
                  initial={{ opacity: 0.2, scale: 0.8 }}
                  animate={{ opacity: [0.5, 0.1, 0.5], scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
              )}
              {/* Pin */}
              <circle
                cx={z.x}
                cy={z.y}
                r={isActive ? 6 : 4.5}
                className={cn(
                  "transition-all",
                  isActive ? "fill-mobility-blue" : "fill-primary"
                )}
                stroke="hsl(var(--card))"
                strokeWidth="1.5"
              />
              {/* Label */}
              <text
                x={z.labelX}
                y={z.labelY}
                textAnchor={z.anchor}
                className={cn(
                  "font-display transition-all",
                  isActive ? "fill-mobility-blue" : "fill-foreground"
                )}
                style={{ fontSize: 7, fontWeight: isActive ? 800 : 600 }}
              >
                {t(key)}
              </text>
              {/* Count badge */}
              {typeof count === "number" && (
                <g>
                  <circle
                    cx={z.x + 7}
                    cy={z.y - 6}
                    r={4.5}
                    className="fill-accent"
                  />
                  <text
                    x={z.x + 7}
                    y={z.y - 4.4}
                    textAnchor="middle"
                    className="fill-accent-foreground"
                    style={{ fontSize: 5, fontWeight: 800 }}
                  >
                    {count}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {countLabel && counts && (
        <p className="mt-1 text-center text-[10px] text-muted-foreground">{countLabel}</p>
      )}
    </div>
  );
};

export default StadiumMap;
