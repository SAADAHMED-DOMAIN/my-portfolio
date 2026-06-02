import Link from "next/link";
import { FiGithub, FiLinkedin, FiInstagram } from "react-icons/fi";

const socialLinks = [
  { icon: FiGithub, href: "https://github.com/SAADAHMED-DOMAIN", label: "GitHub", hoverColor: "hover:text-white" },
  { icon: FiLinkedin, href: "https://www.linkedin.com/in/saad-undefined-b29333413/", label: "LinkedIn", hoverColor: "hover:text-[#0a66c2]" },
  { icon: FiInstagram, href: "https://www.instagram.com/saadwithahmed/", label: "Instagram", hoverColor: "hover:text-pink-400" },
];

const footerLinks = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-matte-black)] border-t border-white/[0.06] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Link href="/" className="font-display text-xl font-bold tracking-tight text-white">
              Saad Ahmed
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Automation Engineer & Systems Architect building agentic RPA pipelines and intelligent infrastructure.
            </p>
            <div className="flex gap-3 mt-1">
              {socialLinks.map(({ icon: Icon, href, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={`w-8 h-8 flex items-center justify-center text-gray-500 ${hoverColor} rounded-lg hover:bg-white/5 transition-all duration-150`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Navigate</p>
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Contact quick links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Contact</p>
            <a href="mailto:wynorifik@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors">wynorifik@gmail.com</a>
            <a href="tel:+919549954674" className="text-sm text-gray-400 hover:text-white transition-colors">+91 95499 54674</a>
            <span className="text-sm text-gray-600">India</span>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <p>© {currentYear} Saad Ahmed. All rights reserved.</p>
          <p>Automation Engineer &bull; Systems Architect</p>
        </div>
      </div>
    </footer>
  );
}
