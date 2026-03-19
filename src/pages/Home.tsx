import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Volume2, LayoutList } from "lucide-react";
import { SoundLibrary, FloatingMiniPlayer } from "@/components/SoundLibrary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HomeProps {
  onSelectTool: (tool: string) => void;
}

const greetings = [
  "That was a lot.",
  "You've been holding so much.",
  "You don't have to be strong here.",
  "Take a moment for yourself.",
  "You're allowed to pause.",
];

export function Home({ onSelectTool }: HomeProps) {
  const [soundLibraryOpen, setSoundLibraryOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const greeting = useMemo(() => greetings[Math.floor(Math.random() * greetings.length)], []);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col px-6 pt-safe-top relative z-10 pb-20 sm:pb-24">
      {/* Welcome section */}
      <motion.header
        className="pt-10 sm:pt-16 pb-6 text-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1.5 text-shadow-soft tracking-tight">
          {greeting}
        </h1>
        <p className="text-foreground/70 text-sm text-shadow-subtle">
          You can pause here.
        </p>
      </motion.header>

      {/* Main content - centered hero */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-8">
        {/* Calming orientation line */}
        <motion.p
          className="text-sm text-foreground/70 text-center mb-5 text-shadow-soft tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
          Start wherever feels easiest.
        </motion.p>

        {/* Primary hero button */}
        <motion.button
          onClick={() => onSelectTool("fiveminute")}
          className="group relative w-full max-w-xs py-6 sm:py-7 px-8 rounded-3xl hero-glass text-center mb-6"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(135deg, hsl(168 30% 60% / 0.15) 0%, transparent 50%, hsl(168 30% 60% / 0.1) 100%)",
            }}
          />
          <span className="relative block text-2xl font-semibold text-foreground mb-1.5 tracking-tight">
            5-minute reset
          </span>
          <span className="relative block text-sm text-muted-foreground tracking-wide">
            Breathe · Ground · Regulate
          </span>
        </motion.button>

        {/* After Euthanasia Reset - directly below hero */}
        <button
          onClick={() => onSelectTool("euthanasia")}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 py-2.5 px-6 rounded-full cta-secondary-glass"
        >
          After euthanasia reset
        </button>

      </main>

      {/* Sleek bottom navigation bar */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-safe-bottom"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="mx-6 sm:mx-8 mb-1 w-full max-w-[260px] sm:max-w-[280px] rounded-2xl bottom-bar-glass px-2 py-1.5 flex items-center justify-evenly gap-1">
          <button
            onClick={() => setSoundLibraryOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 px-5 rounded-xl text-foreground/60 hover:text-foreground transition-colors duration-300"
          >
            <Volume2 className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[11px] font-medium tracking-wide">Sound Library</span>
          </button>
          <button
            onClick={() => onSelectTool("regulate")}
            className="flex flex-col items-center gap-0.5 py-1 px-5 rounded-xl text-foreground/60 hover:text-foreground transition-colors duration-300"
          >
            <LayoutList className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[11px] font-medium tracking-wide">All Tools</span>
          </button>
        </div>
        <button
          onClick={() => setTermsOpen(true)}
          className="mb-3 text-[10px] text-foreground/25 hover:text-foreground/45 transition-colors duration-300"
        >
          Terms of Use
        </button>
      </motion.nav>

      {/* Sound Library Modal */}
      <SoundLibrary 
        isOpen={soundLibraryOpen} 
        onClose={() => setSoundLibraryOpen(false)} 
      />

      {/* Floating mini player - shows when sound is playing */}
      {!soundLibraryOpen && (
        <FloatingMiniPlayer onOpenLibrary={() => setSoundLibraryOpen(true)} />
      )}

      {/* Terms of Use Modal */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="card-glass border-foreground/10 max-w-md mx-auto max-h-[80vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-foreground text-lg font-semibold text-center">
              Terms of Use &amp; Intellectual Property
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="px-6 pb-6 max-h-[60vh]">
            <div className="space-y-5 text-sm text-foreground/80 leading-relaxed pr-3">
              <p>
                By accessing or using this application ("Honu Flow"), you agree to the following terms:
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Ownership</h3>
                <p>
                  All content within the App (Honu Flow) — including but not limited to text, audio, sound files, visuals, designs, workflows, exercises, prompts, and overall concept — is the intellectual property of the App (Honu Flow) creator and is protected by copyright and other applicable laws.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Permitted Use</h3>
                <p>
                  This App (Honu Flow) is provided for personal, internal use only. You may use the App (Honu Flow) for its intended purpose, but you may not copy, reproduce, distribute, modify, sell, license, or create derivative works from any part of the App (Honu Flow) without explicit written permission.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">No Transfer of Rights</h3>
                <p>
                  Access to or use of the App (Honu Flow) does not grant ownership or rights to the underlying content, ideas, or structure of the App (Honu Flow).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Restrictions</h3>
                <p className="mb-2">You agree not to:</p>
                <ul className="list-disc list-inside space-y-1 text-foreground/70">
                  <li>Share or distribute App (Honu Flow) content outside the App</li>
                  <li>Replicate the App's (Honu Flow) concept, tools, or structure for commercial or internal use</li>
                  <li>Provide App (Honu Flow) materials to third parties for development or duplication</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Changes &amp; Availability</h3>
                <p>
                  Features, content, and availability may change at any time, especially during beta testing.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
