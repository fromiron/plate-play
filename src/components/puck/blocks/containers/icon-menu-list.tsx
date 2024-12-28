import { generateId } from "@/lib/generate-id";
import { type ComponentConfig } from "@measured/puck";
import {
  IconMenuItem,
  iconMenuItemDefaultProps,
  type IconMenuItemProps,
} from "@/components/puck/blocks/base/icon-menu-item";
import { IconMenuPart } from "@/components/puck/blocks/parts/icon-menu-part";

export type IconMenuListProps = {
  iconMenuItems: IconMenuItemProps[];
};

export const IconMenuList: ComponentConfig<IconMenuListProps> = {
  fields: {
    iconMenuItems: {
      type: "array",
      arrayFields: { ...IconMenuItem.fields! },
    },
  },
  defaultProps: {
    iconMenuItems: [{ ...iconMenuItemDefaultProps }],
  },
  render: ({ iconMenuItems = [] }) => {
    return (
      <ul className="flex flex-col items-start">
        {iconMenuItems.map((item) => (
          <li key={generateId()}>
            <IconMenuPart {...item} />
          </li>
        ))}
      </ul>
    );
  },
};
