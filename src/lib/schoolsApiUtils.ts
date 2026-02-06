import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";

// Simple in-memory cache with TTL
class RequestCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
  }

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  clearKey(key: string) {
    this.cache.delete(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

// Create cache instances for different data types
export const lockInCache = new RequestCache(5); // 5 minutes
export const patientResultsCache = new RequestCache(2); // 2 minutes for more frequent updates

// Batch processor with concurrency limit
export async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item, index) => processor(item, i + index))
    );
    results.push(...batchResults);
  }
  
  return results;
}

// Optimized API calls with caching
export async function getSchoolLockInCount(schoolId: string | number): Promise<number> {
  const cacheKey = `lockin-${schoolId}`;
  const cached = lockInCache.get(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const response = await api(ENDPOINTS.getSchoolLockIn(schoolId));
    
    if (response?.success && response.data) {
      const count = response.data.students?.length || 0;
      lockInCache.set(cacheKey, count);
      return count;
    }
    
    return 0;
  } catch (error) {
    return 0;
  }
}

export async function getLatestPatientResult(schoolId: string | number): Promise<{
  patientName: string;
  createdAt: string;
} | null> {
  const cacheKey = `latest-patient-${schoolId}`;
  const cached = patientResultsCache.get(cacheKey);
  
  if (cached !== null) {
    return cached;
  }

  try {
    const response = await api(ENDPOINTS.getSchoolPatientResults(schoolId));
    
    if (response?.success && response.data && response.data.length > 0) {
      // Sort and get the latest
      const sorted = response.data.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      const latest = {
        patientName: sorted[0].patientName,
        createdAt: sorted[0].createdAt,
      };
      
      patientResultsCache.set(cacheKey, latest);
      return latest;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export async function checkForNewPatients(
  schoolId: string | number,
  previousPatientName?: string
): Promise<{
  hasNew: boolean;
  latestPatient?: { patientName: string; createdAt: string };
} | null> {
  try {
    const response = await api(ENDPOINTS.getNewSchoolPatientResults(schoolId));
    
    if (response?.success && response.data && response.data.length > 0) {
      const sorted = response.data.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      const latest = sorted[0];
      const hasNew = previousPatientName !== latest.patientName;
      
      return {
        hasNew,
        latestPatient: hasNew ? {
          patientName: latest.patientName,
          createdAt: latest.createdAt,
        } : undefined,
      };
    }
    
    return { hasNew: false };
  } catch (error) {
    return null;
  }
}

// Debounced function creator
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

export async function deduplicatedRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  // If request is already pending, return the same promise
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  // Create new request
  const promise = requestFn().finally(() => {
    // Clean up after request completes
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

// Clear all caches
export function clearAllCaches() {
  lockInCache.clear();
  patientResultsCache.clear();
  pendingRequests.clear();
}