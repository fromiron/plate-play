import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  PanelsTopLeft,
  QrCode,
  Printer,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LatestPost } from "@/app/_components/post";
import { auth } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  // const session = await auth();

  // if (session?.user) {
  // 	void api.post.getLatest.prefetch();
  // }

  return (
    <HydrateClient>
      <main className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                src="/plate-play-logo.png"
                width={32}
                height={32}
                alt="Plate Play 로고"
              />
              <span>Plate Play</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm md:flex">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground"
              >
                기능
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground"
              >
                사용방법
              </Link>
              <Link
                href="#print"
                className="text-muted-foreground hover:text-foreground"
              >
                인쇄 서비스
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/dashboard">대시보드</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">시작하기</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:gap-12 md:py-24">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              드래그 앤 드롭으로 만드는 스마트 메뉴판
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              Plate Play는 메뉴판 제작부터 QR 웹 메뉴판, 인쇄까지 한 번에
              해결하는 올인원 솔루션입니다.
            </p>
            <ul className="grid gap-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                자유로운 섹션/메뉴 구성과 순서 변경
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                자동 생성되는 QR로 웹 메뉴판 제공
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                프린트 전용 레이아웃으로 깔끔한 출력
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2"
                >
                  내 메뉴판 만들기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#features">기능 살펴보기</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-xl border bg-muted/30 p-4 md:p-6">
              <Image
                src="/menu-builder-ui.png"
                alt="메뉴 에디터 미리보기"
                width={720}
                height={480}
                className="h-auto w-full rounded-lg border object-cover"
              />
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto w-full max-w-6xl px-4 pb-16 md:pb-24"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <PanelsTopLeft className="mb-4 h-8 w-8 text-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  드래그 앤 드롭 에디터
                </h3>
                <p className="text-sm text-muted-foreground">
                  섹션과 메뉴를 원하는 대로 만들고 순서를 바꿔보세요. 이미지,
                  가격, 설명도 손쉽게 편집할 수 있습니다.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <QrCode className="mb-4 h-8 w-8 text-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  자동 QR 웹 메뉴판
                </h3>
                <p className="text-sm text-muted-foreground">
                  버튼 한 번으로 QR 코드 생성. 매장 테이블마다 손님이 휴대폰으로
                  메뉴를 확인할 수 있어요.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Printer className="mb-4 h-8 w-8 text-foreground" />
                <h3 className="mb-2 text-lg font-semibold">깔끔한 인쇄</h3>
                <p className="text-sm text-muted-foreground">
                  프린트 전용 레이아웃과 고해상도 출력. 필요한 경우 인쇄
                  서비스로 주문까지 연결할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto w-full max-w-6xl px-4 pb-20"
        >
          <div className="rounded-xl border bg-card p-6 md:p-10">
            <h2 className="mb-6 text-2xl font-bold">
              3단계로 끝내는 메뉴판 제작
            </h2>
            <ol className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
              <li className="rounded-lg border bg-muted/30 p-4">
                1. 대시보드에서 새 메뉴판 생성
              </li>
              <li className="rounded-lg border bg-muted/30 p-4">
                2. 드래그 앤 드롭으로 구성 편집
              </li>
              <li className="rounded-lg border bg-muted/30 p-4">
                3. QR 배포 또는 인쇄로 완성
              </li>
            </ol>
            <div className="pt-6">
              <Button asChild>
                <Link href="/dashboard">대시보드로 이동</Link>
              </Button>
            </div>
          </div>
        </section>

        <footer id="print" className="border-t">
          <div className="mx-auto w-full max-w-6xl px-4 py-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">인쇄 서비스</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  다양한 용지와 사이즈, 코팅 옵션을 제공합니다. 에디터에서 바로
                  출력하거나, 인쇄 서비스 문의로 손쉽게 주문하세요.
                </p>
              </div>
              <div className="flex items-center gap-3 md:justify-end">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">지금 편집하기</Link>
                </Button>
                <Button asChild>
                  <Link
                    href="mailto:print@plateplay.example"
                    aria-label="인쇄 서비스 이메일 문의"
                  >
                    인쇄 서비스 문의
                  </Link>
                </Button>
              </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground" suppressHydrationWarning>
              © {new Date().getFullYear()} Plate Play
            </p>
          </div>
        </footer>
      </main>
    </HydrateClient>
  );
}
