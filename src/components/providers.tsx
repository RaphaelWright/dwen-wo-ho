"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { ReactNode, useState } from "react";
import { store } from "@/store";

interface IProps {
  children: ReactNode;
}

const Providers = ({ children }: IProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
};

export default Providers;
