"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { listBoards } from "@/lib/storage"
import type { MenuBoard } from "@/lib/types"
import { getAnalytics } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  const [boards, setBoards] = useState<MenuBoard[]>([])

  useEffect(() => {
    setBoards(listBoards())
  }, [])

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link href="/dashboard" aria-label="뒤로가기">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="font-bold text-2xl">분석</h1>
        </div>
      </div>

      <div className="grid gap-6">
        {boards.map((b) => {
          const a = getAnalytics(b.id)
          const topItems = Object.entries(a.itemViews)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
          const maxHour = Math.max(1, ...a.hours)
          return (
            <Card key={b.id}>
              <CardHeader>
                <CardTitle>{b.title.default}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                  <div className="text-muted-foreground text-sm">시간대별 접속 패턴</div>
                  <div className="flex items-end gap-1 rounded-md border p-3">
                    {a.hours.map((v, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-3 rounded-t bg-emerald-500"
                          style={{ height: `${Math.round((v / maxHour) * 120)}px` }}
                          title={`${i}시: ${v}`}
                        />
                        <div className="text-[10px] text-muted-foreground">{i}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="text-muted-foreground text-sm">인기 메뉴 Top 5</div>
                  <ul className="grid gap-1 text-sm">
                    {topItems.length === 0 ? (
                      <li className="text-muted-foreground">데이터 없음</li>
                    ) : (
                      topItems.map(([id, v]) => {
                        // find item name
                        const item = b.sections.flatMap((s) => s.items).find((it) => it.id === id) || {
                          name: { default: "알 수 없음" },
                        }
                        return (
                          <li key={id} className="flex items-center justify-between gap-2">
                            <span className="truncate">{item.name.default}</span>
                            <span className="text-muted-foreground">{v}</span>
                          </li>
                        )
                      })
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
