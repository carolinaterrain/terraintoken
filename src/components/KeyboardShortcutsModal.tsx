import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glass-card";
import { Music, Volume2, VolumeX, ArrowUp, ArrowDown, Command, Sparkles } from "lucide-react";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KeyboardShortcutsModal = ({ open, onOpenChange }: KeyboardShortcutsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-bold">
            Keyboard <span className="text-primary">Shortcuts</span>
          </DialogTitle>
          <DialogDescription>
            Power user? Here are all the keyboard shortcuts to navigate TerrainToken like a pro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Audio Controls */}
          <section>
            <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" />
              Audio Controls
            </h3>
            <GlassCard className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <kbd className="px-3 py-1 bg-card rounded border border-primary/20 font-mono text-sm">Space</kbd>
                    <span className="text-muted-foreground">Play / Pause music</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <kbd className="px-3 py-1 bg-card rounded border border-primary/20 font-mono text-sm">M</kbd>
                    <span className="text-muted-foreground">Mute / Unmute</span>
                  </div>
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <kbd className="px-3 py-1 bg-card rounded border border-primary/20 font-mono text-sm">↑</kbd>
                    <span className="text-muted-foreground">Volume up (+10%)</span>
                  </div>
                  <ArrowUp className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <kbd className="px-3 py-1 bg-card rounded border border-primary/20 font-mono text-sm">↓</kbd>
                    <span className="text-muted-foreground">Volume down (-10%)</span>
                  </div>
                  <ArrowDown className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <kbd className="px-2 py-1 bg-card rounded border border-primary/20 font-mono text-xs">Ctrl</kbd>
                      <span className="text-muted-foreground">+</span>
                      <kbd className="px-2 py-1 bg-card rounded border border-primary/20 font-mono text-xs">M</kbd>
                    </div>
                    <span className="text-muted-foreground">Toggle audio settings</span>
                  </div>
                  <Volume2 className="w-4 h-4 text-primary" />
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Easter Eggs */}
          <section>
            <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Easter Eggs
            </h3>
            <GlassCard className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Type:</span>
                    <kbd className="px-3 py-1 bg-card rounded border border-primary/20 font-mono text-sm">VIBE</kbd>
                  </div>
                  <span className="text-xs text-muted-foreground">Auto-play music + confetti</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Type:</span>
                    <kbd className="px-3 py-1 bg-card rounded border border-primary/20 font-mono text-sm">DRAIN</kbd>
                  </div>
                  <span className="text-xs text-muted-foreground">Screen tilt animation</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Click mascot</span>
                    <kbd className="px-3 py-1 bg-card rounded border border-primary/20 font-mono text-sm">5x</kbd>
                  </div>
                  <span className="text-xs text-muted-foreground">Unlock special badge</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Double-click token stats</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Show hidden metrics</span>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* General Navigation */}
          <section>
            <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <Command className="w-5 h-5 text-primary" />
              General
            </h3>
            <GlassCard className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <kbd className="px-3 py-1 bg-card rounded border border-primary/20 font-mono text-sm">?</kbd>
                    <span className="text-muted-foreground">Show this help modal</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Pro Tip */}
          <GlassCard className="p-4 bg-primary/10 border-primary/30">
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">Pro Tip:</strong> Try typing easter egg keywords anywhere on the site—even while browsing different pages. The goblin is always watching... 🧙‍♂️
            </p>
          </GlassCard>
        </div>
      </DialogContent>
    </Dialog>
  );
};
