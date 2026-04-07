import { Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { rooms } from "@/data/rooms";

interface SearchViewProps {
  onSelectRoom: (id: string) => void;
  onGoMobility: () => void;
  onGoEnergy: () => void;
}

const SearchView = ({ onSelectRoom, onGoMobility, onGoEnergy }: SearchViewProps) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  const allItems = [
    ...rooms.map((r) => ({ id: r.id, type: "room" as const, name: r.name, sub: `${r.capacity}${t("persons")} · €${r.pricePerHour}${t("perHour")}` })),
    { id: "mobility", type: "mobility" as const, name: t("sharedMobility"), sub: t("parkingSpaces") },
    { id: "energy", type: "energy" as const, name: t("neighborhoodEnergy"), sub: t("solarOutput") },
  ];

  const filtered = query.trim()
    ? allItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  const handleClick = (item: typeof allItems[0]) => {
    if (item.type === "room") onSelectRoom(item.id);
    else if (item.type === "mobility") onGoMobility();
    else onGoEnergy();
  };

  return (
    <div className="px-5 pb-24 pt-6">
      <h2 className="mb-4 font-display text-lg font-extrabold text-accent uppercase">
        {t("search")}
      </h2>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => handleClick(item)}
            className="flex w-full items-center justify-between rounded-xl bg-card p-4 text-left card-shadow transition-all active:scale-[0.98]"
          >
            <div>
              <p className="font-display text-sm font-bold text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          </motion.button>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">{t("noResults")}</p>
        )}
      </div>
    </div>
  );
};

export default SearchView;
