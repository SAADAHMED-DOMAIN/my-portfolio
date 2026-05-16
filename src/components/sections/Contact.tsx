"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSubmitting(true);
    setStatus("idle");

    const formData = new FormData(formRef.current);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("user_name"),
          email: formData.get("user_email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      if (res.ok) {
        setStatus("success");
        formRef.current.reset();
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
              Whether you need a smart contract audited, a DeFi protocol architected, or a full dApp built — I&apos;m here to help. Drop a message and I&apos;ll respond promptly.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { Icon: Mail, label: "Email", value: "hello@faijan.in", href: "mailto:hello@faijan.in" },
                { Icon: Phone, label: "Phone", value: "+91 70147 02263", href: "tel:7014702263" },
                { Icon: MapPin, label: "Location", value: "India", href: null },
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
                  <CheckCircle className="w-4 h-4 shrink-0" /> Message sent! I&apos;ll get back to you soon.
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Something went wrong. Please email me directly at hello@faijan.in
                </div>
              )}
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="glass rounded-2xl border border-white/[0.06] p-6 sm:p-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="user_name" className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">Full Name</label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    required
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="user_email" className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">Email Address</label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    required
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
                  className={inputClass}
                  placeholder="Smart contract audit, dApp development..."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
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
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
