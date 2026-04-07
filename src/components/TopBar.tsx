import { Menu } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";

interface TopBarProps {
  onHomeClick: () => void;
  showMenu?: boolean;
}

const TopBar = ({ onHomeClick, showMenu = true }: TopBarProps) => {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-2">
      <LanguageToggle />
      <button
        onClick={onHomeClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-muted"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TopBar;
