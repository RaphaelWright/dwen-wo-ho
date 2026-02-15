import "@/styles/globals.css";
import JsonLd from "@/components/json-ld";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import AppProviders from "@/components/AppProviders";
import { brHendrix, geistMono, geistSans } from "@/lib/fonts/fonts";

import { getMetadata } from "@/lib/metadata";
import { JSON_LD_ROOT_LAYOUT } from "@/lib/constants/json-ld";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = getMetadata();

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position="top-right" />
          <AppProviders>{children}</AppProviders>
        </ThemeProvider>
        <JsonLd data={JSON_LD_ROOT_LAYOUT} />
      </body>
    </html>
  );
}
