import {
  ICON_LIST,
  ICON_STYLES,
  ICONS,
  IconStyle,
  type Icon,
} from "@/constants/icons";
import {
  type Direction,
  DIRECTIONS,
  TEXT_SIZE_CLASSES,
  TEXT_SIZES,
} from "@/constants/styles";
import type { ComponentConfig } from "@measured/puck";
import { IconMenuPart } from "@/components/puck/blocks/parts/icon-menu-part";

export type IconMenuItemProps = {
  icon: Icon;
  iconSize: number;
  iconStyle: IconStyle;
  title: string;
  titleSize: string;
  description: string;
  descriptionSize: string;
  price: number;
  priceSize: string;
  direction: Direction;
};

export const iconMenuItemDefaultProps: IconMenuItemProps = {
  icon: ICON_LIST.COOKIE,
  iconSize: 48,
  iconStyle: ICON_STYLES.REGULAR,
  title: "メニュー",
  titleSize: TEXT_SIZES.TEXT_SIZE_LG,
  description: "メニュー説明",
  descriptionSize: TEXT_SIZES.TEXT_SIZE_BASE,
  direction: DIRECTIONS.HORIZONTAL,
  price: 0,
  priceSize: TEXT_SIZES.TEXT_SIZE_BASE,
};

export const IconMenuItem: ComponentConfig<IconMenuItemProps> = {
  fields: {
    icon: {
      label: "アイコン",
      type: "select",
      options: Object.entries(ICON_LIST).map(([key]) => ({
        label: ICONS[key as Icon].name,
        value: key,
      })),
    },
    iconSize: {
      label: "アイコンサイズ",
      type: "number",
      min: 8,
    },
    iconStyle: {
      label: "アイコンスタイル",
      type: "select",
      options: Object.entries(ICON_STYLES).map(([key, value]) => ({
        label: key,
        value: value,
      })),
    },
    title: {
      label: "タイトル",
      type: "text",
    },
    titleSize: {
      label: "文字サイズ(Title Size)",
      type: "select",
      options: TEXT_SIZE_CLASSES.map((size) => ({
        label: size.replace("text-", ""),
        value: size,
      })),
    },
    description: {
      label: "説明",
      type: "text",
    },
    descriptionSize: {
      label: "文字サイズ(Description Size)",
      type: "select",
      options: TEXT_SIZE_CLASSES.map((size) => ({
        label: size.replace("text-", ""),
        value: size,
      })),
    },
    direction: {
      label: "方向",
      type: "radio",
      options: [
        { label: "縦", value: DIRECTIONS.VERTICAL },
        { label: "横", value: DIRECTIONS.HORIZONTAL },
      ],
    },
    price: {
      label: "価格",
      type: "number",
      min: 0,
    },
    priceSize: {
      label: "価格サイズ(Price Size)",
      type: "select",
      options: TEXT_SIZE_CLASSES.map((size) => ({
        label: size.replace("text-", ""),
        value: size,
      })),
    },
  },
  defaultProps: { ...iconMenuItemDefaultProps },
  render: (props) => {
    return <IconMenuPart {...props} />;
  },
};
