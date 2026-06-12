"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { registerQueryClient } from "@/lib/query-client-store";
import { toast } from "@/lib/utils/toast";

const TanstackQueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => {
          // Layer 2: global background error handling per TanStack Query v5 best practices.
          // Only toast when data already exists (the user sees stale but workable data).
          if (query.state.data !== undefined) {
            toast.error(`Something went wrong: ${(error as Error).message}`);
          }
        },
      }),
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
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackQueryProvider;
