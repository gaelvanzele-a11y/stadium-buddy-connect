import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "nl";

const translations = {
  en: {
    welcome: "WELCOME TO THE STADIUM",
    searchPlaceholder: "Search a room, shared car...",
    workspaces: "Workspaces",
    sharedMobility: "Shared Mobility",
    neighborhoodEnergy: "Neighborhood & Energy",
    todaySaving: "TODAY: Neighborhood saves",
    inEnergy: "in energy!",
    home: "Home",
    search: "Search",
    bookings: "Bookings",
    account: "Account",
    findRoom: "FIND A ROOM",
    capacity: "Capacity",
    date: "Date",
    time: "Time",
    reserve: "RESERVE",
    bookThisRoom: "BOOK THIS ROOM",
    bookingConfirm: "CONFIRM BOOKING",
    bookingConfirmed: "BOOKING CONFIRMED!",
    payAndBook: "PAY & BOOK",
    addMobility: "Add shared mobility?",
    addMobilityDesc: "Add shared mobility options.",
    paymentMethod: "Payment method",
    digitalKey: "Digital Key",
    scanAtEntrance: "Scan at entrance",
    openSmartLock: "OPEN SMART LOCK",
    routeDescription: "ROUTE DESCRIPTION",
    reserveSharedCar: "RESERVE SHARED CAR",
    hours: "hours",
    perHour: "/hr",
    persons: "p",
    wifi: "Wi-Fi",
    projector: "Projector",
    coffee: "Coffee",
    tv: "TV",
    available: "Available",
    occupied: "Occupied",
    maintenance: "Maintenance",
    parkingSpaces: "parking spaces free",
    eBikes: "E-bikes available",
    evChargers: "EV chargers",
    solarOutput: "Solar Output",
    sharedWithNeighbors: "Shared with neighbours",
    co2Saved: "CO₂ Saved Today",
    surplus: "surplus available",
    noMatchToday: "No match today — solar energy shared with community",
    manageEnergy: "Manage Energy Distribution",
    receiving: "Receiving",
    offline: "Offline",
    localNeighbours: "Local Neighbours",
    rent: "Rent",
    backToHome: "Back",
    features: "Features",
    location: "Location",
    stadiumEntrance: "Stadium entrance",
    login: "LOG IN",
    logout: "LOG OUT",
    loggedIn: "Logged in",
    email: "Email",
    password: "Password",
    emailPlaceholder: "your@email.com",
    passwordPlaceholder: "Your password",
    communityCenter: "Community Center",
    localSchool: "Local School",
    residentialBlockA: "Residential Block A",
    sportsClinic: "Sports Clinic",
    cafeDistrict: "Café District",
    northGate: "North Gate",
    eastWing: "East Wing",
    southGate: "South Gate",
    westVIP: "West VIP",
    inUse: "in use",
    charging: "charging",
    bike: "Bike",
  },
  nl: {
    welcome: "WELKOM BIJ HET MIJNSTADION",
    searchPlaceholder: "Zoek een ruimte, deelauto...",
    workspaces: "Werkplekken",
    sharedMobility: "Deelmobiliteit",
    neighborhoodEnergy: "Buurt & Energie",
    todaySaving: "VANDAAG: Buurt bespaart",
    inEnergy: "aan energie!",
    home: "Home",
    search: "Zoeken",
    bookings: "Boekingen",
    account: "Account",
    findRoom: "VIND EEN RUIMTE",
    capacity: "Capaciteit",
    date: "Datum",
    time: "Tijd",
    reserve: "RESERVEER",
    bookThisRoom: "BOEK DEZE RUIMTE",
    bookingConfirm: "BOEKING BEVESTIGEN",
    bookingConfirmed: "BOEKING BEVESTIGD!",
    payAndBook: "BETALEN & BOEKEN",
    addMobility: "Voeg Deelmobiliteit toe?",
    addMobilityDesc: "Voeg deelmobiliteit toe noollen.",
    paymentMethod: "Betaalmethode",
    digitalKey: "Digitale Sleutel",
    scanAtEntrance: "Scan bij Ingang",
    openSmartLock: "OPEN SLIMME SLOT",
    routeDescription: "ROUTEBESCHRIJVING",
    reserveSharedCar: "DEELAUTO RESERVEREN",
    hours: "uur",
    perHour: "/u",
    persons: "p",
    wifi: "Wi-Fi",
    projector: "Beamer",
    coffee: "Koffie",
    tv: "TV",
    available: "Beschikbaar",
    occupied: "Bezet",
    maintenance: "Onderhoud",
    parkingSpaces: "parkeerplaatsen vrij",
    eBikes: "E-bikes beschikbaar",
    evChargers: "EV-laders",
    solarOutput: "Zonne-energie",
    sharedWithNeighbors: "Gedeeld met buren",
    co2Saved: "CO₂ Bespaard Vandaag",
    surplus: "overschot beschikbaar",
    noMatchToday: "Geen wedstrijd vandaag — zonne-energie gedeeld met buurt",
    manageEnergy: "Beheer Energieverdeling",
    receiving: "Ontvangt",
    offline: "Offline",
    localNeighbours: "Lokale Buren",
    rent: "Huur",
    backToHome: "Terug",
    features: "Voorzieningen",
    location: "Locatie",
    stadiumEntrance: "Stadion ingang",
    login: "INLOGGEN",
    logout: "UITLOGGEN",
    loggedIn: "Ingelogd",
    email: "E-mail",
    password: "Wachtwoord",
    emailPlaceholder: "uw@email.com",
    passwordPlaceholder: "Uw wachtwoord",
    communityCenter: "Buurthuis",
    localSchool: "Buurtschool",
    residentialBlockA: "Woonblok A",
    sportsClinic: "Sportkliniek",
    cafeDistrict: "Caféwijk",
    northGate: "Noordpoort",
    eastWing: "Oostvleugel",
    southGate: "Zuidpoort",
    westVIP: "West VIP",
    inUse: "in gebruik",
    charging: "opladen",
    bike: "Fiets",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("nl");

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
