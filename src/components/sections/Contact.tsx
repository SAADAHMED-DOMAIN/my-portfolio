"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  const inputClass =
    "w-full bg-[var(--color-matte-black)] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--color-electric-blue)] focus:border-[var(--color-electric-blue)] transition-all duration-150";

  return (
    <section id="contact" className="py-24 relative border-t border-white/[0.06]" style={{ background: "rgba(17,17,20,0.5)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-[var(--color-electric-blue)] rounded-full mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left info panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2 flex flex-col justify-center"
          >
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-4">
              Let&apos;s build something great together
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Whether you need an automation pipeline designed, infrastructure orchestrated, or an LLM integration built — I&apos;m here to help. Drop a message and I&apos;ll respond promptly.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { Icon: Mail, label: "Email", value: "wynorifik@gmail.com", href: "mailto:wynorifik@gmail.com" },
                { Icon: Phone, label: "Phone", value: "+91 95499 54674", href: "tel:+919549954674" },
                { Icon: MapPin, label: "Location", value: "Jaipur, India", href: null },
              ].map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(37,99,235,0.08)] border border-[rgba(37,99,235,0.15)] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[var(--color-electric-blue)]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm text-white hover:text-[var(--color-electric-blue-light)] transition-colors font-medium">{value}</a>
                    ) : (
                      <p className="text-sm text-white font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-3"
          >
            {/* Toast notifications */}
            <div className="mb-4 min-h-[2.5rem]">
              {status === "success" && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" /> Thank you! Your message has been sent successfully.
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Something went wrong. Please email me directly at wynorifik@gmail.com
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/[0.06] p-6 sm:p-8 flex flex-col gap-5">
              {/* Anti-Spam Honeypot Field */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="absolute opacity-0 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Automation pipeline, infrastructure setup, LLM integration..."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell me about your project or what you need help with..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--color-electric-blue)] hover:bg-[var(--color-electric-blue-hover)] text-white rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed glow"
              >
                {isSubmitting ? (
                  <>Sending... <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /></>
                ) : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
