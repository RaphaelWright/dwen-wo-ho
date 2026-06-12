"use client";

import { useState, useCallback } from "react";
import {
  CACHE_KEY_PREFIX,
  CACHE_DURATION,
} from "@/lib/constants/components/patient/lock-in";
import {
  LockInFormData,
  CacheData,
} from "@/lib/types/components/patient/lock-in";

function readCachedDefaults(schoolId: string): Partial<LockInFormData> | null {
  if (typeof window === "undefined") return null;

  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${schoolId}`;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const cachedData: CacheData = JSON.parse(cached);

    if (cachedData.schoolId !== schoolId) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    if (Date.now() - cachedData.timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return cachedData.data;
  } catch (error) {
    console.error("Error loading cached form data:", error);
    return null;
  }
}

export function useLockInCache(schoolId: string) {
  // Lazy initializer reads localStorage synchronously on first render — no mount effect needed.
  const [cachedDefaults] = useState(() => readCachedDefaults(schoolId));

  const getCacheKey = useCallback(
    () => `${CACHE_KEY_PREFIX}${schoolId}`,
    [schoolId],
  );

  const saveToCache = useCallback(
    (data: Partial<LockInFormData>) => {
      if (typeof window === "undefined") return;
      try {
        const cacheKey = getCacheKey();
        const cacheData: CacheData = {
          data,
          timestamp: Date.now(),
          schoolId,
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (error) {
        console.error("Error saving cached form data:", error);
      }
    },
    [getCacheKey, schoolId],
  );

  const clearCachedData = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const cacheKey = getCacheKey();
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error("Error clearing cached form data:", error);
    }
  }, [getCacheKey]);

  return {
    cachedDefaults,
    saveToCache,
    clearCachedData,
  };
}
