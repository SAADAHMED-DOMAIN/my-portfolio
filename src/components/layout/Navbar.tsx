"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FiGithub, FiLinkedin, FiInstagram } from "react-icons/fi";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Stack", href: "#stack" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(8,8,9,0.85)] backdrop-blur-xl border-b border-white/[0.06] py-3 shadow-[0_1px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-display text-[1.05rem] font-bold tracking-tight text-white flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[rgba(37,99,235,0.5)] group-hover:border-[var(--color-electric-blue)] transition-colors">
            <img src="/Profilepicture.png" alt="Saad Ahmed" className="object-cover w-full h-full" />
          </div>
          <span>Saad Ahmed</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-150"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/SAADAHMED-DOMAIN"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <FiGithub className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/saad-undefined-b29333413/"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#0a66c2] rounded-lg hover:bg-white/5 transition-all"
            >
              <FiLinkedin className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/saadwithahmed/"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-pink-400 rounded-lg hover:bg-white/5 transition-all"
            >
              <FiInstagram className="w-4 h-4" />
            </a>
          </div>
          <Link
            href="#contact"
            className="text-sm font-semibold px-4 py-2 bg-[var(--color-electric-blue)] hover:bg-[var(--color-electric-blue-hover)] text-white rounded-lg transition-all duration-150 glow-sm"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden md:hidden bg-[rgba(8,8,9,0.97)] backdrop-blur-xl border-b border-white/[0.06]"
          >
            <div className="flex flex-col px-4 pt-3 pb-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 flex gap-3 px-3">
                <a href="https://github.com/SAADAHMED-DOMAIN" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                  <FiGithub className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/saad-undefined-b29333413/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#0a66c2]">
                  <FiLinkedin className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/saadwithahmed/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-400">
                  <FiInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
