import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const StadiumHeader = () => {
  return (
    <header className="border-b border-border px-6 py-5 gradient-stadium">
      <div className="container mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 glow-green">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
              Arena<span className="text-primary">Hub</span>
            </h1>
            <p className="text-xs text-muted-foreground">Smart Stadium Infrastructure</p>
          </div>
        </motion.div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            Systems Online
          </span>
        </div>
      </div>
    </header>
  );
};

export default StadiumHeader;
