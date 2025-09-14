import "@/styles/globals.css";

import { type Locale, locales } from "i18n/routing";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AuthProvider } from "@/components/auth/auth-provider";
import { auth } from "@/server/auth";
import { TRPCReactProvider } from "@/trpc/react";

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
	if (!locales.includes(locale as Locale)) {
		notFound();
	}

	// 메시지 로드
	const messages = await getMessages();

	// 세션 로드
	const session = await auth();

	return (
		<html lang={locale} className={geist.variable} suppressHydrationWarning>
			<body>
				<NextIntlClientProvider messages={messages}>
					<AuthProvider session={session}>
						<TRPCReactProvider>{children}</TRPCReactProvider>
					</AuthProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
