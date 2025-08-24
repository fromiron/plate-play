import { nanoid } from "nanoid"
import type { MenuBoard, LocalizedString } from "./types"

const ls = (ko: string, en: string, zh: string): LocalizedString => ({ default: ko, en, zh })

export function templateBoard(
  type: "blank" | "cafe" | "restaurant" | "pub",
): Omit<MenuBoard, "id" | "createdAt" | "updatedAt"> {
  switch (type) {
    case "cafe":
      return {
        title: ls("카페 메뉴", "Cafe Menu", "咖啡馆菜单"),
        description: ls("하루의 시작을 함께해요", "Start your day with us", "与我们一起开始一天"),
        currency: "KRW",
        defaultLang: "default",
        theme: {
          primary: "#16a34a",
          secondary: "#0ea5e9",
          accent: "#f59e0b",
          fontPair: "inter-playfair",
          template: "cafe",
        },
        promotions: [],
        sections: [
          { id: nanoid(8), name: ls("커피", "Coffee", "咖啡"), items: [] },
          { id: nanoid(8), name: ls("티/에이드", "Tea/Ade", "茶/气泡"), items: [] },
          { id: nanoid(8), name: ls("디저트", "Dessert", "甜点"), items: [] },
        ],
      }
    case "restaurant":
      return {
        title: ls("레스토랑 메뉴", "Restaurant Menu", "餐厅菜单"),
        description: ls("오늘의 추천을 만나보세요", "Meet today's specials", "遇见今日推荐"),
        currency: "KRW",
        defaultLang: "default",
        theme: {
          primary: "#10b981",
          secondary: "#64748b",
          accent: "#f97316",
          fontPair: "inter-merriweather",
          template: "restaurant",
        },
        promotions: [],
        sections: [
          { id: nanoid(8), name: ls("메인", "Mains", "主菜"), items: [] },
          { id: nanoid(8), name: ls("파스타", "Pasta", "意面"), items: [] },
          { id: nanoid(8), name: ls("샐러드", "Salads", "沙拉"), items: [] },
          { id: nanoid(8), name: ls("음료", "Drinks", "饮品"), items: [] },
        ],
      }
    case "pub":
      return {
        title: ls("펍 메뉴", "Pub Menu", "酒吧菜单"),
        description: ls("친구와 함께하는 즐거운 시간", "Good times with friends", "与朋友共度美好时光"),
        currency: "KRW",
        defaultLang: "default",
        theme: {
          primary: "#f59e0b",
          secondary: "#94a3b8",
          accent: "#22c55e",
          fontPair: "inter-roboto-slab",
          template: "pub",
        },
        promotions: [],
        sections: [
          { id: nanoid(8), name: ls("맥주", "Beer", "啤酒"), items: [] },
          { id: nanoid(8), name: ls("와인", "Wine", "葡萄酒"), items: [] },
          { id: nanoid(8), name: ls("안주", "Snacks", "小吃"), items: [] },
        ],
      }
    default:
      return {
        title: ls("새 메뉴판", "New Menu", "新菜单"),
        description: ls("", "", ""),
        currency: "KRW",
        defaultLang: "default",
        theme: {
          primary: "#16a34a",
          secondary: "#0ea5e9",
          accent: "#f59e0b",
          fontPair: "inter-playfair",
          template: "blank",
        },
        promotions: [],
        sections: [],
      }
  }
}
