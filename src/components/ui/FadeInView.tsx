"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInViewProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  once?: boolean;
}

export default function FadeInView({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
}: FadeInViewProps) {
  const dirMap = {
    up: { y: 24, x: 0 },
    left: { x: -24, y: 0 },
    right: { x: 24, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...dirMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
