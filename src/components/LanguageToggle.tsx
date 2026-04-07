import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full bg-secondary p-0.5">
      <button
        onClick={() => setLang("nl")}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
          lang === "nl" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
        }`}
      >
        NL
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
          lang === "en" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
