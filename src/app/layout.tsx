import { ReactNode } from "react";
import "@/styles/globals.css";
import JsonLd from "@/components/miscellaneous/json-ld";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { geistMono, geistSans, poppins } from "@/lib/fonts/fonts";
import { getMetadata } from "@/lib/metadata";
import { JSON_LD_ROOT_LAYOUT } from "@/configs/json-ld";
import Providers from "@/components/app-providers/app-providers";

export const metadata: Metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <Providers>
          <Toaster richColors position="top-right" />
          {children}
        </Providers>
        <JsonLd data={JSON_LD_ROOT_LAYOUT} />
      </body>
    </html>
  );
}
