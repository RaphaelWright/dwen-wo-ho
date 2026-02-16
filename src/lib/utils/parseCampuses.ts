export const parseCampuses = (
  campuses: string[] | null | undefined,
): string[] => {
  if (!campuses || campuses.length === 0) {
    return [];
  }

  return campuses.flatMap((campus) => {
    // Handle stringified arrays like '["Cape Coast"]'
    if (typeof campus === "string" && campus.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(campus);
        return Array.isArray(parsed) ? parsed : [campus];
      } catch {
        return [campus];
      }
    }
    return [campus];
  });
};
