"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import TanstackQueryProvider from "./tanstack-query-provider";
import JotaiProvider from "./jotai-provider";
import { StompProvider } from "@/components/providers/stomp-provider";
import { OnlineStatus } from "./online-status";

export default function Providers({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <JotaiProvider>
        <TanstackQueryProvider>
          <StompProvider>
            <OnlineStatus />
            {children}
          </StompProvider>
        </TanstackQueryProvider>
      </JotaiProvider>
    </ThemeProvider>
  );
}
