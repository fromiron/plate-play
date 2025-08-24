"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Printer, Globe, Filter } from "lucide-react"
import type { MenuBoard, Lang, MenuItem } from "@/lib/types"
import { decodeBoardFromQuery, encodeBoardToQuery } from "@/lib/share"
import { getBoard } from "@/lib/storage"
import { getText } from "@/lib/i18n"
import { listenBoardUpdates } from "@/lib/realtime"
import { trackBoardView, trackItemView, addReview, getAnalytics } from "@/lib/analytics"
import { CATEGORY_LABEL, type CategoryKey } from "@/lib/categories"
import { Stars } from "@/components/rating"
import { formatCurrency } from "@/lib/utils-local"

type PaperSizeKey = "a5" | "a4" | "letter" | "tabloid"
type Orientation = "portrait" | "landscape"

function detectLang(): Lang {
  if (typeof navigator === "undefined") return "default"
  const ln = navigator.language.toLowerCase()
  if (ln.startsWith("zh")) return "zh"
  if (ln.startsWith("en")) return "en"
  return "default"
}

function isPromoActive(board: MenuBoard | null) {
  if (!board || !board.promotions || board.promotions.length === 0) return null
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  for (const p of board.promotions) {
    const inDay = p.days.includes(day)
    const inTime =
      p.startHour <= p.endHour ? hour >= p.startHour && hour <= p.endHour : hour >= p.startHour || hour <= p.endHour
    if (inDay && inTime) return p
  }
  return null
}

function discounted(price: number, percent: number) {
  return Math.max(0, Math.round(price * (1 - percent / 100)))
}

