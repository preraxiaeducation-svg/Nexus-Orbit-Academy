import type { Metadata, Viewport } from "next";
import {
  ACADEMY_DESCRIPTION,
  ACADEMY_NAME,
  CONTACT_EMAIL,
  ICON_LOGO_PATH,
  SQUARE_LOGO_PATH,
} from "@/config/branding";

export const siteConfig = {
  name: ACADEMY_NAME,
  description: ACADEMY_DESCRIPTION,
  url: "https://nexusorbitacademy.com",
  language: "en",
  locale: "en_IN",
  country: "India",
  timezone: "Asia/Kolkata",
  organizationName: "Preraxia Nexus",
  organizationType: "Educational Technology Platform",
  address: {
    city: "Rourkela",
    region: "Sundargarh",
    country: "India",
    postalCode: "770043",
  },
  contactEmail: CONTACT_EMAIL,
  phone: "+91 8984039105",
};

export const siteKeywords = [
  "Aerospace Engineering",
  "Space Technology",
  "NASA Learning",
  "AI Courses",
  "Machine Learning",
  "Astronomy",
  "Astrophysics",
  "Universe Studies",
  "Online STEM Education",
  "Future Technology Academy",
  "Nexus Orbit Academy",
];

export const defaultViewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#060814" }, { color: "#060814" }],
  colorScheme: "dark",
};

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
  robots?: Metadata["robots"];
}

export function buildMetadata({
  title,
  description = ACADEMY_DESCRIPTION,
  path = "/",
  keywords = [],
  images,
  openGraph,
  twitter,
  robots,
}: BuildMetadataOptions): Metadata {
  const normalizedTitle = title && title !== ACADEMY_NAME ? `${title} | ${ACADEMY_NAME}` : title || ACADEMY_NAME;
  const canonicalUrl = new URL(path, siteConfig.url).toString();
  const defaultImage = images?.[0] ?? { url: SQUARE_LOGO_PATH, width: 1200, height: 630, alt: ACADEMY_NAME };

  const resolvedRobots = robots ?? {
    index: true,
    follow: true,
  };

  const normalizedRobots: NonNullable<Metadata["robots"]> = {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    ...(resolvedRobots as Record<string, unknown>),
  };

  return {
    title: normalizedTitle,
    description,
    keywords: [...siteKeywords, ...keywords],
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-IN": canonicalUrl,
      },
    },
    openGraph: {
      title: normalizedTitle,
      description,
      url: canonicalUrl,
      siteName: ACADEMY_NAME,
      locale: "en_IN",
      type: "website",
      images: [defaultImage],
      ...(openGraph ?? {}),
    },
    twitter: {
      card: "summary_large_image",
      title: normalizedTitle,
      description,
      images: [defaultImage.url],
      ...(twitter ?? {}),
    },
    robots: normalizedRobots,
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: ACADEMY_NAME,
    alternateName: "Nexus Orbit",
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.organizationName,
    },
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
      postalCode: siteConfig.address.postalCode,
    },
    description: ACADEMY_DESCRIPTION,
    logo: new URL(ICON_LOGO_PATH, siteConfig.url).toString(),
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ACADEMY_NAME,
    url: siteConfig.url,
    inLanguage: siteConfig.locale,
    description: ACADEMY_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: siteConfig.organizationName,
    },
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.url, siteConfig.url).toString(),
    })),
  };
}

export function buildCourseSchema(course: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    url: new URL(course.url, siteConfig.url).toString(),
    provider: {
      "@type": "EducationalOrganization",
      name: ACADEMY_NAME,
      sameAs: siteConfig.url,
    },
  };
}

export function buildFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
