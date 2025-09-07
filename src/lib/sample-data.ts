import { nanoid } from "nanoid";
import type { MenuBoard } from "./types";

export function sampleBoard(): MenuBoard {
	const id = nanoid(10);
	const now = Date.now();
	return {
		id,
		title: {
			default: "Plate Play 샘플 메뉴",
			en: "Plate Play Sample Menu",
			zh: "Plate Play 示例菜单",
		},
		description: {
			default: "처음 시작을 위한 예시 메뉴입니다.",
			en: "A starter example menu.",
			zh: "入门示例菜单。",
		},
		currency: "KRW",
		defaultLang: "default",
		theme: {
			primary: "#16a34a",
			secondary: "#0ea5e9",
			accent: "#f59e0b",
			fontPair: "inter-playfair",
			template: "restaurant",
		},
		promotions: [
			{
				id: nanoid(6),
				name: "해피 아워",
				percent: 15,
				startHour: 15,
				endHour: 17,
				days: [1, 2, 3, 4, 5],
			},
		],
		createdAt: now,
		updatedAt: now,
		sections: [
			{
				id: nanoid(8),
				name: { default: "메인", en: "Main", zh: "主菜" },
				items: [
					{
						id: nanoid(8),
						name: {
							default: "스테이크 플래터",
							en: "Steak Platter",
							zh: "牛排拼盘",
						},
						description: {
							default: "그릴에 구운 채소와 허브버터",
							en: "Grilled vegetables with herb butter",
							zh: "烤蔬菜配香草黄油",
						},
						price: 29000,
						image: "/steak-platter.png",
						category: "steak",
						status: "available",
					},
					{
						id: nanoid(8),
						name: { default: "크림 파스타", en: "Cream Pasta", zh: "奶油意面" },
						description: {
							default: "베이컨과 양송이 버섯",
							en: "Bacon and mushrooms",
							zh: "培根和蘑菇",
						},
						price: 16000,
						image: "/cream-pasta.png",
						category: "pasta",
						status: "available",
					},
				],
			},
			{
				id: nanoid(8),
				name: { default: "사이드", en: "Sides", zh: "配菜" },
				items: [
					{
						id: nanoid(8),
						name: {
							default: "시저 샐러드",
							en: "Caesar Salad",
							zh: "凯撒沙拉",
						},
						description: {
							default: "수제 드레싱과 그라나파다노",
							en: "House dressing with Grana Padano",
							zh: "自制酱料配格拉纳帕达诺奶酪",
						},
						price: 9000,
						image: "/caesar-salad.png",
						category: "salad",
						status: "available",
					},
				],
			},
			{
				id: nanoid(8),
				name: { default: "음료", en: "Drinks", zh: "饮品" },
				items: [
					{
						id: nanoid(8),
						name: { default: "아메리카노", en: "Americano", zh: "美式咖啡" },
						description: { default: "핫/아이스", en: "Hot/Iced", zh: "热/冰" },
						price: 4500,
						image: "/steaming-coffee-cup.png",
						category: "coffee",
						status: "available",
					},
				],
			},
		],
	};
}
