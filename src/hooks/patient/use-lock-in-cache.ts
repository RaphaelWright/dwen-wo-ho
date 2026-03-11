"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CACHE_KEY_PREFIX,
  CACHE_DURATION,
} from "@/lib/constants/components/patient/lock-in";
import {
  LockInFormData,
  CacheData,
} from "@/lib/types/components/patient/lock-in";

export function useLockInCache(schoolId: string) {
  const [cachedDefaults, setCachedDefaults] =
    useState<Partial<LockInFormData> | null>(null);

  const getCacheKey = useCallback(
    () => `${CACHE_KEY_PREFIX}${schoolId}`,
    [schoolId],
  );

  const loadCachedData = useCallback((): Partial<LockInFormData> | null => {
    if (typeof window === "undefined") return null;

    try {
      const cacheKey = getCacheKey();
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cachedData: CacheData = JSON.parse(cached);

      if (cachedData.schoolId !== schoolId) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      const now = Date.now();
      if (now - cachedData.timestamp > CACHE_DURATION) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.error("Error loading cached form data:", error);
      return null;
    }
  }, [getCacheKey, schoolId]);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCachedDefaults(loadCachedData());
    }
  }, [loadCachedData]);

  return {
    cachedDefaults,
    saveToCache,
    clearCachedData,
  };
}
