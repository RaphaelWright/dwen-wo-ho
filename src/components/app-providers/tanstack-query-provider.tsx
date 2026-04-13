"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { registerQueryClient } from "@/lib/query-client-store";

const TanstackQueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () => {
      const client = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      });
      // Register immediately so WebSocket singletons can trigger refetches
      // without depending on React component lifecycle or event listeners.
      registerQueryClient(client);
      return client;
    },
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackQueryProvider;
