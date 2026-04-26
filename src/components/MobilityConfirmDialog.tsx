import { Calendar as CalendarIcon, MapPin, Clock, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

export interface MobilityPendingBooking {
  title: string;
  itemName: string;
  location: string;
  date: string;
  time: string;
  /** Total estimated cost in EUR. If undefined, no price line is shown. */
  totalCost?: number;
  /** Optional breakdown text, e.g. "2u × €2/u" */
  costBreakdown?: string;
}

interface Props {
  pending: MobilityPendingBooking | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const MobilityConfirmDialog = ({ pending, onCancel, onConfirm }: Props) => {
  const { t } = useLanguage();
  const open = pending !== null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogTitle className="font-display text-lg font-extrabold text-accent">
          {t("confirmMobilityBooking")}
        </DialogTitle>
        <DialogDescription>
          {t("confirmMobilityBookingDesc")}
        </DialogDescription>

        {pending && (
          <div className="mt-1 space-y-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-display text-sm font-bold text-foreground">{pending.title}</p>
              <p className="text-xs text-muted-foreground">{pending.itemName}</p>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                  <span>{pending.date}{pending.time ? ` · ${pending.time}` : ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{pending.location}</span>
                </div>
                {pending.costBreakdown && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{pending.costBreakdown}</span>
                  </div>
                )}
              </div>
            </div>

            {typeof pending.totalCost === "number" && (
              <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Receipt className="h-4 w-4 text-mobility-blue" />
                  {t("totalEstimated")}
                </div>
                <span className="font-display text-lg font-extrabold text-mobility-blue">
                  €{pending.totalCost.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-2 flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full rounded-xl bg-primary py-3 font-display text-sm font-bold text-primary-foreground"
          >
            {t("confirmBooking")}
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-xl border border-border bg-card py-2.5 text-sm font-semibold text-muted-foreground"
          >
            {t("cancel")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobilityConfirmDialog;
