import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type BookingKind = "room" | "bike" | "car" | "carpool" | "ticket" | "topup";

export interface Booking {
  id: string;
  kind: BookingKind;
  roomName: string; // display title
  date: string; // formatted label
  dateISO?: string; // YYYY-MM-DD for slot lookups
  time: string;
  location: string;
  // Room-specific
  roomId?: string;
  startTime?: string; // "HH:MM"
  endTime?: string; // "HH:MM"
  // Mobility-specific (bike/car)
  itemId?: string;
  // Ticket-specific
  matchKey?: string;
  section?: string;
  row?: string;
  seat?: string;
  price?: number;
  sportKey?: string;
  // Top-up
  amount?: number;
}

interface BookingsContextValue {
  bookings: Booking[];
  cardBalance: number;
  addBooking: (b: Booking) => void;
  isRoomSlotBooked: (roomId: string, dateISO: string, startTime: string, endTime?: string) => boolean;
  isMobilitySlotBooked: (kind: "bike" | "car", itemId: string, dateISO: string, startTime: string, endTime?: string) => boolean;
  topUpCard: (amount: number) => Booking;
  reset: () => void;
}

const BookingsContext = createContext<BookingsContextValue | undefined>(undefined);

const STARTING_BALANCE = 42.5;

// Convert "HH:MM" to minutes from midnight
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

// Deterministic hash for simulated occupancy of a single hourly slot
const hourSlotOccupied = (key: string, threshold: number) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h % 100 < threshold;
};

// Iterate every hour [start, end) and check if any of them are occupied
const anyHourOccupied = (
  startTime: string,
  endTime: string,
  buildKey: (hh: string) => string,
  threshold: number
) => {
  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);
  if (endMin <= startMin) return false;
  for (let m = startMin; m < endMin; m += 60) {
    const hh = `${String(Math.floor(m / 60)).padStart(2, "0")}:00`;
    if (hourSlotOccupied(buildKey(hh), threshold)) return true;
  }
  return false;
};

// Two [start,end) ranges overlap?
const rangesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
};

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cardBalance, setCardBalance] = useState<number>(STARTING_BALANCE);

  const addBooking = useCallback((b: Booking) => {
    setBookings((prev) => [b, ...prev]);
  }, []);

  const isRoomSlotBooked = useCallback(
    (roomId: string, dateISO: string, startTime: string, endTime?: string) => {
      const reqEnd = endTime ?? `${String((toMinutes(startTime) + 60) / 60 | 0).padStart(2, "0")}:00`;

      // 1. Real bookings overlapping the requested range
      const realBooked = bookings.some((b) => {
        if (b.kind !== "room" || b.roomId !== roomId || b.dateISO !== dateISO) return false;
        if (!b.startTime || !b.endTime) return false;
        return rangesOverlap(startTime, reqEnd, b.startTime, b.endTime);
      });
      if (realBooked) return true;

      // 2. Simulated occupancy: check each hourly slot in [start, end)
      return anyHourOccupied(startTime, reqEnd, (hh) => `${roomId}|${dateISO}|${hh}`, 35);
    },
    [bookings]
  );

  const isMobilitySlotBooked = useCallback(
    (kind: "bike" | "car", itemId: string, dateISO: string, startTime: string, endTime?: string) => {
      const reqEnd = endTime ?? `${String((toMinutes(startTime) + 60) / 60 | 0).padStart(2, "0")}:00`;

      const realBooked = bookings.some((b) => {
        if (b.kind !== kind || b.itemId !== itemId || b.dateISO !== dateISO) return false;
        if (!b.startTime || !b.endTime) return false;
        return rangesOverlap(startTime, reqEnd, b.startTime, b.endTime);
      });
      if (realBooked) return true;

      return anyHourOccupied(startTime, reqEnd, (hh) => `${kind}|${itemId}|${dateISO}|${hh}`, 30);
    },
    [bookings]
  );

  const topUpCard = useCallback((amount: number): Booking => {
    setCardBalance((bal) => bal + amount);
    const b: Booking = {
      id: `top-${Date.now()}`,
      kind: "topup",
      roomName: `+ €${amount}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      location: "Club Consumption Card",
      amount,
    };
    setBookings((prev) => [b, ...prev]);
    return b;
  }, []);

  const reset = useCallback(() => {
    setBookings([]);
    setCardBalance(STARTING_BALANCE);
  }, []);

  return (
    <BookingsContext.Provider value={{ bookings, cardBalance, addBooking, isRoomSlotBooked, isMobilitySlotBooked, topUpCard, reset }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
};
