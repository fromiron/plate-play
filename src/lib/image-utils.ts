import { toPng } from "html-to-image";

export async function toDownloadPNG(
	node: HTMLElement,
	filename: string,
	opts?: { pixelRatio?: number },
) {
	const { pixelRatio = 2 } = opts ?? {};
	const dataUrl = await toPng(node, { pixelRatio, cacheBust: true });
	const link = document.createElement("a");
	link.download = filename;
	link.href = dataUrl;
	link.click();
}
