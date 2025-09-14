"use client";

import { type Locale, locales } from "i18n/routing";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const languageNames: Record<Locale, string> = {
	ja: "日本語",
	ko: "한국어",
	en: "English",
	"zh-CN": "简体中文",
	"zh-TW": "繁體中文",
};

export function LanguageSwitcher() {
	const t = useTranslations("common");
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const handleLanguageChange = (newLocale: string) => {
		// 현재 경로에서 언어 부분을 새로운 언어로 교체
		const pathWithoutLocale = pathname.replace(`/${locale}`, "");
		const newPath = `/${newLocale}${pathWithoutLocale}`;
		router.push(newPath);
	};

	return (
		<Select value={locale} onValueChange={handleLanguageChange}>
			<SelectTrigger className="w-[140px]">
				<SelectValue placeholder={t("language")} />
			</SelectTrigger>
			<SelectContent>
				{locales.map((lang) => (
					<SelectItem key={lang} value={lang}>
						{languageNames[lang]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
