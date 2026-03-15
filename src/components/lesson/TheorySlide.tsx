"use client";

import { motion } from "framer-motion";
import type { TheoryBlock } from "@/lib/types/app";

interface TheorySlideProps {
  block: TheoryBlock;
}

export function TheorySlide({ block }: TheorySlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-white leading-snug">{block.heading}</h2>
      {block.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.image_url}
          alt={block.heading}
          className="w-full rounded-xl object-cover max-h-48"
        />
      )}
      <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">{block.body}</p>
    </motion.div>
  );
}
