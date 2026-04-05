import { api } from "@/lib/api";
import { DYNAMIC_ENDPOINTS } from "@/lib/constants/endpoints";

// Batch processor with concurrency limit
export async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item, index) => processor(item, i + index)),
    );
    results.push(...batchResults);
  }

  return results;
}

// Optimized API calls (no longer cached — React Query handles caching)
export async function getSchoolLockInCount(
  schoolId: string | number,
): Promise<number> {
  try {
    const response = await api(DYNAMIC_ENDPOINTS.SCHOOLS.GET_LOCKIN(schoolId));

    if (response?.success && response.data) {
      return response.data.students?.length || 0;
    }

    return 0;
  } catch (error) {
    return 0;
  }
}

export async function getLatestPatientResult(
  schoolId: string | number,
): Promise<{
  id: number;
  patientName: string;
  createdAt: string;
} | null> {
  try {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.GET_SCHOOL_RESULTS(schoolId),
    );

    if (response?.success && response.data && response.data.length > 0) {
      // Sort and get the latest
      const sorted = response.data.sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      return {
        id: sorted[0].id,
        patientName: sorted[0].patientName,
        createdAt: sorted[0].createdAt,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function checkForNewPatients(
  schoolId: string | number,
  previousPatientName?: string,
): Promise<{
  hasNew: boolean;
  latestPatient?: { patientName: string; createdAt: string };
} | null> {
  try {
    const response = await api(
      DYNAMIC_ENDPOINTS.PATIENT_RESULTS.GET_NEW_SCHOOL_RESULTS(schoolId),
    );

    if (response?.success && response.data && response.data.length > 0) {
      const sorted = response.data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      const latest = sorted[0];
      const hasNew = previousPatientName !== latest.patientName;

      return {
        hasNew,
        latestPatient: hasNew
          ? {
              patientName: latest.patientName,
              createdAt: latest.createdAt,
            }
          : undefined,
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
  delay: number,
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
  requestFn: () => Promise<T>,
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

// Clear all pending requests
export function clearAllCaches() {
  pendingRequests.clear();
}