export default function PublicMenuPage() {
  const params = useParams<{ id: string }>()
  const search = useSearchParams()
  const router = useRouter()
  const [board, setBoard] = useState<MenuBoard | null>(null)

  // Options
  const [paper, setPaper] = useState<PaperSizeKey>("a4")
  const [orientation, setOrientation] = useState<Orientation>("portrait")
  const [marginMm, setMarginMm] = useState<string>("12.7")
  const [lang, setLang] = useState<Lang>("default")
  const [category, setCategory] = useState<CategoryKey | "all">("all")

  // item visibility observer
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Try query-embedded data first
    const dataParam = search.get("data")
    if (dataParam) {
      const decoded = decodeBoardFromQuery(dataParam)
      if (decoded) {
        setBoard(decoded)
        trackBoardView(decoded.id)
      }
    } else {
      const local = getBoard(params.id)
      if (local) {
        setBoard(local)
        trackBoardView(local.id)
      }
    }
  }, [params.id, search])

  useEffect(() => {
    const urlLang = (search.get("lang") as Lang) || null
    if (urlLang === "en" || urlLang === "zh" || urlLang === "default") {
      setLang(urlLang)
    } else {
      setLang(detectLang())
    }
  }, [search])

  useEffect(() => {
    // realtime updates
    const un = listenBoardUpdates((b) => {
      if (!board || b.id !== board.id) return
      // apply lightweight merge: statuses, theme, promotions
      const merged = { ...board, theme: b.theme, promotions: b.promotions }
      // also merge item statuses/categories by id
      merged.sections = merged.sections.map((s) => ({
        ...s,
        items: s.items.map((it) => {
          const match = b.sections.flatMap((ss) => ss.items).find((m) => m.id === it.id)
          return match ? { ...it, status: match.status ?? "available", category: match.category } : it
        }),
      }))
      setBoard(merged)
    })
    return un
  }, [board])

  const title = useMemo(() => (board ? getText(board.title, lang, board.defaultLang) : "메뉴"), [board, lang])
  const promo = useMemo(() => isPromoActive(board), [board])

  const printUrl = useMemo(() => {
    if (!board) return "#"
    try {
      const encoded = encodeBoardToQuery(board)
      const m = `${marginMm || "12.7"}mm`
      const qs = new URLSearchParams({
        data: encoded,
        size: paper,
        orientation,
        margin: m,
        lang,
      }).toString()
      return `/api/print/${params.id}?${qs}`
    } catch {
      return "#"
    }
  }, [board, params.id, paper, orientation, marginMm, lang])

  useEffect(() => {
    // IntersectionObserver for item views
    observerRef.current?.disconnect()
    if (!board) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const itemId = (e.target as HTMLElement).dataset.itemid
            if (itemId) trackItemView(board.id, itemId)
          }
        })
      },
      { threshold: 0.5 },
    )
    observerRef.current = obs
    document.querySelectorAll<HTMLElement>("[data-itemid]").forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [board, category])

  const categories = useMemo(() => {
    if (!board) return []
    const cats = new Set<string>()
    board.sections.forEach((s) => s.items.forEach((i) => cats.add(i.category || "other")))
    return Array.from(cats) as CategoryKey[]
  }, [board])

  const handlePrint = () => {
    window.print()
  }

  const updateLangQuery = (next: Lang) => {
    const url = new URL(window.location.href)
    url.searchParams.set("lang", next)
    router.replace(url.pathname + "?" + url.searchParams.toString())
  }

  if (!board) {
    return (
      <main className="mx-auto w-full max-w-3xl p-4">
        <div className="rounded-lg border bg-muted/20 p-6 text-center text-muted-foreground text-sm">
          메뉴 데이터를 불러올 수 없습니다. 링크가 잘못되었거나, 장치에 데이터가 없습니다.
        </div>
      </main>
    )
  }

  // theme variables
  const primary = board.theme?.primary ?? "#16a34a"
  const accent = board.theme?.accent ?? "#f59e0b"

  const analytics = getAnalytics(board.id)

  return (
    <main
      className="mx-auto w-full max-w-3xl bg-background p-4 print:p-0"
      style={
        {
          "--pp-primary": primary,
          "--pp-accent": accent,
        } as React.CSSProperties
      }
    >
      <header className="sticky top-0 z-20 mb-4 flex flex-col gap-2 border-b bg-background/80 px-1 py-2 backdrop-blur md:flex-row md:items-center md:justify-between print:hidden">
        <h1 className="font-semibold text-lg" style={{ color: "var(--pp-primary)" }}>
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Label className="text-muted-foreground text-xs">언어</Label>
            <Select
              value={lang}
              onValueChange={(v: Lang) => {
                setLang(v)
                updateLangQuery(v)
              }}
            >
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue placeholder="언어" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">기본</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>

            <Filter className="ml-2 h-4 w-4 text-muted-foreground" />
            <Label className="text-muted-foreground text-xs">카테고리</Label>
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {(CATEGORY_LABEL as any)[c] || c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label className="ml-2 text-muted-foreground text-xs">용지</Label>
            <Select value={paper} onValueChange={(v: PaperSizeKey) => setPaper(v)}>
              <SelectTrigger className="h-8 w-[105px]">
                <SelectValue placeholder="A4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a5">A5</SelectItem>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="tabloid">Tabloid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={orientation} onValueChange={(v: Orientation) => setOrientation(v)}>
              <SelectTrigger className="h-8 w-[110px]">
                <SelectValue placeholder="세로" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">세로</SelectItem>
                <SelectItem value="landscape">가로</SelectItem>
              </SelectContent>
            </Select>
            <Label className="ml-1 text-muted-foreground text-xs" htmlFor="pub-margin-mm">
              여백(mm)
            </Label>
            <Input
              id="pub-margin-mm"
              className="h-8 w-[80px]"
              inputMode="decimal"
              value={marginMm}
              onChange={(e) => setMarginMm(e.target.value)}
            />
          </div>
          <Button
            asChild
            size="sm"
            className="inline-flex items-center gap-2"
            style={{ backgroundColor: "var(--pp-primary)" }}
          >
            <a href={printUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
              PDF 다운로드
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-transparent"
          >
            <Printer className="h-4 w-4" />
            인쇄
          </Button>
        </div>
      </header>

      {promo ? (
        <div className="mb-4 rounded-lg border bg-[var(--pp-accent)]/10 p-3 text-sm">
          <span className="font-medium" style={{ color: "var(--pp-accent)" }}>
            {promo.name}
          </span>
          <span className="ml-2 text-muted-foreground">
            {promo.startHour}:00 ~ {promo.endHour}:00 · {promo.percent}% 할인
          </span>
        </div>
      ) : null}

      <article className="space-y-8 p-2 print:p-6">
        {board.sections.map((section) => {
          const items = section.items.filter((i) => (category === "all" ? true : (i.category || "other") === category))
          if (items.length === 0) return null
          return (
            <section key={section.id} className="scroll-mt-16">
              <h2 className="mb-3 border-b pb-2 font-bold text-xl" style={{ color: "var(--pp-primary)" }}>
                {getText(section.name, lang, board.defaultLang)}
              </h2>
              <ul className="grid gap-3">
                {items.map((item) => {
                  const name = getText(item.name, lang, board.defaultLang)
                  const sold = item.status === "soldout"
                  const basePrice = item.price
                  const showPrice = promo ? discounted(basePrice, promo.percent) : basePrice
                  const revs = getAnalytics(board.id).reviews[item.id] ?? []
                  const avg = revs.length
                    ? Math.round((revs.reduce((a, r) => a + r.rating, 0) / revs.length) * 10) / 10
                    : 0
                  return (
                    <li key={item.id} data-itemid={item.id} className="flex items-start gap-3">
                      {item.image ? (
                        <Image
                          src={item.image || "/placeholder.svg?height=72&width=72&query=menu-item-image"}
                          alt={`${name} 이미지`}
                          width={72}
                          height={72}
                          className="h-18 w-18 rounded-md object-cover"
                        />
                      ) : null}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-base" style={{ color: sold ? "#6b7280" : "inherit" }}>
                              {sold ? <span className="line-through">{name}</span> : name}
                              {item.category ? (
                                <span className="ml-2 rounded bg-[var(--pp-primary)]/10 px-2 py-0.5 text-[11px] text-[var(--pp-primary)]">
                                  {(CATEGORY_LABEL as any)[item.category] || item.category}
                                </span>
                              ) : null}
                            </h3>
                            <div className="mt-1 flex items-center gap-2">
                              <Stars value={avg} readOnly />
                              <span className="text-muted-foreground text-xs">({revs.length})</span>
                            </div>
                          </div>
                          <div className="whitespace-nowrap font-medium text-sm">
                            {promo && showPrice !== basePrice ? (
                              <div className="flex flex-col items-end">
                                <span className="text-muted-foreground text-xs line-through">
                                  {formatCurrency(basePrice, board.currency)}
                                </span>
                                <span style={{ color: "var(--pp-accent)" }}>
                                  {formatCurrency(showPrice, board.currency)}
                                </span>
                              </div>
                            ) : (
                              <span>{formatCurrency(basePrice, board.currency)}</span>
                            )}
                          </div>
                        </div>
                        {item.description && getText(item.description, lang, board.defaultLang) ? (
                          <p className="mt-1 text-muted-foreground text-sm">
                            {getText(item.description, lang, board.defaultLang)}
                          </p>
                        ) : null}

                        {/* Review form */}
                        <ReviewForm boardId={board.id} item={item} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </article>

      <style>{`
        @media print {
          header, .print\\:hidden { display: none !important; }
          main { background: white !important; }
          a[href]:after { content: "" !important; }
          img { break-inside: avoid; }
          section { page-break-inside: avoid; }
        }
      `}</style>
    </main>
  )
}

function ReviewForm({ boardId, item }: { boardId: string; item: MenuItem }) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount((getAnalytics(boardId).reviews[item.id] ?? []).length)
  }, [boardId, item.id])
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <Stars value={rating} onChange={setRating} />
        <Input
          placeholder="리뷰를 남겨주세요 (선택)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-8"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (rating <= 0) {
              alert("별점을 선택해주세요.")
              return
            }
            addReview(boardId, item.id, rating, text)
            setRating(0)
            setText("")
            setCount((c) => c + 1)
            alert("리뷰가 등록되었습니다.")
          }}
        >
          제출
        </Button>
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">누적 리뷰 {count}</div>
    </div>
  )
}
