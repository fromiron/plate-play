"use client"

import { nanoid } from "nanoid"
import type { MenuBoard, LocalizedString, Section, MenuItem, Theme, Promotion } from "./types"
import { sampleBoard } from "./sample-data"

const KEY = "plateplay.boards"

function toLS(v: string | LocalizedString | undefined): LocalizedString {
  if (!v) return { default: "" }
  if (typeof v === "string") return { default: v }
  return { default: v.default ?? "", en: v.en, zh: v.zh }
}

function migrateItem(i: any): MenuItem {
  return {
    id: i.id,
    name: toLS(i.name ?? i.title),
    description: i.description ? toLS(i.description) : undefined,
    price: typeof i.price === "number" ? i.price : Number(i.price || 0),
    image: i.image,
    tags: Array.isArray(i.tags) ? i.tags : [],
    category: i.category ?? undefined,
    status: (i.status as "available" | "soldout") ?? "available",
  }
}

function migrateSection(s: any): Section {
  return {
    id: s.id,
    name: toLS(s.name),
    items: Array.isArray(s.items) ? s.items.map(migrateItem) : [],
  }
}

function migrateTheme(t: any): Theme | undefined {
  if (!t)
    return {
      primary: "#16a34a",
      secondary: "#0ea5e9",
      accent: "#f59e0b",
      fontPair: "inter-playfair",
      template: "blank",
    }
  return {
    primary: t.primary ?? "#16a34a",
    secondary: t.secondary ?? "#0ea5e9",
    accent: t.accent ?? "#f59e0b",
    fontPair: (t.fontPair as Theme["fontPair"]) ?? "inter-playfair",
    template: (t.template as Theme["template"]) ?? "blank",
  }
}

function migratePromotions(arr: any): Promotion[] | undefined {
  if (!Array.isArray(arr)) return []
  return arr
    .map((p) => ({
      id: p.id ?? nanoid(8),
      name: String(p.name ?? "Promo"),
      percent: Number(p.percent ?? 0),
      startHour: Number(p.startHour ?? 0),
      endHour: Number(p.endHour ?? 23),
      days: Array.isArray(p.days) ? p.days.map((d: any) => Number(d)) : [0, 1, 2, 3, 4, 5, 6],
    }))
    .filter((p) => p.percent > 0)
}

export function migrateBoard(b: any): MenuBoard {
  const now = Date.now()
  return {
    id: b.id ?? nanoid(10),
    title: toLS(b.title ?? "메뉴"),
    description: b.description ? toLS(b.description) : { default: "" },
    currency: b.currency ?? "KRW",
    defaultLang: (b.defaultLang as any) ?? "default",
    theme: migrateTheme(b.theme),
    promotions: migratePromotions(b.promotions) ?? [],
    sections: Array.isArray(b.sections) ? b.sections.map(migrateSection) : [],
    createdAt: b.createdAt ?? now,
    updatedAt: b.updatedAt ?? now,
  }
}

export function listBoards(): MenuBoard[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    const seeded = [sampleBoard()]
    localStorage.setItem(KEY, JSON.stringify(seeded))
    return seeded
  }
  try {
    const data = JSON.parse(raw) as any[]
    return data.map(migrateBoard)
  } catch {
    return []
  }
}

export function getBoard(id: string): MenuBoard | null {
  const boards = listBoards()
  return boards.find((b) => b.id === id) ?? null
}

export function saveBoard(board: MenuBoard): void {
  const boards = listBoards()
  const idx = boards.findIndex((b) => b.id === board.id)
  const now = Date.now()
  const updated = { ...board, updatedAt: now }
  if (idx >= 0) boards[idx] = updated
  else boards.push(updated)
  localStorage.setItem(KEY, JSON.stringify(boards))
}

export function createBoard(init: Partial<MenuBoard> = {}): MenuBoard {
  const now = Date.now()
  const board: MenuBoard = migrateBoard({
    id: nanoid(10),
    title: init.title ?? { default: "새 메뉴판" },
    description: init.description ?? { default: "" },
    currency: init.currency ?? "KRW",
    defaultLang: init.defaultLang ?? "default",
    theme: init.theme ?? undefined,
    promotions: init.promotions ?? [],
    sections: init.sections ?? [],
    createdAt: now,
    updatedAt: now,
  })
  saveBoard(board)
  return board
}

export function deleteBoard(id: string) {
  const boards = listBoards().filter((b) => b.id !== id)
  localStorage.setItem(KEY, JSON.stringify(boards))
}

export function exportBoards(): string {
  const boards = listBoards()
  return JSON.stringify(boards, null, 2)
}

export function importBoards(json: string) {
  try {
    const arr = JSON.parse(json) as any[]
    const migrated = arr.map(migrateBoard)
    localStorage.setItem(KEY, JSON.stringify(migrated))
  } catch (e) {
    throw new Error("Invalid JSON")
  }
}
