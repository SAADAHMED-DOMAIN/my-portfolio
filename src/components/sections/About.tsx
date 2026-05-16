import FadeInView from "@/components/ui/FadeInView";

const highlights = [
  { value: "2+", label: "Years in Web3" },
  { value: "10+", label: "dApps Built" },
  { value: "200+", label: "Project Tested" },
];

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <FadeInView className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-20 h-1 bg-[var(--color-electric-blue)] rounded-full" />
        </FadeInView>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <FadeInView direction="left" delay={0.15} className="relative">
            <div className="aspect-square max-w-sm mx-auto lg:mx-0 relative rounded-2xl overflow-hidden glass p-1.5">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-electric-blue)]/15 to-transparent z-10 rounded-2xl pointer-events-none" />
              <div className="w-full h-full bg-[var(--color-charcoal)] rounded-xl overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/profile.jpg"
                  alt="Faijan Anwar — Blockchain Developer"
                  className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 w-full h-full"
                />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[var(--color-electric-blue)]/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-[var(--color-electric-blue)]/05 rounded-full blur-3xl -z-10" />
          </FadeInView>

          {/* Content */}
          <FadeInView direction="right" delay={0.25} className="flex flex-col gap-5">
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Passionate Blockchain Developer focused on building scalable Web3 products and secure smart contract systems. I operate at the intersection of cryptography, distributed systems, and user experience.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              I bring startup-grade engineering quality to every project — clean architecture, robust security practices, and frictionless user experiences. From DeFi protocols to DAO governance, I build products that work reliably at scale.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              Currently available for freelance contracts, audits, and full-time Web3 roles. Based in India, working globally.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
              {highlights.map((item) => (
                <div key={item.label} className="glass p-4 rounded-xl border border-white/[0.06] text-center">
                  <p className="text-2xl font-bold font-display text-white mb-0.5">{item.value}</p>
                  <p className="text-xs text-gray-500 leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}
