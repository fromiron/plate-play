import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ColorResult } from "react-color";
import { SketchPicker } from "react-color";

export function ColorPicker({
  value = "rgba(0, 0, 0, 1)",
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="group flex cursor-pointer items-center gap-2">
          <div
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon",
              }),
              "group-hover:opacity-80 group-hover:shadow-md",
            )}
            style={{ backgroundColor: value }}
          />
          {label ?? <span className="text-xs">{value}</span>}
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
