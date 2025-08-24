"use client"

import QRCode from "react-qr-code"
import { useMemo } from "react"
import type { MenuBoard } from "@/lib/types"
import { buildLocalMenuUrl } from "@/lib/share"
import { computeCoverage } from "@/lib/lang-stats"
import { getBoardViews } from "@/lib/views"

export default function BoardCard({ board }: { board: MenuBoard }) {
  const url = useMemo(() => buildLocalMenuUrl(board.id), [board.id])
  const cov = useMemo(() => computeCoverage(board), [board])
  const views = useMemo(() => getBoardViews(board.id), [board.id])

  return (
    <div className="flex items-start gap-3">
      <div className="rounded-md bg-white p-2">
        <QRCode value={url} size={72} />
      </div>
      <div className="min-w-0 text-muted-foreground text-sm">
        <div className="line-clamp-2">{board.description?.default || "설정된 설명이 없습니다."}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded bg-muted px-2 py-0.5">EN {cov.en.percent}%</span>
          <span className="rounded bg-muted px-2 py-0.5">中文 {cov.zh.percent}%</span>
          <span className="rounded bg-muted px-2 py-0.5">Views {new Intl.NumberFormat().format(views)}</span>
        </div>
        <div className="mt-1 text-[11px]">{url}</div>
      </div>
    </div>
  )
}
