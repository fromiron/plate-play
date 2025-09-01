import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  PanelsTopLeft,
  QrCode,
  Printer,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LoginButton } from "@/components/auth/login-button";
import { auth } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  // const session = await auth();

  // if (session?.user) {
  // 	void api.post.getLatest.prefetch();
  // }

  const t = await getTranslations();

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
                alt="Plate Play Logo"
              />
              <span>Plate Play</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm md:flex">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground"
              >
                {t("homepage.nav.features")}
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground"
              >
                {t("homepage.nav.howItWorks")}
              </Link>
              <Link
                href="#print"
                className="text-muted-foreground hover:text-foreground"
              >
                {t("homepage.nav.printService")}
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <LoginButton />
            </div>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:gap-12 md:py-24">
          <div className="space-y-6">
            <h1 className="font-bold text-3xl leading-tight tracking-tight md:text-5xl">
              {t("homepage.hero.title")}
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              {t("homepage.hero.subtitle")}
            </p>
            <ul className="grid gap-3 text-muted-foreground text-sm">
              {(t.raw("homepage.hero.features") as string[]).map(
                (feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    {feature}
                  </li>
                )
              )}
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2"
                >
                  {t("homepage.hero.createMenu")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#features">
                  {t("homepage.hero.exploreFunctions")}
                </Link>
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
                <h3 className="mb-2 font-semibold text-lg">
                  {t("homepage.features.dragAndDrop.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("homepage.features.dragAndDrop.description")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <QrCode className="mb-4 h-8 w-8 text-foreground" />
                <h3 className="mb-2 font-semibold text-lg">
                  {t("homepage.features.qrMenu.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("homepage.features.qrMenu.description")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Printer className="mb-4 h-8 w-8 text-foreground" />
                <h3 className="mb-2 font-semibold text-lg">
                  {t("homepage.features.printing.title")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t("homepage.features.printing.description")}
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
            <h2 className="mb-6 font-bold text-2xl">
              {t("homepage.howItWorks.title")}
            </h2>
            <ol className="grid gap-4 text-muted-foreground text-sm md:grid-cols-3">
              {(t.raw("homepage.howItWorks.steps") as string[]).map(
                (step: string, index: number) => (
                  <li key={index} className="rounded-lg border bg-muted/30 p-4">
                    {index + 1}. {step}
                  </li>
                )
              )}
            </ol>
            <div className="pt-6">
              <Button asChild>
                <Link href="/dashboard">
                  {t("homepage.howItWorks.goToDashboard")}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <footer id="print" className="border-t">
          <div className="mx-auto w-full max-w-6xl px-4 py-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {t("homepage.printService.title")}
                </h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  {t("homepage.printService.description")}
                </p>
              </div>
              <div className="flex items-center gap-3 md:justify-end">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">
                    {t("homepage.printService.editNow")}
                  </Link>
                </Button>
                <Button asChild>
                  <Link
                    href="mailto:print@plateplay.example"
                    aria-label={t("homepage.printService.contact")}
                  >
                    {t("homepage.printService.contact")}
                  </Link>
                </Button>
              </div>
            </div>
            <p
              className="mt-6 text-muted-foreground text-xs"
              suppressHydrationWarning
            >
              © {new Date().getFullYear()} Plate Play
            </p>
          </div>
        </footer>
      </main>
    </HydrateClient>
  );
}
