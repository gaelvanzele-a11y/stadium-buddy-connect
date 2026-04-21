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
      return bookings.some(
        (b) =>
          b.kind === "room" &&
          b.roomId === roomId &&
          b.dateISO === dateISO &&
          b.startTime === startTime
      );
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
    <BookingsContext.Provider value={{ bookings, cardBalance, addBooking, isRoomSlotBooked, topUpCard, reset }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
};
