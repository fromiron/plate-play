"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

type SortableRowProps = {
	id: string;
	children?: ReactNode | ((props: { dragHandleProps: any }) => ReactNode);
};

export function SortableRow({ id, children }: SortableRowProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const dragHandleProps = { ...attributes, ...listeners };

	return (
		<div ref={setNodeRef} style={style} className="w-full">
			{typeof children === "function"
				? children({ dragHandleProps })
				: children}
		</div>
	);
}
