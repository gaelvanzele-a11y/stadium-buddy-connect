import { useState } from "react";
import { ArrowLeft, Search, Users, CalendarIcon, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { rooms } from "@/data/rooms";
import { useBookings } from "@/contexts/BookingsContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface RoomListViewProps {
  onBack: () => void;
  onSelectRoom: (id: string, date: Date, startTime: string, endTime: string) => void;
}

const capacityOptions = ["any", "1-4", "5-10", "10-20", "20+"];
const hourOptions = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

const RoomListView = ({ onBack, onSelectRoom }: RoomListViewProps) => {
  const { t } = useLanguage();
  const { isRoomSlotBooked } = useBookings();
  const [capacity, setCapacity] = useState("any");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");
  const [search, setSearch] = useState("");

  const capacityRange = (() => {
    if (capacity === "any") return [0, Infinity] as const;
    if (capacity === "1-4") return [1, 4] as const;
    if (capacity === "5-10") return [5, 10] as const;
    if (capacity === "10-20") return [10, 20] as const;
    return [20, Infinity] as const;
  })();

  const dateISO = date ? format(date, "yyyy-MM-dd") : "";
  const validRange = toMin(endTime) > toMin(startTime);

  const filteredRooms = rooms.filter((r) => {
    const matchesCapacity = r.capacity >= capacityRange[0] && r.capacity <= capacityRange[1];
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    return matchesCapacity && matchesSearch;
  });

  return (
    <div className="px-5 pt-6">
      <button onClick={onBack} className="mb-4 text-muted-foreground" aria-label="Back">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h2 className="mb-4 font-display text-lg font-extrabold text-accent">
        {t("findRoom")}
      </h2>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto text-xs">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary">
              <Users className="h-3.5 w-3.5 text-primary" />
              {t("capacity")}: {capacity}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="start">
            <div className="flex flex-col gap-1">
              {capacityOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setCapacity(c)}
                  className={cn(
                    "rounded-md px-3 py-2 text-left text-sm",
                    capacity === c ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary">
              <CalendarIcon className="h-3.5 w-3.5 text-primary" />
              {t("date")}: {date ? format(date, "d MMM") : t("pickADate")}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
              modifiersClassNames={{
                today:
                  date && date.toDateString() !== new Date().toDateString()
                    ? "!bg-transparent !text-foreground"
                    : "",
              }}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto text-xs">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {t("from")}: {startTime}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="start">
            <div className="grid max-h-64 grid-cols-3 gap-1 overflow-y-auto">
              {hourOptions.slice(0, -1).map((tm) => (
                <button
                  key={tm}
                  onClick={() => {
                    setStartTime(tm);
                    if (toMin(endTime) <= toMin(tm)) {
                      const next = hourOptions[hourOptions.indexOf(tm) + 1];
                      if (next) setEndTime(next);
                    }
                  }}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-xs",
                    startTime === tm ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  )}
                >
                  {tm}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {t("to")}: {endTime}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="start">
            <div className="grid max-h-64 grid-cols-3 gap-1 overflow-y-auto">
              {hourOptions
                .filter((tm) => toMin(tm) > toMin(startTime))
                .map((tm) => (
                  <button
                    key={tm}
                    onClick={() => setEndTime(tm)}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-xs",
                      endTime === tm ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                    )}
                  >
                    {tm}
                  </button>
                ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {!validRange && (
        <p className="mb-3 text-xs font-semibold text-destructive">{t("invalidTimeRange")}</p>
      )}

      <div className="space-y-4 pb-24">
        {filteredRooms.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t("noResults")}</p>
        ) : (
          filteredRooms.map((room, i) => {
            const taken = !validRange || !!(dateISO && isRoomSlotBooked(room.id, dateISO, startTime, endTime));
            const hours = Math.max(1, (toMin(endTime) - toMin(startTime)) / 60);
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "overflow-hidden rounded-xl bg-card card-shadow transition-all",
                  taken && "pointer-events-none grayscale opacity-50"
                )}
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
                    <p className={cn(
                      "mt-1 text-[11px] font-semibold",
                      taken ? "text-destructive" : "text-primary"
                    )}>
                      {taken ? t("reservedSlot") : `${t("available_short")} · ${hours} ${t("hours")}`}
                    </p>
                  </div>
                  <button
                    onClick={() => date && !taken && onSelectRoom(room.id, date, startTime, endTime)}
                    disabled={taken}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {taken ? t("notAvailable") : t("reserve")}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RoomListView;
