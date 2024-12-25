import type { IconWeight } from "@phosphor-icons/react/dist/lib/types";
import {
  BowlFood,
  Fish,
  Shrimp,
  Hamburger,
  Pizza,
  BeerBottle,
  BowlSteam,
  Brandy,
  Bread,
  Coffee,
  Cookie,
  CookingPot,
  ForkKnife,
  IceCream,
  Knife,
  Orange,
  Onigiri,
  PintGlass,
  Popcorn,
  Popsicle,
  TeaBag,
  Wine,
  BeerStein,
  EggCrack,
  Pepper,
} from "@phosphor-icons/react/dist/ssr";

export const ICONS = {
  BOWL: {
    name: "ご飯",
    icon: BowlFood,
  },
  FISH: {
    name: "魚",
    icon: Fish,
  },
  SHRIMP: {
    name: "エビ",
    icon: Shrimp,
  },
  HAMBURGER: {
    name: "ハンバーガー",
    icon: Hamburger,
  },
  PIZZA: {
    name: "ピザ",
    icon: Pizza,
  },
  BEER_BOTTLE: {
    name: "ビール瓶",
    icon: BeerBottle,
  },
  BOWL_STEAM: {
    name: "蒸し器",
    icon: BowlSteam,
  },
  BRANDY: {
    name: "ブランデー",
    icon: Brandy,
  },
  BREAD: {
    name: "パン",
    icon: Bread,
  },
  COFFEE: {
    name: "コーヒー",
    icon: Coffee,
  },
  COOKIE: {
    name: "クッキー",
    icon: Cookie,
  },
  COOKING_POT: {
    name: "鍋",
    icon: CookingPot,
  },
  FORK_KNIFE: {
    name: "フォークとナイフ",
    icon: ForkKnife,
  },
  ICE_CREAM: {
    name: "アイスクリーム",
    icon: IceCream,
  },
  KNIFE: {
    name: "ナイフ",
    icon: Knife,
  },
  ORANGE: {
    name: "オレンジ",
    icon: Orange,
  },
  ONIGIRI: {
    name: "おにぎり",
    icon: Onigiri,
  },
  PINT_GLASS: {
    name: "ピントグラス",
    icon: PintGlass,
  },
  POPCORN: {
    name: "ポップコーン",
    icon: Popcorn,
  },
  POPSICLE: {
    name: "アイスキャンディ",
    icon: Popsicle,
  },
  TEA_BAG: {
    name: "ティーバッグ",
    icon: TeaBag,
  },
  WINE: {
    name: "ワイン",
    icon: Wine,
  },
  BEER_STEIN: {
    name: "ビールジョッキ",
    icon: BeerStein,
  },
  EGG_CRACK: {
    name: "卵割り",
    icon: EggCrack,
  },
  PEPPER: {
    name: "唐辛子",
    icon: Pepper,
  },
} as const;

export type IconType = keyof typeof ICONS;

export const ICON_STYLES: Record<string, IconWeight> = {
  THIN: "thin",
  LIGHT: "light",
  REGULAR: "regular",
  BOLD: "bold",
  FILL: "fill",
  DUOTONE: "duotone",
} as const;

export const ICON_LIST = Object.keys(ICONS).reduce(
  (acc, key) => {
    acc[key as IconType] = key as IconType;
    return acc;
  },
  {} as Record<IconType, IconType>,
);
