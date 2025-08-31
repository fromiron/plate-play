import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { TRPCReactProvider } from "@/trpc/react";
import { locales } from "i18n/routing";

export const metadata: Metadata = {
  title: "Plate Play",
  description: "多言語対応デジタルメニューボード作成プラットフォーム",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Promise 타입으로 변경
}) {
  // params를 먼저 await
  const { locale } = await params;

  // 지원하는 언어인지 확인
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // 메시지 로드
  const messages = await getMessages();

  return (
    <html lang={locale} className={geist.variable} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
