"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stats = [
  { value: "2+", label: "Years in Web3" },
  { value: "15+", label: "dApps Built" },
  { value: "200+", label: "Contracts Tested" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[var(--color-electric-blue)] opacity-[0.07] blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[var(--color-electric-blue)] opacity-[0.04] blur-[110px] rounded-full" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 relative z-10 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Availability badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.08)] text-sm font-medium text-[var(--color-electric-blue-light)] tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Available for new opportunities
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold tracking-tight mb-6 font-display leading-[1.06]"
          >
            Building the Future
            <br />
            <span className="text-gradient">on the Blockchain</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-base sm:text-lg md:text-xl text-gray-400 mb-10 leading-relaxed"
          >
            Blockchain Developer & Smart Contract Engineer — crafting secure DeFi protocols,
            scalable dApps, and frictionless Web3 experiences that users actually love.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-16"
          >
            <Link
              href="#projects"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[var(--color-electric-blue)] hover:bg-[var(--color-electric-blue-hover)] text-white rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 glow hover:scale-[1.02] active:scale-100"
            >
              View My Work
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl font-semibold text-sm tracking-wide transition-all duration-200"
            >
              Get in Touch
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="w-full grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 py-4 px-2 glass rounded-2xl border border-white/5">
                <span className="text-2xl sm:text-3xl font-bold font-display text-white">{s.value}</span>
                <span className="text-xs text-gray-500 text-center leading-tight">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Fade out at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[var(--color-matte-black)] to-transparent pointer-events-none z-10" />
    </section>
  );
}
