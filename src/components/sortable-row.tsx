"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

type SortableRowProps = {
	id: string;
	children?:
		| ReactNode
		| ((props: {
				attributes: DraggableAttributes;
				listeners: SyntheticListenerMap | undefined;
		  }) => ReactNode);
};

export function SortableRow({ id, children }: SortableRowProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} className="w-full">
			{typeof children === "function"
				? children({ attributes, listeners })
				: children}
		</div>
	);
}
