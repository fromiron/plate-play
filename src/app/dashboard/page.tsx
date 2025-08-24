"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  QrCode,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  Eye,
  BarChart3,
  Upload,
  Download as DL,
} from "lucide-react";
import {
  createBoard,
  deleteBoard,
  listBoards,
  exportBoards,
  importBoards,
} from "@/lib/storage";
import type { MenuBoard } from "@/lib/types";
import { formatCount, formatDate } from "@/lib/utils-local";
import BoardCard from "@/components/board-card";
import { computeCoverage } from "@/lib/lang-stats";
import { getBoardViews } from "@/lib/views";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { templateBoard } from "@/lib/templates";

export default function DashboardPage() {
  const [boards, setBoards] = useState<MenuBoard[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("새 메뉴판");
  const [desc, setDesc] = useState("");
  const [tpl, setTpl] = useState<"blank" | "cafe" | "restaurant" | "pub">(
    "blank"
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    setBoards(listBoards());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return boards;
    return boards.filter((b) =>
      [b.title.default, b.description?.default]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [boards, query]);

  const handleCreate = () => {
    const base = templateBoard(tpl);
    const board = createBoard({
      ...base,
      title: base.title ?? { default: title.trim() || "새 메뉴판" },
      description: base.description ?? { default: desc.trim() },
    });
    setBoards(listBoards());
    setOpen(false);
    setTitle("새 메뉴판");
    setDesc("");
    location.href = `/dashboard/${board.id}`;
  };

  const handleDelete = (id: string) => {
    if (!confirm("이 메뉴판을 삭제하시겠습니까?")) return;
    deleteBoard(id);
    setBoards(listBoards());
  };

  const doExport = () => {
    const data = exportBoards();
    const url = URL.createObjectURL(
      new Blob([data], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "plateplay-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      importBoards(text);
      setBoards(listBoards());
      alert("가져오기 완료");
    };
    input.click();
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">내 메뉴판</h1>
          <p className="text-sm text-muted-foreground">
            다국어/카테고리/품절/분석 등 고급 기능을 활용해보세요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="inline-flex items-center gap-2 bg-transparent"
          >
            <Link href="/dashboard/analytics">
              <BarChart3 className="h-4 w-4" />
              분석 보기
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={doImport}
            className="inline-flex items-center gap-2 bg-transparent"
          >
            <Upload className="h-4 w-4" />
            가져오기
          </Button>
          <Button
            variant="outline"
            onClick={doExport}
            className="inline-flex items-center gap-2 bg-transparent"
          >
            <DL className="h-4 w-4" />
            내보내기
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />새 메뉴판
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 메뉴판 만들기</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <label className="text-sm font-medium">템플릿</label>
                <Select value={tpl} onValueChange={(v: any) => setTpl(v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">빈 템플릿</SelectItem>
                    <SelectItem value="cafe">카페</SelectItem>
                    <SelectItem value="restaurant">레스토랑</SelectItem>
                    <SelectItem value="pub">주점</SelectItem>
                  </SelectContent>
                </Select>
                <label className="text-sm font-medium" htmlFor="board-title">
                  제목 (기본)
                </label>
                <Input
                  id="board-title"
                  placeholder="예: 점심 메뉴"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label className="text-sm font-medium" htmlFor="board-desc">
                  설명 (기본, 선택)
                </label>
                <Input
                  id="board-desc"
                  placeholder="예: 평일 11:00 - 14:00"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleCreate}>만들기</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="메뉴판 검색"
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Separator className="mb-6" />

      {filtered.length === 0 ? (
        <div className="rounded-lg border bg-muted/20 p-10 text-center text-sm text-muted-foreground">
          메뉴판이 없습니다. {"'새 메뉴판'"} 버튼으로 시작해보세요.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((board) => {
            const cov = computeCoverage(board);
            const views = getBoardViews(board.id);
            const itemCount = board.sections.reduce(
              (acc, s) => acc + s.items.length,
              0
            );
            const soldOut = board.sections.reduce(
              (acc, s) =>
                acc + s.items.filter((i) => i.status === "soldout").length,
              0
            );
            const categories = new Set(
              board.sections.flatMap((s) =>
                s.items.map((i) => i.category || "other")
              )
            ).size;
            return (
              <Card key={board.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    {board.title.default}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <BoardCard board={board} />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>섹션 {formatCount(board.sections.length)}</span>
                    <span>메뉴 {formatCount(itemCount)}</span>
                    <span>카테고리 {formatCount(categories)}</span>
                    <span>품절 {formatCount(soldOut)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {formatCount(views)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    EN {cov.en.filled}/{cov.en.total} · 中 {cov.zh.filled}/
                    {cov.zh.total}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    업데이트: {formatDate(board.updatedAt)}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-2 bg-transparent"
                  >
                    <Link href={`/dashboard/${board.id}`}>
                      <Pencil className="h-4 w-4" />
                      편집
                    </Link>
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      aria-label="웹 메뉴 열기"
                    >
                      <Link href={`/m/${board.id}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      aria-label="QR 보기"
                    >
                      <Link href={`/dashboard/${board.id}#qr`}>
                        <QrCode className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(board.id)}
                      aria-label="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
