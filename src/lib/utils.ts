import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * クラス名を結合し、Tailwind CSSのクラスをマージします。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 文字列をラベル形式に変換します。
 * plateブロックの設定項目のラベルを生成する際に使用します。
 */
export const labelize = (str: string, removeString = ""): string => {
  if (!str) return "";
  const modifiedStr = str.replace(removeString, "");
  const result = modifiedStr.charAt(0).toUpperCase() + modifiedStr.slice(1);
  if (result === "") return "Default";
  return modifiedStr.charAt(0).toUpperCase() + modifiedStr.slice(1);
};
