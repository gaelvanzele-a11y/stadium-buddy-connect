import { CheckCircle2, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

export interface MobilityBookingInfo {
  title: string;
  itemName: string;
  location: string;
  date: string;
  time: string;
}

interface MobilityBookingDialogProps {
  booking: MobilityBookingInfo | null;
  onClose: () => void;
  onViewBookings: () => void;
}

const MobilityBookingDialog = ({ booking, onClose, onViewBookings }: MobilityBookingDialogProps) => {
  const { t } = useLanguage();
  const open = booking !== null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto -mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
        >
          <CheckCircle2 className="h-9 w-9 text-primary" />
        </motion.div>
        <DialogTitle className="text-center font-display text-lg font-extrabold text-accent">
          {t("mobilityBookingConfirmed")}
        </DialogTitle>
        <DialogDescription className="text-center">
          {t("mobilityBookingDesc")}
        </DialogDescription>

        {booking && (
          <div className="mt-2 rounded-xl border border-border bg-card p-4 text-left">
            <p className="font-display text-sm font-bold text-foreground">{booking.title}</p>
            <p className="text-xs text-muted-foreground">{booking.itemName}</p>
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                <span>{booking.date} · {booking.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{booking.location}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-2 flex flex-col gap-2">
          <button
            onClick={onViewBookings}
            className="w-full rounded-xl bg-primary py-3 font-display text-sm font-bold text-primary-foreground"
          >
            {t("viewMyBookings")}
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-border bg-card py-2.5 text-sm font-semibold text-muted-foreground"
          >
            {t("close")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobilityBookingDialog;
