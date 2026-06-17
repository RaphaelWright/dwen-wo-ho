import { W52_WEEKS } from "@/lib/constants/components/curator/create/creative-studios";

const MAX_WEEK = W52_WEEKS[W52_WEEKS.length - 1];
const MIN_WEEK = W52_WEEKS[0];

export function reconcileProgrammeWeeks(df: number, dt: number) {
  if (df < dt) {
    return { df, dt };
  }

  if (df >= MAX_WEEK) {
    return { df: MAX_WEEK - 1, dt: MAX_WEEK };
  }

  return { df, dt: df + 1 };
}

export function reconcileProgrammeWeekFrom(df: number, dt: number) {
  return reconcileProgrammeWeeks(df, dt);
}

export function reconcileProgrammeWeekTo(df: number, dt: number) {
  if (dt > df) {
    return { df, dt };
  }

  return { df: Math.max(dt - 1, MIN_WEEK), dt };
}

export function getProgrammeWeekFromOptions(dt: number) {
  return W52_WEEKS.filter((week) => week < dt);
}

export function getProgrammeWeekToOptions(df: number) {
  return W52_WEEKS.filter((week) => week > df);
}
