import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import AppProviders from "@/components/AppProviders";
import { brHendrix, geistMono, geistSans } from "@/lib/fonts/fonts";

export const metadata: Metadata = {
  title: "DWEN WO HO | JustGo Health",
  description: "DWEN WO HO | JustGo Health",
  icons: {
    icon: "/logos/logo-purple.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${brHendrix.variable} antialiased`}
      >
        <Toaster richColors position="top-right" />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
