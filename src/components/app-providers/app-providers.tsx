"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import TanstackQueryProvider from "./tanstack-query-provider";
import JotaiProvider from "./jotai-provider";

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
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </JotaiProvider>
    </ThemeProvider>
  );
}
