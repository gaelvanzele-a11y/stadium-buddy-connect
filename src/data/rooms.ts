import roomLogeImg from "@/assets/room-loge.jpg";
import roomPressImg from "@/assets/room-press.jpg";
import roomWorkspaceImg from "@/assets/room-workspace.jpg";

export interface Room {
  id: string;
  name: string;
  capacity: number;
  available: number;
  pricePerHour: number;
  image: string;
  featureKeys: string[];
  description_en: string;
  description_nl: string;
}

export const rooms: Room[] = [
  {
    id: "loge-koolmijn",
    name: "Loge 'De Koolmijn'",
    capacity: 4,
    available: 5,
    pricePerHour: 15,
    image: roomLogeImg,
    featureKeys: ["Wi-Fi", "TV", "Beamer", "Coffee"],
    description_en: "Loge 'De Koolmijn' is a modern lounge offering a panoramic view of the pitch. Perfect for meetings and small events with full AV equipment.",
    description_nl: "Loge 'De Koolmijn' is een moderne lounge met panoramisch uitzicht op het veld. Perfect voor vergaderingen en kleine evenementen met volledige AV-uitrusting.",
  },
  {
    id: "loge-mijnwerker",
    name: "Loge 'De Mijnwerker'",
    capacity: 10,
    available: 1,
    pricePerHour: 22,
    image: roomLogeImg,
    featureKeys: ["Wi-Fi", "TV", "Beamer", "Coffee"],
    description_en: "Spacious VIP lounge for up to 10 guests with premium catering options.",
    description_nl: "Ruime VIP-lounge voor maximaal 10 gasten met premium cateringopties.",
  },
  {
    id: "press-room",
    name: "Persruimte A",
    capacity: 80,
    available: 1,
    pricePerHour: 25,
    image: roomPressImg,
    featureKeys: ["Wi-Fi", "Beamer", "Coffee"],
    description_en: "A professional press room with full AV setup, backdrop, and seating for up to 80 people. Ideal for press conferences and presentations.",
    description_nl: "Een professionele persruimte met volledige AV-opstelling, achtergrond en zitplaatsen voor maximaal 80 personen.",
  },
  {
    id: "workspace",
    name: "Werkplek Stadion",
    capacity: 12,
    available: 8,
    pricePerHour: 10,
    image: roomWorkspaceImg,
    featureKeys: ["Wi-Fi", "Coffee"],
    description_en: "Flexible coworking space overlooking the pitch. Desks, power outlets, and high-speed Wi-Fi included.",
    description_nl: "Flexibele coworking werkplek met uitzicht op het veld. Bureaus, stopcontacten en snelle Wi-Fi inbegrepen.",
  },
  {
    id: "workspace-quiet",
    name: "Stille Werkplek 'De Schacht'",
    capacity: 6,
    available: 4,
    pricePerHour: 12,
    image: roomWorkspaceImg,
    featureKeys: ["Wi-Fi", "Coffee"],
    description_en: "A quiet focus zone for individual deep work, with monitors at each desk.",
    description_nl: "Een stille focuszone voor individueel werk, met monitoren aan elk bureau.",
  },
];

// Unique VIP loges (used in ticketshop & loge selection)
export interface Loge {
  id: string;
  name: string;
  capacity: number;
  pricePerMatch: number;
}

export const loges: Loge[] = [
  { id: "loge-koolmijn", name: "Loge 'De Koolmijn'", capacity: 8, pricePerMatch: 320 },
  { id: "loge-mijnwerker", name: "Loge 'De Mijnwerker'", capacity: 10, pricePerMatch: 380 },
  { id: "loge-terril", name: "Loge 'De Terril'", capacity: 6, pricePerMatch: 260 },
  { id: "loge-schacht", name: "Loge 'De Schacht'", capacity: 12, pricePerMatch: 450 },
  { id: "loge-kolenwasserij", name: "Loge 'De Kolenwasserij'", capacity: 8, pricePerMatch: 340 },
];
