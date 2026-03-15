"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getLevelTitle } from "@/lib/gamification/xp";
import { Trophy, X } from "lucide-react";

interface LevelUpModalProps {
  show: boolean;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpModal({ show, newLevel, onClose }: LevelUpModalProps) {
  const title = getLevelTitle(newLevel);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card rounded-3xl p-10 text-center max-w-sm w-full relative overflow-hidden"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Glow background */}
              <div className="absolute inset-0 bg-glow-red opacity-40 pointer-events-none" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Trophy */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
                    boxShadow: "0 0 30px rgba(255,26,26,0.6)",
                  }}
                >
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-red-400 text-sm font-medium uppercase tracking-widest mb-2"
              >
                Level Up!
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-4xl font-bold text-white mb-1"
              >
                Level {newLevel}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-gray-300 text-lg mb-8"
              >
                You&apos;re now a{" "}
                <span className="text-red-400 font-semibold">{title}</span>
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={onClose}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #ff2a2a, #cc0000)",
                  boxShadow: "0 0 16px rgba(255,26,26,0.4)",
                }}
              >
                Keep Going!
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
