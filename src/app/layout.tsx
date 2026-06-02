import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BfCacheProvider from "@/components/ui/BfCacheProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
  weight: ["600", "700", "800"],
});

const siteUrl = "https://saadahmed.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Saad Ahmed | Automation Engineer & Systems Architect",
    template: "%s | Saad Ahmed",
  },
  description:
    "Saad Ahmed is an Automation Engineer and Systems Architect specializing in agentic RPA pipelines, distributed infrastructure orchestration, and production-grade LLM integrations.",
  keywords: [
    "Automation Engineer",
    "Systems Architect",
    "RPA Pipelines",
    "LLM Integration",
    "Docker",
    "Kubernetes",
    "DevOps",
    "Nginx",
    "TypeScript",
    "Python",
    "Saad Ahmed",
    "India",
  ],
  authors: [{ name: "Saad Ahmed", url: siteUrl }],
  creator: "Saad Ahmed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Saad Ahmed — Automation Engineer & Systems Architect",
    title: "Saad Ahmed | Automation Engineer & Systems Architect",
    description:
      "Building agentic RPA pipelines, distributed infrastructure, and production-grade LLM integrations. Available for contracts and full-time roles.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Saad Ahmed — Automation Engineer & Systems Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saad Ahmed | Automation Engineer & Systems Architect",
    description:
      "Building agentic RPA pipelines, distributed infrastructure, and production-grade LLM integrations.",
    images: ["/og-image.jpg"],
    creator: "@saad_ahmed",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--color-matte-black)] text-[#f0f1f5] antialiased overflow-x-hidden">
        <Navbar />
        <BfCacheProvider>
          <main className="flex flex-col min-h-screen">
            {children}
          </main>
        </BfCacheProvider>
        <Footer />
      </body>
    </html>
  );
}
