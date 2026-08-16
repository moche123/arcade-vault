import type { ScoreEntry, User } from "./types";

const USER_KEY = "av_user";
const SCORES_KEY = "av_scores";

export function getUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function setUser(user: User | null): void {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function saveScore(entry: Omit<ScoreEntry, "at">): void {
  try {
    const all = JSON.parse(localStorage.getItem(SCORES_KEY) || "[]");
    all.push({ ...entry, at: Date.now() });
    localStorage.setItem(SCORES_KEY, JSON.stringify(all));
  } catch {
    // ignore storage errors, matches template behavior
  }
}
