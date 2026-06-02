import FadeInView from "@/components/ui/FadeInView";

const experiences = [
  {
    title: "Freelance Automation & Systems Engineer",
    period: "2026 – Present",
    description: "Developing configuration-driven LLM Routers that cut TTFT latency by up to 90% via semantic KV caching. Maximizing application uptime to 99.9% and reducing API costs by 50-90% by dynamically routing queries across model tiers.",
    tags: ["Python", "Docker", "Redis", "LiteLLM", "Nginx"],
  },
  {
    title: "Agentic ETL & Data Pipeline Engineering",
    period: "2025 – 2026",
    description: "Built 'Sieve', an agentic ETL data pipeline featuring webhook triggers, programmatic web scraping, asynchronous CRUD, universal conversion, and vision-language model OCR.",
    tags: ["Python", "n8n", "Skyvern", "PostgreSQL", "Docker"],
  },
  {
    title: "RAG & Conversational AI Systems",
    period: "2025",
    description: "Architected a custom knowledge-retrieval engine utilizing vector embeddings (RAG) to power an corporate chatbot, complete with a responsive Telegram Bot UI for real-time record lookup.",
    tags: ["LiteLLM", "Supabase", "Vector DB", "Telegram Bot API"],
  },
  {
    title: "Bachelor of Technology — Computer Science Engineering",
    period: "2024 – 2028",
    description: "Studying foundational and advanced computer science subjects. Completed Harvard's CS50: Introduction to Computer Science to master computational thinking, memory allocation, and data structures.",
    tags: ["C", "Python", "SQL", "Algorithms", "Harvard CS50"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative border-y border-white/[0.06]" style={{ background: "rgba(17,17,20,0.5)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <FadeInView className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Engineering <span className="text-gradient">Journey</span>
          </h2>
          <div className="w-20 h-1 bg-[var(--color-electric-blue)] rounded-full mx-auto" />
        </FadeInView>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-electric-blue)]/40 via-[var(--color-electric-blue)]/10 to-transparent" />

          <div className="flex flex-col gap-10">
            {experiences.map((exp, index) => (
              <FadeInView
                key={exp.title}
                direction="left"
                delay={index * 0.1}
                className="relative pl-12"
              >
                {/* Dot */}
                <div className="absolute left-0 top-1 w-8 h-8 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-matte-black)] border-2 border-[var(--color-electric-blue)] glow-sm" />
                </div>

                <div className="glass rounded-2xl border border-white/[0.06] hover:border-[rgba(37,99,235,0.2)] p-5 sm:p-6 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <h3 className="text-base sm:text-lg font-bold font-display text-white">{exp.title}</h3>
                    <span className="text-xs font-medium text-[var(--color-electric-blue-light)] shrink-0">{exp.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-[rgba(37,99,235,0.07)] text-gray-500 rounded-md border border-white/[0.06]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
