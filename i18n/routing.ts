import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

// 지원하는 언어 목록
export const locales = ["ja", "ko", "en", "zh-CN", "zh-TW"] as const;
export const defaultLocale: Locale = "ja";
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
