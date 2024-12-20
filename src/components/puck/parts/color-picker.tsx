import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ColorResult } from "react-color";
import { SketchPicker } from "react-color";

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          <div
            className={buttonVariants({
              variant: "outline",
              size: "icon",
            })}
            style={{ backgroundColor: value }}
          />
          <span className="text-xs">{value}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0 shadow-none">
        <SketchPicker
          color={value}
          onChange={({ rgb }: ColorResult) => {
            const { r, g, b, a } = rgb;
            const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
            onChange(rgba);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
