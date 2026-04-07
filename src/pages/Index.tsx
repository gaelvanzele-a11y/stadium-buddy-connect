import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DoorOpen, ParkingCircle, Sun } from "lucide-react";
import StadiumHeader from "@/components/StadiumHeader";
import RoomRental from "@/components/RoomRental";
import ParkingMobility from "@/components/ParkingMobility";
import EnergySharing from "@/components/EnergySharing";

const tabs = [
  { id: "rooms", label: "Rooms", icon: DoorOpen },
  { id: "parking", label: "Parking & Mobility", icon: ParkingCircle },
  { id: "energy", label: "Energy Sharing", icon: Sun },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("rooms");

  return (
    <div className="min-h-screen bg-background">
      <StadiumHeader />

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto flex gap-1 px-6 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "rooms" && <RoomRental />}
            {activeTab === "parking" && <ParkingMobility />}
            {activeTab === "energy" && <EnergySharing />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
