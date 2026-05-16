"use client";

import FadeInView from "@/components/ui/FadeInView";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";

const projects = [
  {
    title: "Decentralized Crowdfunding Platform",
    description: "Transparent, milestone-based crowdfunding where backers vote on fund releases. Smart contracts ensure trustless fund management with full on-chain transparency.",
    tech: ["Solidity", "Next.js", "Hardhat", "Ethers.js", "The Graph"],
    github: "https://github.com/FAIJANANWAR/decentralized-crowdfunding-platform",
    live: "https://decentralized-crowdfunding-platform-umber.vercel.app/",
    highlight: true,
    status: "Live",
  },
  {
    title: "NFT Marketplace Protocol",
    description: "Fully decentralized marketplace for minting, buying, and selling ERC721 tokens with zero-fee listing architecture and IPFS-stored metadata.",
    tech: ["Solidity", "React", "IPFS", "Foundry", "Alchemy"],
    github: "https://github.com/FAIJANANWAR/dao-governance-system",
    live: "https://dao-governance-system-dao-governanc-flax.vercel.app/",
    highlight: true,
    status: "Live",
  },
  {
    title: "DAO Governance System",
    description: "On-chain governance platform using ERC20 votes for proposal creation and execution with timelocks. Full voting dashboard with quorum tracking.",
    tech: ["Solidity", "TypeScript", "Next.js", "OpenZeppelin", "viem"],
    github: "https://github.com/FAIJANANWAR/dao-governance-system",
    live: "https://dao-governance-system-dao-governanc-flax.vercel.app/",
    highlight: false,
    status: "Live",
  },
  {
    title: "Crypto Portfolio Tracker",
    description: "Multi-chain wallet analytics dashboard with real-time price feeds, historical performance charts, and DeFi position tracking across chains.",
    tech: ["Next.js", "TypeScript", "Chart.js", "Moralis", "CoinGecko API"],
    github: "#",
    live: "#",
    highlight: false,
    status: "In Progress",
  },
  {
    title: "Web3 Freelance Escrow",
    description: "Trustless milestone-based payment system for freelancers and clients. Approval-based fund release with basic dispute resolution logic on-chain.",
    tech: ["Solidity", "Hardhat", "React", "Node.js", "Arbitrum"],
    github: "#",
    live: "#",
    highlight: false,
    status: "In Progress",
  },
  {
    title: "Web3 Airdrop Campaign Manager",
    description: "Automated token distribution platform with Merkle tree airdrops for scalable, gas-efficient claims, snapshot integration and eligibility checking.",
    tech: ["Solidity", "Next.js", "MerkleTree.js", "Ethers.js", "Wagmi"],
    github: "#",
    live: "#",
    highlight: false,
    status: "In Progress",
  },
];

const statusColors: Record<string, string> = {
  Live: "bg-green-500/10 text-green-400 border-green-500/20",
  "In Progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <FadeInView className="mb-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-[var(--color-electric-blue)] rounded-full mx-auto" />
        </FadeInView>
        <FadeInView delay={0.1} className="mb-14 text-center">
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            A selection of Web3 projects spanning DeFi, NFTs, and DAO infrastructure — each built with production-grade security in mind.
          </p>
        </FadeInView>

        {/* First two projects — full-width feature cards */}
        <div className="flex flex-col gap-6 mb-6">
          {projects.filter((p) => p.highlight).map((project, index) => (
            <FadeInView
              key={project.title}
              delay={index * 0.08}
              className="group glass rounded-2xl border border-white/[0.06] hover:border-[rgba(37,99,235,0.28)] transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">{project.title}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="px-2.5 py-1 bg-[rgba(37,99,235,0.08)] text-[var(--color-electric-blue-light)] text-xs rounded-lg border border-[rgba(37,99,235,0.15)] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right — actions */}
                  <div className="flex md:flex-col gap-3 md:gap-2 md:min-w-[130px] md:items-end md:justify-start">
                    {project.github !== "#" && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                      >
                        <FiGithub className="w-3.5 h-3.5" /> Source Code
                      </a>
                    )}
                    {project.live !== "#" && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 bg-[var(--color-electric-blue)] hover:bg-[var(--color-electric-blue-hover)] rounded-lg transition-all glow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>

        {/* Remaining projects — grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.filter((p) => !p.highlight).map((project, index) => (
            <FadeInView
              key={project.title}
              delay={0.15 + index * 0.06}
              className="group glass rounded-2xl border border-white/[0.06] hover:border-[rgba(37,99,235,0.25)] transition-all duration-300 p-6 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-base font-bold font-display text-white leading-snug">{project.title}</h3>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tech.slice(0, 4).map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-md border border-white/[0.06]">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/[0.06]">
                {project.github !== "#" ? (
                  <a href={project.github} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                    <FiGithub className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="text-gray-700 cursor-not-allowed">
                    <FiGithub className="w-4 h-4" />
                  </span>
                )}
                {project.live !== "#" ? (
                  <a href={project.live} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors ml-auto">
                    Live <ArrowUpRight className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-gray-700 ml-auto">Private</span>
                )}
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
