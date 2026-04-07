import roomLogeImg from "@/assets/room-loge.jpg";
import roomPressImg from "@/assets/room-press.jpg";
import roomWorkspaceImg from "@/assets/room-workspace.jpg";

export interface Room {
  id: string;
  name: string;
  capacity: number;
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
    pricePerHour: 15,
    image: roomLogeImg,
    featureKeys: ["Wi-Fi", "TV", "Beamer", "Coffee"],
    description_en: "Loge 'De Koolmijn' is a modern lounge offering a panoramic view of the pitch. Perfect for meetings and small events with full AV equipment.",
    description_nl: "Loge 'De Koolmijn' als nax modern loge, vont oller van trwin de inoket modervanmen. Zonlien kaas aan wet een festanre constltination.",
  },
  {
    id: "press-room",
    name: "Persruimte A",
    capacity: 80,
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
    pricePerHour: 10,
    image: roomWorkspaceImg,
    featureKeys: ["Wi-Fi", "Coffee"],
    description_en: "Flexible coworking space overlooking the pitch. Desks, power outlets, and high-speed Wi-Fi included.",
    description_nl: "Flexibele coworking werkplek met uitzicht op het veld. Bureaus, stopcontacten en snelle Wi-Fi inbegrepen.",
  },
];
