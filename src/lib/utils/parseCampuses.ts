export const parseCampuses = (campuses: unknown): string[] => {
  if (!campuses) return [];

  if (typeof campuses === "string") {
    if (campuses.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(campuses);
        if (Array.isArray(parsed)) {
          return parsed.map((c) => String(c).trim());
        }
      } catch {
        // Fall back to splitting by comma if JSON parse fails
      }
    }
    return campuses.split(",").flatMap((c) => {
      const trimmed = c.trim();
      return trimmed ? [trimmed] : [];
    });
  }

  if (Array.isArray(campuses)) {
    return campuses.flatMap((campus) => {
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
  }

  return [];
};
