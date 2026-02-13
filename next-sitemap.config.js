/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  // Optional: Change the output directory
  // outDir: 'public',
  exclude: [
    "/provider", // Exclude provider base route
    "/provider/*", // Exclude all provider sub-routes
    "/curator", // Exclude curator base route
    "/curator/*", // Exclude all curator sub-routes
    "/patient", // Exclude patient base route
    "/patient/*", // Exclude all patient sub-routes
    "/icon.png", // Exclude static assets if needed
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/provider", "/curator", "/patient", "/api"],
      },
    ],
  },
};
