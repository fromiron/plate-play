export type Lang = "default" | "en" | "zh" | "ja" | "ko" | "zh-CN" | "zh-TW";

export type LocalizedString = {
	default: string;
	en?: string;
	zh?: string;
	ja?: string;
	ko?: string;
	"zh-CN"?: string;
	"zh-TW"?: string;
};

export type ItemStatus = "available" | "soldout" | "hidden";

export type MenuItem = {
	id: string;
	name: LocalizedString;
	description?: LocalizedString;
	price: number;
	image?: string | null;
	tags?: string[];
	category?: string | null;
	status?: ItemStatus;
};

export type Section = {
	id: string;
	name: LocalizedString;
	items: MenuItem[];
};

export type Theme = {
	primary?: string;
	secondary?: string;
	accent?: string;
	fontPair?: "inter-playfair" | "inter-merriweather" | "inter-roboto-slab";
	template?: "blank" | "cafe" | "restaurant" | "pub";
};

export type Promotion = {
	id: string;
	name: string;
	percent: number; // 0-100
	startHour: number; // 0-23
	endHour: number; // 0-23 (inclusive range; wraps allowed if end < start)
	days: number[]; // 0-6 (Sun-Sat)
};

export type MenuBoard = {
	id: string;
	title: LocalizedString;
	description?: LocalizedString;
	currency?: string;
	defaultLang: Lang;
	theme?: Theme;
	promotions?: Promotion[];
	sections: Section[];
	createdAt: number;
	updatedAt: number;
	viewsCount?: number;
};
