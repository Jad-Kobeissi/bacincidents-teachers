"use client";
import { motion } from "motion/react";
export default function LoadingComp({ className }: { className?: string }) {
  return (
    <div>
      <motion.h1
        className={`text-[1.2rem] ${className}`}
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ repeatType: "loop", repeat: Infinity }}
      >
        Loading...
      </motion.h1>
    </div>
  );
}
