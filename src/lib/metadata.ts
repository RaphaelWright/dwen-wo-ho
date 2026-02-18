import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SITE_NAME = "DWEN WO HO";
const SITE_TITLE = "DWEN WO HO | JustGo Health";
const DEFAULT_DESCRIPTION =
  "Reliable, confidential, and personalized mental healthcare for students. Connect with psychologists, counselors, and therapists near you.";

const siteMetadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "JustGo Health" }],
  generator: "Next.js",
  keywords: [
    "Mental Health",
    "Therapy",
    "Counseling",
    "Students",
    "Psychologists",
    "Healthcare",
    "Telemedicine",
    "Wellness",
    "JustGo Health",
    "Suicide",
  ],
  referrer: "origin-when-cross-origin",
  creator: "JustGo Health Team",
  publisher: "JustGo Health",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
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
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: {
      default: SITE_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/logos/logo-purple.png`,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: SITE_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}/logos/logo-purple.png`],
    creator: "@justgohealth",
  },
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon-16x16.png",
    apple: "/favicons/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/favicons/favicon-32x32.png",
    },
  },
  manifest: "/favicons/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
};

export function getMetadata(
  title?: string,
  description?: string,
  path?: string,
  image?: string,
): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageUrl = path ? `${SITE_URL}${path}` : SITE_URL;
  const pageImage = image || `${SITE_URL}/logos/logo-purple.png`;

  return {
    ...siteMetadata,
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      ...siteMetadata.openGraph,
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
    },
    twitter: {
      ...siteMetadata.twitter,
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
  };
}
