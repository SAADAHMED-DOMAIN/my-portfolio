import FadeInView from "@/components/ui/FadeInView";
import { ShieldCheck, Cpu, Code as Code2, ArrowRight } from "lucide-react";

const services = [
  {
    Icon: ShieldCheck,
    title: "Smart Contract Auditing",
    subtitle: "Security & QA",
    description: "Thorough Solidity audits to uncover vulnerabilities, optimize gas costs, and ensure your protocol is mainnet-ready.",
    bullets: ["Reentrancy & overflow checks", "Access control review", "Gas optimization", "Audit report delivery"],
  },
  {
    Icon: Cpu,
    title: "DeFi Protocol Design",
    subtitle: "Architecture",
    description: "End-to-end design of DeFi mechanisms — AMMs, staking, yield farming, and liquidity pools with sound tokenomics.",
    bullets: ["Protocol architecture", "Tokenomics modeling", "MEV protection", "Mainnet deployment"],
  },
  {
    Icon: Code2,
    title: "Full-Stack dApp Dev",
    subtitle: "Web3 Engineering",
    description: "Production-grade decentralized applications from smart contracts to polished React/Next.js frontends.",
    bullets: ["Smart contract development", "Wallet & chain integration", "Responsive Web3 UI", "Ongoing maintenance"],
  },
];

export default function Services() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <FadeInView className="mb-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Core <span className="text-gradient">Expertise</span>
          </h2>
          <div className="w-20 h-1 bg-[var(--color-electric-blue)] rounded-full mx-auto" />
        </FadeInView>
        <FadeInView delay={0.1} className="mb-14 text-center">
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Services I provide to Web3 projects, startups, and protocols looking to build and ship faster.
          </p>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <FadeInView
              key={service.title}
              delay={index * 0.1}
              className="group glass rounded-2xl border border-white/[0.06] hover:border-[rgba(37,99,235,0.28)] transition-all duration-300 p-6 sm:p-8 flex flex-col relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(37,99,235,0.04)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-[rgba(37,99,235,0.1)] border border-[rgba(37,99,235,0.2)] flex items-center justify-center mb-5">
                  <service.Icon className="w-5 h-5 text-[var(--color-electric-blue)]" />
                </div>

                <p className="text-xs font-semibold text-[var(--color-electric-blue-light)] uppercase tracking-widest mb-2">{service.subtitle}</p>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{service.description}</p>

                <ul className="flex flex-col gap-2 mb-6">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1 h-1 rounded-full bg-[var(--color-electric-blue)] shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-electric-blue-light)] hover:text-white transition-colors group/link"
                >
                  Get a quote <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
