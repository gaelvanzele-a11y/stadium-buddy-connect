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
        {/* Outer stadium ring (stands) */}
        <ellipse
          cx="120"
          cy="75"
          rx="82"
          ry="56"
          className="fill-secondary"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        {/* Inner concourse */}
        <ellipse
          cx="120"
          cy="75"
          rx="68"
          ry="44"
          className="fill-muted"
          stroke="hsl(var(--border))"
          strokeWidth="0.6"
        />

        {/* Stand segment dividers (radial lines) */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const x1 = 120 + Math.cos(angle) * 68;
          const y1 = 75 + Math.sin(angle) * 44;
          const x2 = 120 + Math.cos(angle) * 82;
          const y2 = 75 + Math.sin(angle) * 56;
          return (
            <line
              key={`stand-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--border))"
              strokeWidth="0.4"
            />
          );
        })}

        {/* Floodlight masts at corners */}
        {[
          { x: 52, y: 38 },
          { x: 188, y: 38 },
          { x: 52, y: 112 },
          { x: 188, y: 112 },
        ].map((p, i) => (
          <g key={`mast-${i}`}>
            <circle cx={p.x} cy={p.y} r={2.2} className="fill-foreground/70" />
            <circle cx={p.x} cy={p.y} r={1} className="fill-accent" />
          </g>
        ))}

        {/* Pitch (rectangular football field) */}
        <rect
          x="68"
          y="48"
          width="104"
          height="54"
          rx="2"
          className="fill-energy-leaf/25"
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth="0.8"
        />
        {/* Pitch stripes */}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={`stripe-${i}`}
            x={68 + i * (104 / 6)}
            y="48"
            width={104 / 6}
            height="54"
            className={i % 2 === 0 ? "fill-energy-leaf/10" : "fill-transparent"}
          />
        ))}
        {/* Halfway line */}
        <line
          x1="120"
          y1="48"
          x2="120"
          y2="102"
          stroke="hsl(var(--primary) / 0.6)"
          strokeWidth="0.6"
        />
        {/* Center circle & spot */}
        <circle
          cx="120"
          cy="75"
          r="8"
          fill="none"
          stroke="hsl(var(--primary) / 0.6)"
          strokeWidth="0.6"
        />
        <circle cx="120" cy="75" r="1" className="fill-primary/70" />

        {/* Left penalty area */}
        <rect
          x="68"
          y="60"
          width="14"
          height="30"
          fill="none"
          stroke="hsl(var(--primary) / 0.6)"
          strokeWidth="0.6"
        />
        {/* Left goal area */}
        <rect
          x="68"
          y="67"
          width="6"
          height="16"
          fill="none"
          stroke="hsl(var(--primary) / 0.6)"
          strokeWidth="0.6"
        />
        {/* Left goal */}
        <rect
          x="65.5"
          y="71"
          width="2.5"
          height="8"
          className="fill-card"
          stroke="hsl(var(--primary) / 0.7)"
          strokeWidth="0.5"
        />
        {/* Left penalty spot */}
        <circle cx="78" cy="75" r="0.8" className="fill-primary/70" />

        {/* Right penalty area */}
        <rect
          x="158"
          y="60"
          width="14"
          height="30"
          fill="none"
          stroke="hsl(var(--primary) / 0.6)"
          strokeWidth="0.6"
        />
        {/* Right goal area */}
        <rect
          x="166"
          y="67"
          width="6"
          height="16"
          fill="none"
          stroke="hsl(var(--primary) / 0.6)"
          strokeWidth="0.6"
        />
        {/* Right goal */}
        <rect
          x="172"
          y="71"
          width="2.5"
          height="8"
          className="fill-card"
          stroke="hsl(var(--primary) / 0.7)"
          strokeWidth="0.5"
        />
        {/* Right penalty spot */}
        <circle cx="162" cy="75" r="0.8" className="fill-primary/70" />

        {/* Corner arcs */}
        {[
          { cx: 68, cy: 48 },
          { cx: 172, cy: 48 },
          { cx: 68, cy: 102 },
          { cx: 172, cy: 102 },
        ].map((c, i) => (
          <circle
            key={`corner-${i}`}
            cx={c.cx}
            cy={c.cy}
            r="2"
            fill="none"
            stroke="hsl(var(--primary) / 0.6)"
            strokeWidth="0.5"
          />
        ))}
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
