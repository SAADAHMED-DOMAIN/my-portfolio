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

const siteUrl = "https://faijan.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Faijan Anwar | Blockchain Developer & Smart Contract Engineer",
    template: "%s | Faijan Anwar",
  },
  description:
    "Faijan Anwar is a Blockchain Developer and Smart Contract Engineer building secure DeFi protocols, scalable dApps, and frictionless Web3 experiences. Available for freelance and full-time opportunities.",
  keywords: [
    "Blockchain Developer",
    "Smart Contract Engineer",
    "Solidity Developer",
    "Web3 Developer",
    "DeFi Developer",
    "NFT Marketplace",
    "DAO Governance",
    "Ethereum Developer",
    "Hardhat",
    "Foundry",
    "Next.js",
    "Faijan Anwar",
    "India",
  ],
  authors: [{ name: "Faijan Anwar", url: siteUrl }],
  creator: "Faijan Anwar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Faijan Anwar — Blockchain Developer",
    title: "Faijan Anwar | Blockchain Developer & Smart Contract Engineer",
    description:
      "Building secure DeFi protocols, NFT marketplaces, DAO systems, and scalable Web3 experiences. Available for Web3 contracts and full-time roles.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Faijan Anwar — Blockchain Developer & Smart Contract Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faijan Anwar | Blockchain Developer",
    description:
      "Building secure DeFi protocols, NFT marketplaces, and scalable Web3 apps.",
    images: ["/og-image.jpg"],
    creator: "@faijananwar",
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
