import FadeInView from "@/components/ui/FadeInView";
import SkillsGlobe from "@/components/ui/SkillsGlobe";

export default function TechStack() {
  return (
    <section id="stack" className="py-24 relative border-y border-white/[0.06]" style={{ background: "rgba(17,17,20,0.5)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <FadeInView className="mb-14 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Technical <span className="text-gradient">Arsenal</span>
          </h2>
          <div className="w-20 h-1 bg-[var(--color-electric-blue)] rounded-full mx-auto" />
          <p className="mt-4 text-gray-500 text-sm max-w-md mx-auto">
            Tools and technologies I use to build production-grade automation pipelines and systems.
          </p>
        </FadeInView>

        <FadeInView delay={0.15}>
          <SkillsGlobe />
        </FadeInView>
      </div>
    </section>
  );
}
