import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const labelize = (str: string, removeString = "") => {
  if (!str) return "";
  const modifiedStr = str.replace(removeString, "");
  return modifiedStr.charAt(0).toUpperCase() + modifiedStr.slice(1);
};
