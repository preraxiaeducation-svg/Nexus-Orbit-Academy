import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StarField } from "@/components/ui/StarField";
import { NovaAI } from "@/components/chatbot/NovaAI";
import { ACADEMY_NAME, ICON_LOGO_PATH, SQUARE_LOGO_PATH } from "@/config/branding";
import { buildMetadata, defaultViewport, siteConfig } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: ACADEMY_NAME,
  description:
    "Explore aerospace engineering, AI, machine learning, space technology, astronomy, and future learning at Nexus Orbit Academy.",
  path: "/",
  keywords: ["online STEM education", "future technology academy"],
  images: [{ url: SQUARE_LOGO_PATH, width: 1200, height: 630, alt: ACADEMY_NAME }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    images: [{ url: SQUARE_LOGO_PATH, width: 1200, height: 630, alt: ACADEMY_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nexusorbit",
    site: "@nexusorbit",
  },
});

export const viewport = defaultViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.language}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Exo+2:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href={ICON_LOGO_PATH} sizes="48x48" />
        <link rel="apple-touch-icon" href={SQUARE_LOGO_PATH} />
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
      </head>
      <body className="antialiased">
        <StarField />
        <div className="nebula-blob nebula-1" />
        <div className="nebula-blob nebula-2" />
        <div className="nebula-blob nebula-3" />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <NovaAI />
      </body>
    </html>
  );
}
