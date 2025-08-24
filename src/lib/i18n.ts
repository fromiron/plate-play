import type { Lang, LocalizedString } from "./types"

export const LANG_LABEL: Record<Lang, string> = {
  default: "기본",
  en: "English",
  zh: "中文",
}

export function getText(ls: LocalizedString | string | undefined, lang: Lang, fallback: Lang = "default"): string {
  if (!ls) return ""
  if (typeof ls === "string") return ls
  const primary = (ls as any)[lang] as string | undefined
  if (primary && primary.trim()) return primary
  const fb = (ls as any)[fallback] as string | undefined
  if (fb && fb.trim()) return fb
  return (ls.default ?? "").trim()
}
