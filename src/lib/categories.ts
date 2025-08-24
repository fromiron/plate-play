export type CategoryKey =
  | "signature"
  | "pasta"
  | "steak"
  | "salad"
  | "coffee"
  | "drink"
  | "dessert"
  | "beer"
  | "wine"
  | "cocktail"
  | "other"

const rules: { key: CategoryKey; keywords: string[] }[] = [
  { key: "steak", keywords: ["steak", "스테이크", "牛排"] },
  { key: "pasta", keywords: ["pasta", "파스타", "意面", "意大利面"] },
  { key: "salad", keywords: ["salad", "샐러드", "沙拉"] },
  { key: "coffee", keywords: ["americano", "coffee", "커피", "咖啡"] },
  { key: "beer", keywords: ["beer", "맥주", "啤酒"] },
  { key: "wine", keywords: ["wine", "와인", "葡萄酒"] },
  { key: "cocktail", keywords: ["cocktail", "칵테일", "鸡尾酒"] },
  { key: "dessert", keywords: ["cake", "dessert", "디저트", "甜点"] },
  { key: "drink", keywords: ["drink", "음료", "饮品", "juice", "주스", "소다", "soda", "tea", "차"] },
]

export function classifyCategory(text: string): CategoryKey {
  const t = text.toLowerCase()
  for (const r of rules) {
    for (const kw of r.keywords) {
      if (t.includes(kw.toLowerCase())) return r.key as CategoryKey
    }
  }
  return "other"
}

export const CATEGORY_LABEL: Record<CategoryKey, string> = {
  signature: "시그니처",
  pasta: "파스타",
  steak: "스테이크",
  salad: "샐러드",
  coffee: "커피",
  drink: "음료",
  dessert: "디저트",
  beer: "맥주",
  wine: "와인",
  cocktail: "칵테일",
  other: "기타",
}
