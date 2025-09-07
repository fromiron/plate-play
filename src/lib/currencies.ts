export const CURRENCIES = [
	{ value: "KRW", label: "🇰🇷 KRW - Korean Won", symbol: "₩" },
	{ value: "JPY", label: "🇯🇵 JPY - Japanese Yen", symbol: "¥" },
	{ value: "USD", label: "🇺🇸 USD - US Dollar", symbol: "$" },
	{ value: "EUR", label: "🇪🇺 EUR - Euro", symbol: "€" },
	{ value: "CNY", label: "🇨🇳 CNY - Chinese Yuan", symbol: "¥" },
	{ value: "GBP", label: "🇬🇧 GBP - British Pound", symbol: "£" },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]["value"];

const CURRENCY_MAP = new Map(CURRENCIES.map(c => [c.value, c]));

export function getCurrencyLabel(code: string): string {
	return CURRENCY_MAP.get(code)?.label ?? code;
}

export function getCurrencySymbol(code: string): string {
	return CURRENCY_MAP.get(code)?.symbol ?? code;
}