type ApiEnvelope = {
  success?: boolean;
  data?: unknown;
};

export function extractSuccessData<T>(result: unknown): T | null {
  if (typeof result !== "object" || result === null) return null;
  const envelope = result as ApiEnvelope;
  if (!envelope.success) return null;
  return envelope.data as T;
}

export function extractArrayData<T>(result: unknown): T[] {
  const data = extractSuccessData<T[]>(result);
  if (Array.isArray(data)) return data;
  if (Array.isArray(result)) return result as T[];
  return [];
}

export function requireSuccessData<T>(
  result: unknown,
  errorMessage: string,
): T {
  const data = extractSuccessData<T>(result);
  if (data === null || data === undefined) {
    throw new Error(errorMessage);
  }
  return data;
}
