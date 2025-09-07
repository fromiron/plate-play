import type { Lang, LocalizedString, MenuBoard } from "./types";

type Coverage = { filled: number; total: number; percent: number };
export type BoardCoverage = Record<Exclude<Lang, "default">, Coverage>;

function countFilled(ls: LocalizedString | undefined): boolean {
	return !!ls && !!ls.default && ls.default.trim().length > 0;
}

function hasTranslation(
	ls: LocalizedString | undefined,
	lang: Exclude<Lang, "default">,
) {
	if (!ls) return false;
	const v = (ls as any)[lang] as string | undefined;
	return !!v && v.trim().length > 0;
}

export function computeCoverage(board: MenuBoard): BoardCoverage {
	const langs: Exclude<Lang, "default">[] = [
		"en",
		"zh",
		"ja",
		"ko",
		"zh-CN",
		"zh-TW",
	];
	const parts: LocalizedString[] = [];
	// board title/description
	parts.push(board.title);
	if (board.description) parts.push(board.description);
	// sections
	for (const s of board.sections) {
		parts.push(s.name);
		for (const i of s.items) {
			parts.push(i.name);
			if (i.description) parts.push(i.description);
		}
	}
	// only count items that exist in default text for total
	const countables = parts.filter((p) => countFilled(p));
	const total = countables.length;
	const result: BoardCoverage = {
		en: { filled: 0, total, percent: 0 },
		zh: { filled: 0, total, percent: 0 },
		ja: { filled: 0, total, percent: 0 },
		ko: { filled: 0, total, percent: 0 },
		"zh-CN": { filled: 0, total, percent: 0 },
		"zh-TW": { filled: 0, total, percent: 0 },
	};
	for (const lang of langs) {
		let filled = 0;
		for (const p of countables) {
			if (hasTranslation(p, lang)) filled++;
		}
		result[lang].filled = filled;
		result[lang].percent = total === 0 ? 0 : Math.round((filled / total) * 100);
	}
	return result;
}
