import { ArrowLeft, Wifi, Monitor, Coffee, Tv, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { rooms } from "@/data/rooms";
import type { TranslationKey } from "@/contexts/LanguageContext";

interface RoomDetailViewProps {
  roomId: string;
  onBack: () => void;
  onBook: () => void;
}

const featureIcons: Record<string, React.ElementType> = {
  "Wi-Fi": Wifi,
  TV: Tv,
  Beamer: Monitor,
  Coffee: Coffee,
};

const featureTranslations: Record<string, TranslationKey> = {
  "Wi-Fi": "wifi",
  TV: "tv",
  Beamer: "projector",
  Coffee: "coffee",
};

const RoomDetailView = ({ roomId, onBack, onBook }: RoomDetailViewProps) => {
  const { t, lang } = useLanguage();
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return null;

  return (
    <div className="pb-24">
      <button onClick={onBack} className="px-5 pt-6 text-muted-foreground">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <h2 className="mt-3 px-5 font-display text-lg font-extrabold text-accent uppercase">
        {room.name}
      </h2>

      <img
        src={room.image}
        alt={room.name}
        className="mt-4 h-48 w-full object-cover"
        width={800}
        height={512}
      />

      <div className="px-5 pt-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {lang === "nl" ? room.description_nl : room.description_en}
        </p>

        {/* Features */}
        <h3 className="mb-3 mt-5 font-display text-sm font-bold text-foreground">
          {t("features")}
        </h3>
        <div className="flex gap-4">
          {room.featureKeys.map((key) => {
            const Icon = featureIcons[key] || Wifi;
            const translationKey = featureTranslations[key];
            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {translationKey ? t(translationKey) : key}
                </span>
              </div>
            );
          })}
        </div>

        {/* Location */}
        <h3 className="mb-2 mt-5 font-display text-sm font-bold text-foreground">
          {t("location")}
        </h3>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">{t("stadiumEntrance")}</span>
        </div>

        <button
          onClick={onBook}
          className="mt-6 w-full rounded-xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground"
        >
          {t("bookThisRoom")}
        </button>
      </div>
    </div>
  );
};

export default RoomDetailView;