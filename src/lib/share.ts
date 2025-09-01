import type { MenuBoard } from "./types";

export function buildLocalMenuUrl(id: string) {
  if (typeof window === "undefined") return `/menu/${id}`;
  const origin = window.location.origin;
  return `${origin}/menu/${id}`;
}

export function encodeBoardToQuery(board: MenuBoard): string {
  const json = JSON.stringify(board);
  const b64 =
    typeof window !== "undefined"
      ? window.btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json, "utf-8").toString("base64");
  return b64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeBoardFromQuery(dataParam: string): MenuBoard | null {
  try {
    const b64 = dataParam.replaceAll("-", "+").replaceAll("_", "/");
    const padded = b64 + "===".slice((b64.length + 3) % 4);
    const json =
      typeof window !== "undefined"
        ? decodeURIComponent(escape(window.atob(padded)))
        : Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json) as MenuBoard;
  } catch {
    return null;
  }
}

export function buildShareUrl(board: MenuBoard): string {
  if (typeof window === "undefined") return `/menu/${board.id}`;
  const origin = window.location.origin;
  const data = encodeBoardToQuery(board);
  return `${origin}/menu/${board.id}?data=${data}`;
}
