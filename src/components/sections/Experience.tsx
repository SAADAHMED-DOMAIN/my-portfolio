import FadeInView from "@/components/ui/FadeInView";

const experiences = [
  {
    title: "Smart Contract Development",
    period: "2023 – Present",
    description: "Architecting and auditing secure smart contracts using Solidity, Foundry, and Hardhat. Implementing ERC standards, proxy patterns, and robust access controls for high-stakes decentralized applications.",
    tags: ["Solidity", "Foundry", "OpenZeppelin", "ERC Standards"],
  },
  {
    title: "Full-Stack Web3 Applications",
    period: "2022 – Present",
    description: "Building end-to-end dApps using Next.js, React, Ethers.js, and viem. Integrating wallet connections, off-chain indexing via The Graph, and seamless UX for on-chain interactions.",
    tags: ["Next.js", "Ethers.js", "viem", "Wagmi"],
  },
  {
    title: "DeFi Protocol Engineering",
    period: "2023 – 2024",
    description: "Developing AMMs, staking mechanisms, and yield farming protocols. Deep understanding of tokenomics, liquidity pool math, MEV protection, and protocol security.",
    tags: ["DeFi", "AMM", "Tokenomics", "MEV"],
  },
  {
    title: "Blockchain Research",
    period: "2022 – 2023",
    description: "Researching Layer 2 scaling solutions, Zero-Knowledge proofs (ZK-Rollups), and cross-chain interoperability protocols to reduce gas costs and improve throughput.",
    tags: ["L2", "ZK-Proofs", "Cross-chain", "Scaling"],
  },
  {
    title: "Open Source Contributions",
    period: "2021 – Present",
    description: "Active contributor to Web3 open-source projects, building developer tooling and publishing educational content for the blockchain community.",
    tags: ["Open Source", "Developer Tooling", "Education"],
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
