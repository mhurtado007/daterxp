"use client";

import { motion, AnimatePresence } from "framer-motion";

interface XPBurstProps {
  amount: number;
  show: boolean;
}

export function XPBurst({ amount, show }: XPBurstProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-1/3 right-8 pointer-events-none z-50"
          initial={{ opacity: 1, y: 0, scale: 0.8 }}
          animate={{ opacity: 0, y: -80, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div
            className="px-4 py-2 rounded-full font-bold text-lg text-white"
            style={{
              background: "linear-gradient(135deg, #ff4444, #ff1a1a)",
              boxShadow: "0 0 20px rgba(255,26,26,0.7)",
            }}
          >
            +{amount} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
