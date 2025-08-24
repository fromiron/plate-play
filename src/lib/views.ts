"use client"

const KEY = "plateplay.views"

export function getViews(): Record<string, number> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

export function getBoardViews(id: string): number {
  const map = getViews()
  return map[id] ?? 0
}

export function incrementBoardViews(id: string): void {
  if (typeof window === "undefined") return
  const map = getViews()
  map[id] = (map[id] ?? 0) + 1
  localStorage.setItem(KEY, JSON.stringify(map))
}
