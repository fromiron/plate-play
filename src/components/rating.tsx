"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Stars({
	value = 0,
	onChange,
	size = 16,
	readOnly = false,
}: {
	value?: number;
	onChange?: (v: number) => void;
	size?: number;
	readOnly?: boolean;
}) {
	const [hover, setHover] = useState<number | null>(null);
	const disp = hover ?? value;
	return (
		<div className="flex items-center gap-1">
			{[1, 2, 3, 4, 5].map((i) => (
				<button
					key={i}
					type="button"
					onMouseEnter={() => !readOnly && setHover(i)}
					onMouseLeave={() => setHover(null)}
					onClick={() => !readOnly && onChange?.(i)}
					aria-label={`${i}점`}
					className={cn(
						"text-muted-foreground",
						readOnly ? "cursor-default" : "cursor-pointer",
					)}
				>
					<Star
						className={cn(disp >= i ? "fill-yellow-400 text-yellow-400" : "")}
						style={{ width: size, height: size }}
					/>
				</button>
			))}
		</div>
	);
}
