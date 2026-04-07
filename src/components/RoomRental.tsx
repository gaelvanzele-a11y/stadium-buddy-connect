import { motion } from "framer-motion";
import { DoorOpen, Crown, Mic, ShirtIcon, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const rooms = [
  {
    name: "VIP Lounge North",
    type: "VIP",
    capacity: 24,
    pricePerHour: 350,
    status: "available" as const,
    icon: Crown,
    features: ["Private bar", "Pitch view", "Catering"],
  },
  {
    name: "Press Room A",
    type: "Press",
    capacity: 80,
    pricePerHour: 200,
    status: "occupied" as const,
    icon: Mic,
    features: ["AV system", "Backdrop", "Wi-Fi"],
  },
  {
    name: "Home Changing Room",
    type: "Changing",
    capacity: 30,
    pricePerHour: 150,
    status: "available" as const,
    icon: ShirtIcon,
    features: ["Showers", "Lockers", "Tactical board"],
  },
  {
    name: "VIP Lounge South",
    type: "VIP",
    capacity: 16,
    pricePerHour: 280,
    status: "maintenance" as const,
    icon: Crown,
    features: ["Skybox", "Lounge seating", "Mini kitchen"],
  },
  {
    name: "Conference Hall",
    type: "Conference",
    capacity: 120,
    pricePerHour: 450,
    status: "available" as const,
    icon: Users,
    features: ["Projector", "Stage", "Sound system"],
  },
  {
    name: "Press Room B",
    type: "Press",
    capacity: 40,
    pricePerHour: 120,
    status: "available" as const,
    icon: Mic,
    features: ["Cameras", "Interview area", "Wi-Fi"],
  },
];

const statusConfig = {
  available: { label: "Available", className: "bg-primary/15 text-primary border-primary/20" },
  occupied: { label: "Occupied", className: "bg-accent/15 text-accent border-accent/20" },
  maintenance: { label: "Maintenance", className: "bg-muted text-muted-foreground border-border" },
};

const RoomRental = () => {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <DoorOpen className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Rooms to Rent</h2>
          <p className="text-sm text-muted-foreground">Press rooms, changing rooms, VIP lounges & more</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room, i) => {
          const Icon = room.icon;
          const status = statusConfig[room.status];
          return (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:glow-amber"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
              </div>
              <h3 className="font-display font-semibold text-foreground">{room.name}</h3>
              <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {room.capacity}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> €{room.pricePerHour}/hr
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {room.features.map((f) => (
                  <span key={f} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                    {f}
                  </span>
                ))}
              </div>
              {room.status === "available" && (
                <Button size="sm" className="mt-4 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Book Now
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default RoomRental;
