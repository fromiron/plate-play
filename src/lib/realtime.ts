"use client";

import type { MenuBoard } from "./types";

const CHANNEL = "plateplay:board";

type Event = { type: "BOARD_UPDATE"; payload: MenuBoard };

let bc: BroadcastChannel | null = null;

function getChannel() {
	if (typeof window === "undefined") return null;
	if (!bc) bc = new BroadcastChannel(CHANNEL);
	return bc;
}

export function broadcastBoardUpdate(board: MenuBoard) {
	const ch = getChannel();
	ch?.postMessage({ type: "BOARD_UPDATE", payload: board } as Event);
}

export function listenBoardUpdates(onBoard: (b: MenuBoard) => void) {
	const ch = getChannel();
	if (!ch) return () => {};
	const handler = (e: MessageEvent<Event>) => {
		if (e.data?.type === "BOARD_UPDATE") onBoard(e.data.payload);
	};
	ch.addEventListener("message", handler as any);
	return () => ch.removeEventListener("message", handler as any);
}
