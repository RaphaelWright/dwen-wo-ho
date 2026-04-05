import { api } from "@/lib/api";
import { STATIC_ENDPOINTS } from "@/lib/constants/endpoints";

export const newsletterService = {
  subscribe: async (email: string): Promise<void> => {
    const result = await api(STATIC_ENDPOINTS.NEWSLETTER.SUBSCRIBE, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (!result?.success) throw new Error("Failed to subscribe to newsletter");
  },
};
