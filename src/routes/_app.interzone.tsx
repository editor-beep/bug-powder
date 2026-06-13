import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ROOMS } from "@/lib/rooms";
import { useInterzone } from "@/lib/store";
import { generateInteractionResponse } from "@/lib/proceduralText";
import { clack } from "@/lib/audio";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/interzone")({
  component: InterzonePage,
  head: () => ({ meta: [{ title: "Interzone Explorer" }] }),
});

function InterzonePage() {
  const descent = useInterzone(s => s.descent);
  const unlockMutation = useInterzone(s => s.unlockMutation);
  const pushHallucination = useInterzone(s => s.pushHallucination);
  const pushSurveillance = useInterzone(s => s.pushSurveillance);
  const [current, setCurrent] = useState<string>("entry");
  const [roomResponse, setRoomResponse] = useState<string | null>(null);
  const room = ROOMS[current];

  const go = (to: string, mutation?: string, paranoia?: number) => {
    clack();
    if (mutation) unlockMutation(mutation);
    if (paranoia && paranoia > 0) {
      pushSurveillance(`Subject crossed threshold at "${room.title}". Paranoia +${paranoia}.`, "MEDIUM");
    }
    pushHallucination(`[INTERZONE · ${room.title}] ${room.body.slice(0, 120)}...`);
    const next = ROOMS[to] ?? ROOMS.entry;
    if (next.requiresDescent && descent < next.requiresDescent) {
      pushSurveillance(`Access denied: "${next.title}" requires descent ${next.requiresDescent}.`, "HIGH");
      setCurrent("corridor");
      return;
    }
    setRoomResponse(null);
    setCurrent(to);
  };

  const probeRoom = () => {
    clack();
    const response = generateInteractionResponse(room.title, descent, useInterzone.getState().paranoia);
    setRoomResponse(response);
    pushHallucination(`[FIELD PROBE · ${room.title}] ${response}`);
    if (Math.random() > 0.55) {
      pushSurveillance(`Unscheduled environmental probe recorded at “${room.title}”.`, descent >= 6 ? "HIGH" : "MEDIUM");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-iz-vein font-mono">Interzone Explorer</p>
        <h1 className="font-display text-2xl sm:text-3xl text-iz-bone iz-glitch-text mt-1">Wander, Citizen.</h1>
      </header>

      <AnimatePresence mode="wait">
        <motion.article
          key={room.slug}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: 0.6 }}
          className="bg-iz-void/70 border border-iz-vein p-6 sm:p-8 iz-vignette"
        >
          <h2 className="font-display text-xl text-iz-pus mb-4 iz-glitch-text">{room.title}</h2>
          <p className="text-iz-bone font-mono leading-relaxed text-sm sm:text-base mb-8 iz-melt">
            {room.body}
          </p>
          <AnimatePresence mode="wait">
            {roomResponse && (
              <motion.aside
                key={roomResponse}
                initial={{ opacity: 0, filter: "blur(7px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                className="mb-5 border-l-2 border-iz-pus bg-iz-ink/50 px-4 py-3 text-xs leading-relaxed text-iz-pus font-mono"
              >
                {roomResponse}
              </motion.aside>
            )}
          </AnimatePresence>
          <div className="space-y-2">
            {room.choices.map((c, idx) => (
              <motion.button
                key={idx}
                whileHover={{ x: 4 }}
                onClick={() => go(c.to, c.mutation, c.paranoia)}
                className="w-full text-left px-4 py-3 border border-iz-vein hover:border-iz-blood bg-iz-ink/40 hover:bg-iz-blood/15 text-iz-bone font-mono text-sm transition-all group"
              >
                <span className="text-iz-blood mr-2">»</span>
                <span className="group-hover:text-iz-pus transition-colors">{c.label}</span>
              </motion.button>
            ))}
            <Button
              type="button"
              variant="ghost"
              onClick={probeRoom}
              className="mt-3 w-full rounded-none border border-dashed border-iz-vein text-xs uppercase tracking-widest text-muted-foreground hover:border-iz-pus hover:bg-iz-vein/20 hover:text-iz-pus"
            >
              Probe the room for unauthorized activity
            </Button>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
