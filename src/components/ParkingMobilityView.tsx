import { useState } from "react";
import { ArrowLeft, Car, Bike, Battery, Zap, MapPin, Users, Truck, CalendarIcon, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import MobilityBookingDialog, { type MobilityBookingInfo } from "@/components/MobilityBookingDialog";
import MobilityConfirmDialog, { type MobilityPendingBooking } from "@/components/MobilityConfirmDialog";
import { useBookings } from "@/contexts/BookingsContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import StadiumMap, { type ZoneKey } from "@/components/StadiumMap";

interface ParkingMobilityViewProps {
  onBack: () => void;
  onViewBookings?: () => void;
  initialSection?: "parking" | "bikes" | "shared" | "carpool";
}

const timeOptions = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

const ParkingMobilityView = ({ onBack, onViewBookings, initialSection }: ParkingMobilityViewProps) => {
  const { t, lang } = useLanguage();
  const dfLocale = lang === "nl" ? nl : enUS;
  const { addBooking, isMobilitySlotBooked } = useBookings();
  const [activeSection, setActiveSection] = useState<"parking" | "bikes" | "shared" | "carpool">(initialSection ?? "parking");
  const [carpoolTab, setCarpoolTab] = useState<"find" | "offer">("find");
  const [confirmation, setConfirmation] = useState<MobilityBookingInfo | null>(null);
  const [pending, setPending] = useState<
    | (MobilityPendingBooking & {
        kind: "bike" | "car" | "carpool";
        extra?: { itemId?: string; dateISO?: string; startTime?: string; endTime?: string };
      })
    | null
  >(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");
  const [highlightedZone, setHighlightedZone] = useState<ZoneKey | null>(null);

  const parkingZones = [
    { zoneKey: "northGate" as const, total: 400, occupied: 312, evChargers: 12, evAvailable: 4 },
    { zoneKey: "eastWing" as const, total: 250, occupied: 98, evChargers: 8, evAvailable: 6 },
    { zoneKey: "southGate" as const, total: 350, occupied: 340, evChargers: 10, evAvailable: 1 },
    { zoneKey: "westVIP" as const, total: 80, occupied: 22, evChargers: 6, evAvailable: 5 },
  ];

  const bikes = [
    { id: "E-01", battery: 92, locationKey: "northGate" as const, status: "available" as const },
    { id: "E-02", battery: 78, locationKey: "eastWing" as const, status: "available" as const },
    { id: "E-03", battery: 45, locationKey: "southGate" as const, status: "in-use" as const },
    { id: "E-04", battery: 100, locationKey: "westVIP" as const, status: "available" as const },
    { id: "E-05", battery: 15, locationKey: "northGate" as const, status: "charging" as const },
    { id: "E-06", battery: 63, locationKey: "eastWing" as const, status: "available" as const },
  ];

  const sharedCars = [
    { id: "SC-01", name: "VW ID.4", type: "electric", locationKey: "northGate" as const, available: true },
    { id: "SC-02", name: "Renault Zoe", type: "electric", locationKey: "eastWing" as const, available: true },
    { id: "SC-03", name: "Toyota Yaris", type: "hybrid", locationKey: "southGate" as const, available: false },
  ];

  const carpoolRides = [
    { id: "1", fromKey: "ride1From" as const, toKey: "ride1To" as const, driverKey: "ride1Driver" as const, timeKey: "ride1Time" as const, seats: 3 },
    { id: "2", fromKey: "ride2From" as const, toKey: "ride2To" as const, driverKey: "ride2Driver" as const, timeKey: "ride2Time" as const, seats: 2 },
    { id: "3", fromKey: "ride3From" as const, toKey: "ride3To" as const, driverKey: "ride3Driver" as const, timeKey: "ride3Time" as const, seats: 4 },
  ];

  const totalSpaces = parkingZones.reduce((a, z) => a + z.total, 0);
  const totalOccupied = parkingZones.reduce((a, z) => a + z.occupied, 0);
  const totalFree = totalSpaces - totalOccupied;

  const todayLabel = new Date().toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

  const dateISO = date ? format(date, "yyyy-MM-dd") : "";
  const todayISO = format(new Date(), "yyyy-MM-dd");
  const isToday = dateISO === todayISO;
  const dateLabel = date ? format(date, "d MMM yyyy", { locale: dfLocale }) : todayLabel;
  const validRange = toMin(endTime) > toMin(startTime);
  const slotLabel = `${startTime} - ${endTime}`;

  const confirmBooking = (
    info: MobilityBookingInfo,
    kind: "bike" | "car" | "carpool",
    extra?: { itemId?: string; dateISO?: string; startTime?: string; endTime?: string }
  ) => {
    setConfirmation(info);
    addBooking({
      id: Date.now().toString(),
      kind,
      roomName: `${info.title} — ${info.itemName}`,
      date: info.date,
      dateISO: extra?.dateISO,
      time: info.time,
      startTime: extra?.startTime,
      endTime: extra?.endTime,
      itemId: extra?.itemId,
      location: info.location,
    });
  };

  const hours = Math.max(1, (toMin(endTime) - toMin(startTime)) / 60);

  const handleRentBike = (bikeId: string, locationKey: "northGate" | "eastWing" | "southGate" | "westVIP") => {
    setPending({
      kind: "bike",
      title: t("bikeBookingTitle"),
      itemName: `${t("bike")} ${bikeId}`,
      location: t(locationKey),
      date: dateLabel,
      time: slotLabel,
      totalCost: 2 * hours,
      costBreakdown: `${hours} ${t("hours")} × €2${t("perHour")}`,
      extra: { itemId: bikeId, dateISO, startTime, endTime },
    });
  };

  const handleReserveCar = (carId: string, carName: string, locationKey: "northGate" | "eastWing" | "southGate" | "westVIP") => {
    setPending({
      kind: "car",
      title: t("carBookingTitle"),
      itemName: carName,
      location: t(locationKey),
      date: dateLabel,
      time: slotLabel,
      totalCost: 8 * hours,
      costBreakdown: `${hours} ${t("hours")} × €8${t("perHour")}`,
      extra: { itemId: carId, dateISO, startTime, endTime },
    });
  };

  const handleRequestRide = (ride: typeof carpoolRides[number]) => {
    setPending({
      kind: "carpool",
      title: t("rideBookingTitle"),
      itemName: `${t(ride.driverKey)} (${ride.seats} ${t("rideSeats")})`,
      location: `${t(ride.fromKey)} → ${t(ride.toKey)}`,
      date: t(ride.timeKey),
      time: "",
      totalCost: 3,
      costBreakdown: `1 ${t("perRide")} × €3`,
    });
  };

  const handleConfirmPending = () => {
    if (!pending) return;
    const { kind, extra, totalCost, costBreakdown, ...info } = pending;
    confirmBooking(info, kind, extra);
    setPending(null);
  };

  const [offerFrom, setOfferFrom] = useState("UHasselt");
  const [offerTo, setOfferTo] = useState("Mijnstadion");
  const [offerSeats, setOfferSeats] = useState(3);
  const [offerDate, setOfferDate] = useState<Date | undefined>(new Date());
  const [offerTime, setOfferTime] = useState("08:00");

  const handleOfferRide = () => {
    const oDateISO = offerDate ? format(offerDate, "yyyy-MM-dd") : "";
    const oDateLabel = offerDate ? format(offerDate, "d MMM yyyy", { locale: dfLocale }) : todayLabel;
    const info: MobilityBookingInfo = {
      title: t("offeredRide"),
      itemName: `${offerSeats} ${t("seatsAvailable")}`,
      location: `${offerFrom} → ${offerTo}`,
      date: oDateLabel,
      time: offerTime,
    };
    setConfirmation(info);
    addBooking({
      id: `offer-${Date.now()}`,
      kind: "carpool",
      roomName: `${t("offeredRide")}: ${offerFrom} → ${offerTo}`,
      date: oDateLabel,
      dateISO: oDateISO,
      time: offerTime,
      startTime: offerTime,
      location: `${offerFrom} → ${offerTo}`,
      offeredByUser: true,
      carpoolFrom: offerFrom,
      carpoolTo: offerTo,
      carpoolSeats: offerSeats,
    });
  };

  const sections = [
    { id: "parking" as const, label: t("parkingSpaces").split(" ")[0], icon: Car },
    { id: "bikes" as const, label: t("eBike"), icon: Bike },
    { id: "shared" as const, label: t("sharedCar"), icon: Truck },
    { id: "carpool" as const, label: t("carpoolTitle"), icon: Users },
  ];

  return (
    <div className="px-5 pb-24 pt-2">
      <button onClick={onBack} className="mb-4 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h2 className="mb-4 font-display text-lg font-extrabold text-accent uppercase">
        {t("sharedMobility")}
      </h2>

      {/* Section tabs */}
      <div className="mb-5 flex gap-2 overflow-x-auto">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeSection === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* PARKING SECTION */}
      {activeSection === "parking" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-5 rounded-xl bg-card p-5 card-shadow">
            <p className="text-sm text-muted-foreground">{t("parkingSpaces")}</p>
            <p className="font-display text-4xl font-extrabold text-mobility-blue">{totalFree}</p>
            <Progress value={(totalOccupied / totalSpaces) * 100} className="mt-3 h-2 bg-secondary [&>div]:bg-mobility-blue" />
          </div>

          <div className="space-y-3">
            {parkingZones.map((zone, i) => {
              const free = zone.total - zone.occupied;
              const pct = (zone.occupied / zone.total) * 100;
              return (
                <motion.div
                  key={zone.zoneKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl bg-card p-4 card-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-mobility-blue" />
                      <span className="font-display text-sm font-bold text-foreground">{t(zone.zoneKey)}</span>
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
        </motion.div>
      )}

      {/* BIKES SECTION */}
      {activeSection === "bikes" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <StadiumMap
            highlighted={highlightedZone}
            onSelect={(z) => setHighlightedZone((prev) => (prev === z ? null : z))}
            counts={bikes.reduce<Partial<Record<ZoneKey, number>>>((acc, b) => {
              if (b.status === "available") acc[b.locationKey] = (acc[b.locationKey] ?? 0) + 1;
              return acc;
            }, {})}
          />
          <DateTimeFilter date={date} setDate={setDate} startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} t={t} dfLocale={dfLocale} />
          {!validRange && (
            <p className="mb-3 text-xs font-semibold text-destructive">{t("invalidTimeRange")}</p>
          )}
          <div className="space-y-2">
            {bikes.map((bike, i) => {
              // For future dates, ignore real-time status (in-use/charging) — bike is bookable.
              const effectiveStatus = isToday ? bike.status : "available";
              const slotTaken =
                !validRange ||
                effectiveStatus !== "available" ||
                isMobilitySlotBooked("bike", bike.id, dateISO, startTime, endTime);
              const isZoneActive = highlightedZone === bike.locationKey;
              return (
                <motion.div
                  key={bike.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onMouseEnter={() => setHighlightedZone(bike.locationKey)}
                  onMouseLeave={() => setHighlightedZone(null)}
                  onFocus={() => setHighlightedZone(bike.locationKey)}
                  onBlur={() => setHighlightedZone(null)}
                  onTouchStart={() => setHighlightedZone(bike.locationKey)}
                  className={cn(
                    "flex items-center justify-between rounded-xl bg-card p-3 card-shadow transition-all",
                    slotTaken && "grayscale opacity-50",
                    isZoneActive && "ring-2 ring-mobility-blue"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                      <Bike className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t("bike")} {bike.id}</p>
                      <p className={cn(
                        "text-[11px] flex items-center gap-1",
                        isZoneActive ? "text-mobility-blue font-semibold" : "text-muted-foreground"
                      )}>
                        <MapPin className="h-3 w-3" />
                        {t(bike.locationKey)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs">
                      <Battery className={`h-3 w-3 ${isToday && bike.battery < 30 ? "text-destructive" : "text-primary"}`} />
                      <span className="text-muted-foreground">
                        {isToday ? `${bike.battery}%` : t("fullyCharged")}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-mobility-blue">€2{t("perHour")}</span>
                    {!slotTaken ? (
                      <button
                        onClick={() => handleRentBike(bike.id, bike.locationKey)}
                        className="rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        {t("rent")}
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-destructive">
                        {effectiveStatus === "in-use"
                          ? t("inUse")
                          : effectiveStatus === "charging"
                            ? t("charging")
                            : t("reservedSlot")}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* SHARED CARS SECTION */}
      {activeSection === "shared" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-foreground">
            <Car className="h-4 w-4 text-primary" /> {t("sharedCars")}
          </h3>
          <StadiumMap
            highlighted={highlightedZone}
            onSelect={(z) => setHighlightedZone((prev) => (prev === z ? null : z))}
            counts={sharedCars.reduce<Partial<Record<ZoneKey, number>>>((acc, c) => {
              if (c.available) acc[c.locationKey] = (acc[c.locationKey] ?? 0) + 1;
              return acc;
            }, {})}
          />
          <DateTimeFilter date={date} setDate={setDate} startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} t={t} dfLocale={dfLocale} />
          {!validRange && (
            <p className="mb-3 text-xs font-semibold text-destructive">{t("invalidTimeRange")}</p>
          )}
          <div className="space-y-2">
            {sharedCars.map((car, i) => {
              const slotTaken =
                !validRange || !car.available || isMobilitySlotBooked("car", car.id, dateISO, startTime, endTime);
              const isZoneActive = highlightedZone === car.locationKey;
              return (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onMouseEnter={() => setHighlightedZone(car.locationKey)}
                  onMouseLeave={() => setHighlightedZone(null)}
                  onFocus={() => setHighlightedZone(car.locationKey)}
                  onBlur={() => setHighlightedZone(null)}
                  onTouchStart={() => setHighlightedZone(car.locationKey)}
                  className={cn(
                    "flex items-center justify-between rounded-xl bg-card p-4 card-shadow transition-all",
                    slotTaken && "grayscale opacity-50",
                    isZoneActive && "ring-2 ring-mobility-blue"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{car.name}</p>
                      <p className={cn(
                        "text-[11px] flex items-center gap-1",
                        isZoneActive ? "text-mobility-blue font-semibold" : "text-muted-foreground"
                      )}>
                        <MapPin className="h-3 w-3" />
                        {t(car.locationKey)} · {t(car.type as "electric" | "hybrid")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[11px] font-semibold text-mobility-blue">€8{t("perHour")}</span>
                    {!slotTaken ? (
                      <button
                        onClick={() => handleReserveCar(car.id, car.name, car.locationKey)}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        {t("reserveCar")}
                      </button>
                  ) : (
                    <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive">
                      {t("reservedSlot")}
                    </span>
                  )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* CARPOOL SECTION */}
      {activeSection === "carpool" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setCarpoolTab("find")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
                carpoolTab === "find" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {t("findRide")}
            </button>
            <button
              onClick={() => setCarpoolTab("offer")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
                carpoolTab === "offer" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {t("offerRide")}
            </button>
          </div>

          {carpoolTab === "find" && (
            <div className="space-y-2">
              {carpoolRides.map((ride, i) => (
                <motion.div
                  key={ride.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl bg-card p-4 card-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {t(ride.fromKey)} → {t(ride.toKey)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {t(ride.driverKey)} · {t(ride.timeKey)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{ride.seats} {t("rideSeats")}</p>
                      <p className="text-[11px] font-semibold text-mobility-blue">€3 {t("perRide") }</p>
                      <button
                        onClick={() => handleRequestRide(ride)}
                        className="mt-1 rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground"
                      >
                        {t("requestRide")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {carpoolTab === "offer" && (
            <div className="rounded-xl bg-card p-4 card-shadow space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t("rideFrom")}</label>
                <input
                  type="text"
                  value={offerFrom}
                  onChange={(e) => setOfferFrom(e.target.value)}
                  placeholder="UHasselt"
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t("rideTo")}</label>
                <input
                  type="text"
                  value={offerTo}
                  onChange={(e) => setOfferTo(e.target.value)}
                  placeholder="Mijnstadion"
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t("departureDate")}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex w-full items-center gap-1.5 rounded-lg border border-border bg-background py-2 px-3 text-left text-sm text-foreground hover:border-primary">
                        <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                        {offerDate ? format(offerDate, "d MMM yyyy", { locale: dfLocale }) : t("pickADate")}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={offerDate}
                        onSelect={setOfferDate}
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        locale={dfLocale}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-28">
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t("departureTime")}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex w-full items-center gap-1.5 rounded-lg border border-border bg-background py-2 px-3 text-left text-sm text-foreground hover:border-primary">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {offerTime}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2" align="start">
                      <div className="grid max-h-64 grid-cols-3 gap-1 overflow-y-auto">
                        {timeOptions.map((tm) => (
                          <button
                            key={tm}
                            onClick={() => setOfferTime(tm)}
                            className={cn(
                              "rounded-md px-2 py-1.5 text-xs",
                              offerTime === tm ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                            )}
                          >
                            {tm}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">{t("rideSeats")}</label>
                <input
                  type="number"
                  value={offerSeats}
                  onChange={(e) => setOfferSeats(Math.max(1, Math.min(7, Number(e.target.value) || 1)))}
                  min={1}
                  max={7}
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                onClick={handleOfferRide}
                className="w-full rounded-xl bg-primary py-3 font-display text-sm font-bold text-primary-foreground"
              >
                {t("offerRide")}
              </button>
            </div>
          )}
        </motion.div>
      )}

      <MobilityConfirmDialog
        pending={pending}
        onCancel={() => setPending(null)}
        onConfirm={handleConfirmPending}
      />

      <MobilityBookingDialog
        booking={confirmation}
        onClose={() => setConfirmation(null)}
        onViewBookings={() => {
          setConfirmation(null);
          onViewBookings?.();
        }}
      />
    </div>
  );
};

interface DateTimeFilterProps {
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  startTime: string;
  setStartTime: (t: string) => void;
  endTime: string;
  setEndTime: (t: string) => void;
  t: (k: string) => string;
  dfLocale: typeof nl;
}

const DateTimeFilter = ({ date, setDate, startTime, setStartTime, endTime, setEndTime, t, dfLocale }: DateTimeFilterProps) => (
  <div className="mb-4 flex flex-wrap gap-2 text-xs">
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary">
          <CalendarIcon className="h-3.5 w-3.5 text-primary" />
          {t("date")}: {date ? format(date, "d MMM", { locale: dfLocale }) : t("pickADate")}
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
          locale={dfLocale}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>

    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary">
          <Clock className="h-3.5 w-3.5 text-primary" />
          {t("from")}: {startTime}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2" align="start">
        <div className="grid max-h-64 grid-cols-3 gap-1 overflow-y-auto">
          {timeOptions.slice(0, -1).map((tm) => (
            <button
              key={tm}
              onClick={() => {
                setStartTime(tm);
                if (toMin(endTime) <= toMin(tm)) {
                  const next = timeOptions[timeOptions.indexOf(tm) + 1];
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
          {timeOptions
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
);

export default ParkingMobilityView;