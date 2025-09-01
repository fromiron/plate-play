"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Save, Share2, ExternalLink, Printer } from "lucide-react"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MenuEditor } from "@/components/menu-editor"
import type { MenuBoard, Lang } from "@/lib/types"
import { api } from "@/trpc/react"
import { buildLocalMenuUrl, buildShareUrl, encodeBoardToQuery } from "@/lib/share"
import { LANG_LABEL } from "@/lib/i18n"
import { broadcastBoardUpdate } from "@/lib/realtime"

type PaperSizeKey = "a5" | "a4" | "letter" | "tabloid"
type Orientation = "portrait" | "landscape"

export default function BoardEditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [shareUrl, setShareUrl] = useState<string>("")
  const qrRef = useRef<HTMLDivElement>(null)

  // PDF options
  const [paper, setPaper] = useState<PaperSizeKey>("a4")
  const [orientation, setOrientation] = useState<Orientation>("portrait")
  const [marginMm, setMarginMm] = useState<string>("12.7")
  const [pdfLang, setPdfLang] = useState<Lang>("default")

  // Fetch board data from database
  const { data: board, refetch } = api.menuBoard.getById.useQuery(
    { id: params.id },
    {
      onError: () => {
        alert("해당 메뉴판을 찾을 수 없습니다.")
        router.push("/dashboard")
      },
      onSuccess: (data) => {
        setPdfLang(data.defaultLang ?? "default")
      }
    }
  )

  const updateMutation = api.menuBoard.update.useMutation({
    onSuccess: () => {
      refetch()
    }
  })

  const localUrl = useMemo(() => buildLocalMenuUrl(params.id), [params.id])

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
        lang: pdfLang,
      }).toString()
      return `/api/print/${board.id}?${qs}`
    } catch {
      return "#"
    }
  }, [board, paper, orientation, marginMm, pdfLang])

  if (!board) return null

  const handleSave = (data: MenuBoard) => {
    updateMutation.mutate(data)
    // broadcast saved state
    broadcastBoardUpdate(data)
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 md:mb-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard" aria-label="뒤로가기">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Input
            className="h-10 w-[260px] md:w-[360px]"
            value={board.title.default}
            onChange={(e) => handleTitleChange(e.target.value)}
            aria-label="메뉴판 제목"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Label className="text-muted-foreground text-xs">용지</Label>
            <Select value={paper} onValueChange={(v: PaperSizeKey) => setPaper(v)}>
              <SelectTrigger className="h-9 w-[120px]">
                <SelectValue placeholder="A4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a5">A5</SelectItem>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="tabloid">Tabloid</SelectItem>
              </SelectContent>
            </Select>
            <Label className="ml-2 text-muted-foreground text-xs">방향</Label>
            <Select value={orientation} onValueChange={(v: Orientation) => setOrientation(v)}>
              <SelectTrigger className="h-9 w-[120px]">
                <SelectValue placeholder="세로" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">세로</SelectItem>
                <SelectItem value="landscape">가로</SelectItem>
              </SelectContent>
            </Select>
            <Label className="ml-2 text-muted-foreground text-xs" htmlFor="margin-mm">
              여백(mm)
            </Label>
            <Input
              id="margin-mm"
              className="h-9 w-[90px]"
              inputMode="decimal"
              value={marginMm}
              onChange={(e) => setMarginMm(e.target.value)}
            />
            <Label className="ml-2 text-muted-foreground text-xs">출력 언어</Label>
            <Select value={pdfLang} onValueChange={(v: Lang) => setPdfLang(v)}>
              <SelectTrigger className="h-9 w-[120px]">
                <SelectValue placeholder="언어" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{LANG_LABEL.default}</SelectItem>
                <SelectItem value="en">{LANG_LABEL.en}</SelectItem>
                <SelectItem value="zh">{LANG_LABEL.zh}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={() => handleSave(board)} className="inline-flex items-center gap-2">
            <Save className="h-4 w-4" />
            저장
          </Button>
          <Button variant="outline" asChild className="inline-flex items-center gap-2 bg-transparent">
            <Link href={localUrl} target="_blank">
              <ExternalLink className="h-4 w-4" />웹 메뉴 보기
            </Link>
          </Button>
          <Button variant="outline" asChild className="inline-flex items-center gap-2 bg-transparent">
            <Link href={printUrl} target="_blank">
              <Printer className="h-4 w-4" />
              PDF
            </Link>
          </Button>
          <Button onClick={() => setShareUrl(buildShareUrl(board))} className="inline-flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            공유 링크
          </Button>
          <Button asChild className="inline-flex items-center gap-2">
            <Link href={printUrl} target="_blank">
              <Download className="h-4 w-4" />
              PDF 다운로드
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>메뉴 에디터</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MenuEditor
              value={board}
              onChange={(updated) => {
                const next = { ...updated, updatedAt: Date.now() }
                setBoard(next)
                // Realtime broadcast for live updates (e.g., 품절)
                broadcastBoardUpdate(next)
              }}
              onSave={handleSave}
            />
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" onClick={() => handleSave(board)}>
              저장
            </Button>
            <Button asChild variant="outline">
              <Link href={localUrl} target="_blank">
                웹 메뉴 열기
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={printUrl} target="_blank">
                PDF 다운로드
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card id="qr" className="h-fit">
          <CardHeader>
            <CardTitle>QR 코드</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Tabs defaultValue="local">
              <TabsList className="w-full">
                <TabsTrigger value="local" className="flex-1">
                  로컬 URL
                </TabsTrigger>
                <TabsTrigger value="share" className="flex-1">
                  공유 URL
                </TabsTrigger>
              </TabsList>
              <TabsContent value="local" className="space-y-3">
                <Label className="text-muted-foreground text-xs">이 장치(LocalStorage)에서만 데이터가 보입니다.</Label>
                <div ref={qrRef} className="mx-auto w-full max-w-[220px] rounded-md bg-white p-3">
                  <QRCode value={localUrl} size={200} />
                </div>
                <Input readOnly value={localUrl} onFocus={(e) => e.currentTarget.select()} />
              </TabsContent>
              <TabsContent value="share" className="space-y-3">
                <Label className="text-muted-foreground text-xs">데이터가 URL에 포함됩니다.</Label>
                <div className="mx-auto w-full max-w-[220px] rounded-md bg-white p-3">
                  <QRCode value={shareUrl || "https://example.com"} size={200} />
                </div>
                <Input
                  readOnly
                  value={shareUrl}
                  placeholder="공유 링크 생성 후 표시됩니다."
                  onFocus={(e) => e.currentTarget.select()}
                />
              </TabsContent>
            </Tabs>
            <Separator />
            <p className="text-muted-foreground text-xs">
              팁: 출력물에 QR을 배치해 손님이 휴대폰으로 메뉴를 볼 수 있게 하세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
