"use client";

export type Stats = {
  xp: number;
  bestStreak: number;
  dayStreak: number;
  lastDay: string;
  sessions: number;
  /** correct-answer counts per "country|kind" */
  known: Record<string, number>;
  /** wrong-answer counts per "country|kind" */
  missed: Record<string, number>;
};

const KEY = "atlas-stats-v1";

export const emptyStats: Stats = { xp: 0, bestStreak: 0, dayStreak: 0, lastDay: "", sessions: 0, known: {}, missed: {} };
const empty = emptyStats;

export function loadStats(): Stats {
  if (typeof window === "undefined") return empty;
  try {
    return { ...empty, ...(JSON.parse(localStorage.getItem(KEY) || "{}") as Partial<Stats>) };
  } catch {
    return empty;
  }
}

export function saveStats(stats: Stats) {
  localStorage.setItem(KEY, JSON.stringify(stats));
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Call once when a study session starts; keeps the daily streak alive. */
export function touchDay(stats: Stats): Stats {
  const today = dayKey(new Date());
  if (stats.lastDay === today) return stats;
  const yesterday = dayKey(new Date(Date.now() - 86400000));
  return {
    ...stats,
    lastDay: today,
    dayStreak: stats.lastDay === yesterday ? stats.dayStreak + 1 : 1,
    sessions: stats.sessions + 1,
  };
}

export function recordAnswer(stats: Stats, key: string, correct: boolean, streak: number, points: number): Stats {
  const bucket = correct ? "known" : "missed";
  return {
    ...stats,
    xp: stats.xp + points,
    bestStreak: Math.max(stats.bestStreak, streak),
    [bucket]: { ...stats[bucket], [key]: (stats[bucket][key] || 0) + 1 },
  };
}

export function masteryOf(stats: Stats, key: string): "new" | "learning" | "known" {
  const right = stats.known[key] || 0;
  const wrong = stats.missed[key] || 0;
  if (right === 0 && wrong === 0) return "new";
  return right >= 2 && right > wrong ? "known" : "learning";
}

export function masteredCount(stats: Stats) {
  return Object.keys(stats.known).filter((k) => masteryOf(stats, k) === "known").length;
}
