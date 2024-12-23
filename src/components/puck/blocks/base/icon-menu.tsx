import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentConfig } from "@measured/puck";

export type IconMenuProps = {
  icon: string;
  title: string;
  description: string;
  price: number;
  direction: "vertical" | "horizontal";
};

export const IconMenu: ComponentConfig<IconMenuProps> = {
  fields: {
    icon: {
      label: "アイコン",
      type: "text",
    },
    title: {
      label: "タイトル",
      type: "text",
    },
    description: {
      label: "説明",
      type: "text",
    },
    direction: {
      label: "方向",
      type: "radio",
      options: [
        { label: "縦", value: "vertical" },
        { label: "横", value: "horizontal" },
      ],
    },
    price: {
      label: "価格",
      type: "number",
      min: 0,
    },
  },
  defaultProps: {
    icon: "",
    title: "",
    description: "",
    direction: "vertical",
    price: 0,
  },
  render: ({ icon, title, description, direction }) => {
    const isVertical = direction === "vertical";
    return (
      <div className={cn("flex", { "flex-col": isVertical }, "p-4")}>
        <div
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "icon",
            }),
          )}
        >
          {icon}
        </div>
        <div>{title}</div>
        <div>{description}</div>
      </div>
    );
  },
};
