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
  isRoomSlotBooked: (roomId: string, dateISO: string, startTime: string) => boolean;
  isMobilitySlotBooked: (kind: "bike" | "car", itemId: string, dateISO: string, startTime: string) => boolean;
  topUpCard: (amount: number) => Booking;
  reset: () => void;
}

const BookingsContext = createContext<BookingsContextValue | undefined>(undefined);

const STARTING_BALANCE = 42.5;

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cardBalance, setCardBalance] = useState<number>(STARTING_BALANCE);

  const addBooking = useCallback((b: Booking) => {
    setBookings((prev) => [b, ...prev]);
  }, []);

  const isRoomSlotBooked = useCallback(
    (roomId: string, dateISO: string, startTime: string) => {
      // 1. Real bookings made by the user in this session
      const realBooked = bookings.some(
        (b) =>
          b.kind === "room" &&
          b.roomId === roomId &&
          b.dateISO === dateISO &&
          b.startTime === startTime
      );
      if (realBooked) return true;

      // 2. Simulated pre-existing reservations: deterministic per (room, date, time)
      // so the same room/date/time combination always shows the same status across
      // the app, but distribution feels realistic (~35% occupied).
      let h = 0;
      const key = `${roomId}|${dateISO}|${startTime}`;
      for (let i = 0; i < key.length; i++) {
        h = (h * 31 + key.charCodeAt(i)) >>> 0;
      }
      return h % 100 < 35;
    },
    [bookings]
  );

  const isMobilitySlotBooked = useCallback(
    (kind: "bike" | "car", itemId: string, dateISO: string, startTime: string) => {
      const realBooked = bookings.some(
        (b) =>
          b.kind === kind &&
          b.itemId === itemId &&
          b.dateISO === dateISO &&
          b.startTime === startTime
      );
      if (realBooked) return true;
      let h = 0;
      const key = `${kind}|${itemId}|${dateISO}|${startTime}`;
      for (let i = 0; i < key.length; i++) {
        h = (h * 31 + key.charCodeAt(i)) >>> 0;
      }
      return h % 100 < 30;
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
