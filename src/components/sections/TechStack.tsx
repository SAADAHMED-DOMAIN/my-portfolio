import FadeInView from "@/components/ui/FadeInView";

const categories = [
  {
    label: "Smart Contracts",
    techs: ["Solidity", "Foundry", "Hardhat", "OpenZeppelin"],
  },
  {
    label: "Web3 Libraries",
    techs: ["Ethers.js", "viem", "Wagmi", "The Graph"],
  },
  {
    label: "Frontend",
    techs: ["Next.js", "React", "TypeScript", "TailwindCSS"],
  },
  {
    label: "Backend & Infra",
    techs: ["Node.js", "MongoDB", "Docker", "IPFS"],
  },
];

const allTechs = [
  { name: "Solidity", cat: "Smart Contracts" },
  { name: "Foundry", cat: "Web3 Tools" },
  { name: "Hardhat", cat: "Web3 Tools" },
  { name: "OpenZeppelin", cat: "Libraries" },
  { name: "Ethers.js", cat: "Web3 Library" },
  { name: "viem", cat: "Web3 Library" },
  { name: "Wagmi", cat: "Web3 Hooks" },
  { name: "The Graph", cat: "Indexing" },
  { name: "Next.js", cat: "Frontend" },
  { name: "React", cat: "Frontend" },
  { name: "TypeScript", cat: "Language" },
  { name: "TailwindCSS", cat: "Styling" },
  { name: "Node.js", cat: "Backend" },
  { name: "MongoDB", cat: "Database" },
  { name: "IPFS", cat: "Storage" },
  { name: "Docker", cat: "DevOps" },
];

export default function TechStack() {
  return (
    <section id="stack" className="py-24 relative border-y border-white/[0.06]" style={{ background: "rgba(17,17,20,0.5)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <FadeInView className="mb-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Technical <span className="text-gradient">Arsenal</span>
          </h2>
          <div className="w-20 h-1 bg-[var(--color-electric-blue)] rounded-full mx-auto" />
        </FadeInView>
        <FadeInView delay={0.1} className="mb-14 text-center">
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Tools and technologies I use to ship production-grade Web3 applications.
          </p>
        </FadeInView>

        {/* Category grouping */}
        <FadeInView delay={0.15} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {categories.map((cat) => (
            <div key={cat.label} className="glass rounded-2xl border border-white/[0.06] p-5">
              <p className="text-xs font-semibold text-[var(--color-electric-blue-light)] uppercase tracking-widest mb-4">{cat.label}</p>
              <div className="flex flex-col gap-2">
                {cat.techs.map((t) => (
                  <span key={t} className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--color-electric-blue)] shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </FadeInView>

        {/* Tag cloud for remaining */}
        <FadeInView delay={0.2} className="flex flex-wrap gap-2 justify-center">
          {allTechs.map((tech) => (
            <span
              key={tech.name}
              className="px-3 py-1.5 glass rounded-lg border border-white/[0.06] hover:border-[rgba(37,99,235,0.3)] text-sm text-gray-400 hover:text-white transition-all duration-150 cursor-default"
            >
              {tech.name}
            </span>
          ))}
        </FadeInView>
      </div>
    </section>
  );
}
