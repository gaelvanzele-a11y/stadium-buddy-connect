import { ArrowLeft, Search, Users, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { rooms } from "@/data/rooms";

interface RoomListViewProps {
  onBack: () => void;
  onSelectRoom: (id: string) => void;
}

const RoomListView = ({ onBack, onSelectRoom }: RoomListViewProps) => {
  const { t } = useLanguage();

  return (
    <div className="px-5 pt-6">
      <button onClick={onBack} className="mb-4 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h2 className="mb-4 font-display text-lg font-extrabold text-accent">
        {t("findRoom")}
      </h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Filters */}
      <div className="mb-5 flex gap-2 overflow-x-auto text-xs">
        <span className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">
          {t("capacity")}: 1-4
        </span>
        <span className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">
          {t("date")}: 15 Oct
        </span>
        <span className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">
          {t("time")}: 14:00
        </span>
      </div>

      {/* Room cards */}
      <div className="space-y-4 pb-24">
        {rooms.map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="overflow-hidden rounded-xl bg-card card-shadow"
          >
            <img
              src={room.image}
              alt={room.name}
              className="h-40 w-full object-cover"
              loading="lazy"
            />
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">{room.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {room.capacity}{t("persons")}, {room.featureKeys.join(", ")} - €{room.pricePerHour}{t("perHour")}
                </p>
              </div>
              <button
                onClick={() => onSelectRoom(room.id)}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
              >
                {t("reserve")}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RoomListView;
