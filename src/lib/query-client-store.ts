import { QueryClient } from "@tanstack/react-query";

declare global {
  interface Window {
    __APP_QUERY_CLIENT__: QueryClient | undefined;
  }
}

export function registerQueryClient(client: QueryClient): void {
  if (typeof window !== "undefined") {
    window.__APP_QUERY_CLIENT__ = client;
  }
}

export function refetchAllActiveQueries(): void {
  if (typeof window === "undefined") return;

  const client = window.__APP_QUERY_CLIENT__;
  if (!client) {
    console.warn("[QueryClientStore] No QueryClient registered yet.");
    return;
  }

  console.log(
    "[QueryClientStore] 🔄 Triggering global refetch of all active queries...",
  );
  client.refetchQueries({ type: "active" });
}
