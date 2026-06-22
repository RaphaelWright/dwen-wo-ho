export const JSON_LD_FOR_PROVIDERS_PAGE = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Mental Health Provider Network",
  provider: {
    "@id": "https://justgo.health/#organization",
  },
  description:
    "Join our network of psychologists, counselors, and therapists to provide care for students.",
  serviceType: "Professional Network",
  audience: {
    "@type": "Audience",
    audienceType: "Mental Health Professionals",
  },
};

export const JSON_LD_LOCK_IN_2_PAGE = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Lock In — JustGo Health",
  description:
    "Meet Gen Z achievers and lock in your future with JustGo Health.",
  url: "https://justgo.health/lock-in-2",
  isPartOf: {
    "@id": "https://justgo.health/#website",
  },
};

export const JSON_LD_HOME_PAGE = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Student Mental Health Services",
  provider: {
    "@id": "https://justgo.health/#organization",
  },
  description:
    "Confidential and accessible mental health support for university students in Ghana.",
  areaServed: {
    "@type": "Country",
    name: "Ghana",
  },
  audience: {
    "@type": "Audience",
    audienceType: "College Students",
  },
  serviceType: "Mental Health Counseling",
};

export const JSON_LD_ROOT_LAYOUT = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://justgo.health/#website",
      url: "https://justgo.health",
      name: "JustGo Health",
      description:
        "Reliable, confidential, and personalized mental healthcare for students.",
      publisher: {
        "@id": "https://justgo.health/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://justgo.health/#organization",
      name: "JustGo Health",
      url: "https://justgo.health",
      logo: {
        "@type": "ImageObject",
        url: "https://justgo.health/logos/logo-purple.png",
      },
      sameAs: [
        "https://twitter.com/justgohealth",
        "https://www.instagram.com/justgohealth",
        "https://www.linkedin.com/company/justgo-health",
      ],
    },
  ],
};
