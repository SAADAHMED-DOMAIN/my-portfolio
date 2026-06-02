import Image from "next/image";
import FadeInView from "@/components/ui/FadeInView";

const highlights = [
  { value: "1+", label: "Years in Automation" },
  { value: "1+", label: "Systems Engineered" },
  { value: "90%", label: "Cost Reduction" },
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
                <Image
                  src="/Profilepicture.png"
                  alt="Saad Ahmed — Automation Engineer"
                  width={400}
                  height={400}
                  priority={false}
                  className="object-cover object-center transition-all duration-700 w-full h-full"
                />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[var(--color-electric-blue)]/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-[var(--color-electric-blue)]/05 rounded-full blur-3xl -z-10" />
          </FadeInView>

          {/* Content */}
          <FadeInView direction="right" delay={0.25} className="flex flex-col gap-5">
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Automation Engineer and Systems Architect specializing in agentic RPA pipelines, distributed infrastructure orchestration, and production-grade LLM integration. I operate at the intersection of intelligent automation, DevOps, and scalable systems design.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              I bring startup-grade engineering quality to every project — clean architecture, robust infrastructure practices, and zero-downtime deployments. From LLM routers to ETL pipelines, I build systems that work reliably at scale with 99.9% uptime.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              Currently pursuing a Bachelor of Technology in Computer Science Engineering (2024-28) and available for freelance automation contracts and systems engineering roles. Based in India, working globally.
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
