import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  duration: string;
  icon: LucideIcon;
  onClick: () => void;
  delay?: number;
}

export function ToolCard({ title, description, duration, icon: Icon, onClick, delay = 0 }: ToolCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full p-5 rounded-2xl card-ocean border border-border/40 text-left transition-gentle hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.99]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <p className="text-xs text-primary/70 mt-2 font-medium">{duration}</p>
        </div>
      </div>
    </motion.button>
  );
}
