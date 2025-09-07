import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "../i18n/routing";

export default createMiddleware({
	// 지원하는 언어 목록
	locales,

	// 기본 언어
	defaultLocale,

	// 루트 경로 리다이렉트 설정
	localePrefix: "always",
});

export const config = {
	// API 라우트와 정적 파일 제외
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
