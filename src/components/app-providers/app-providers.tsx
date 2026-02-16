"use client";

import { ReactNode } from "react";
import { NotificationProvider } from "@/components/app-providers/notification-provider";
import { ThemeProvider } from "./theme-provider";
import TanstackQueryProvider from "./tanstack-query-provider";

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
      <TanstackQueryProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </TanstackQueryProvider>
    </ThemeProvider>
  );
}
