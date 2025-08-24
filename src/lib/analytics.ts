"use client"

type ItemReview = { rating: number; text?: string; ts: number }
type BoardAnalytics = {
  views: number
  hours: number[] // length 24
  itemViews: Record<string, number>
  reviews: Record<string, ItemReview[]>
}

const KEY = "plateplay.analytics"

function getAll(): Record<string, BoardAnalytics> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Record<string, BoardAnalytics>) : {}
  } catch {
    return {}
  }
}

function setAll(map: Record<string, BoardAnalytics>) {
  localStorage.setItem(KEY, JSON.stringify(map))
}

function ensure(boardId: string): BoardAnalytics {
  const map = getAll()
  if (!map[boardId]) {
    map[boardId] = { views: 0, hours: new Array(24).fill(0), itemViews: {}, reviews: {} }
    setAll(map)
  }
  return map[boardId]
}

export function trackBoardView(boardId: string) {
  const map = getAll()
  const a = ensure(boardId)
  a.views += 1
  const h = new Date().getHours()
  a.hours[h] = (a.hours[h] ?? 0) + 1
  map[boardId] = a
  setAll(map)
}

export function trackItemView(boardId: string, itemId: string) {
  const map = getAll()
  const a = ensure(boardId)
  a.itemViews[itemId] = (a.itemViews[itemId] ?? 0) + 1
  map[boardId] = a
  setAll(map)
}

export function addReview(boardId: string, itemId: string, rating: number, text?: string) {
  const map = getAll()
  const a = ensure(boardId)
  a.reviews[itemId] = a.reviews[itemId] || []
  a.reviews[itemId].push({ rating, text: text?.trim() || "", ts: Date.now() })
  map[boardId] = a
  setAll(map)
}

export function getAnalytics(boardId: string): BoardAnalytics {
  return ensure(boardId)
}

export function getAllAnalytics() {
  return getAll()
}
