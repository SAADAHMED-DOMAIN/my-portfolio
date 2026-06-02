export interface Skill {
  name: string;
  slug: string;
  url: string;
  category: string;
  color: string; // Hex color (no #) for Simple Icons CDN rendering
  iconUrl?: string; // Optional custom icon URL (overrides CDN)
}

export const skills: Skill[] = [
  // Languages & Scripting
  { name: "JavaScript", slug: "javascript", url: "https://developer.mozilla.org/docs/Web/JavaScript", category: "Languages", color: "F7DF1E" },
  { name: "Python", slug: "python", url: "https://python.org", category: "Languages", color: "3776AB" },
  { name: "TypeScript", slug: "typescript", url: "https://typescriptlang.org", category: "Languages", color: "3178C6" },
  { name: "Bash", slug: "gnubash", url: "https://www.gnu.org/software/bash/", category: "Languages", color: "4EAA25" },
  // DevOps & Infrastructure
  { name: "Docker", slug: "docker", url: "https://docs.docker.com", category: "DevOps", color: "2496ED" },
  { name: "Kubernetes", slug: "kubernetes", url: "https://kubernetes.io/docs", category: "DevOps", color: "326CE5" },
  { name: "Nginx", slug: "nginx", url: "https://nginx.org", category: "DevOps", color: "009639" },
  { name: "Git", slug: "git", url: "https://git-scm.com/doc", category: "DevOps", color: "F05032" },
  { name: "GitHub Actions", slug: "githubactions", url: "https://docs.github.com/actions", category: "DevOps", color: "2088FF" },
  // Platforms & Database
  { name: "PostgreSQL", slug: "postgresql", url: "https://postgresql.org", category: "Database", color: "4169E1" },
  { name: "Redis", slug: "redis", url: "https://redis.io", category: "Database", color: "FF4438", iconUrl: "/icons/redis.svg" },
  { name: "Supabase", slug: "supabase", url: "https://supabase.com/docs", category: "Platform", color: "3FCF8E" },
  { name: "Node.js", slug: "nodedotjs", url: "https://nodejs.org", category: "Backend", color: "5FA04E" },
  // Frontend
  { name: "React", slug: "react", url: "https://react.dev", category: "Frontend", color: "61DAFB" },
  { name: "Next.js", slug: "nextdotjs", url: "https://nextjs.org/docs", category: "Frontend", color: "FFFFFF" },
  { name: "HTML5", slug: "html5", url: "https://developer.mozilla.org/docs/Web/HTML", category: "Frontend", color: "E34F26" },
  { name: "Tailwind CSS", slug: "tailwindcss", url: "https://tailwindcss.com", category: "Frontend", color: "06B6D4" },
  // Infrastructure & OS
  { name: "Linux", slug: "linux", url: "https://kernel.org", category: "OS", color: "FCC624" },
  { name: "Cloudflare", slug: "cloudflare", url: "https://developers.cloudflare.com", category: "Infrastructure", color: "F38020" },
  // Networking
  { name: "WireGuard", slug: "wireguard", url: "https://www.wireguard.com", category: "Networking", color: "88171A" },
  { name: "Tailscale", slug: "tailscale", url: "https://tailscale.com", category: "Networking", color: "FFFFFF" },
  // AI & Automation
  { name: "Skyvern", slug: "skyvern", url: "https://skyvern.com", category: "AI", color: "6C5CE7" },
  { name: "n8n", slug: "n8n", url: "https://n8n.io", category: "AI", color: "EA4B71" },
];
