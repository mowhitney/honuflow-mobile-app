import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = "Back" }: BackButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 text-sand-muted hover:text-sand transition-gentle p-2 -ml-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileTap={{ scale: 0.97 }}
    >
      <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
}
