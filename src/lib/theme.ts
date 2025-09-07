function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}

export function hexToHsl(hex: string) {
	let sHex = hex.replace("#", "");
	if (sHex.length === 3)
		sHex = sHex
			.split("")
			.map((x) => x + x)
			.join("");
	const r = Number.parseInt(sHex.substring(0, 2), 16) / 255;
	const g = Number.parseInt(sHex.substring(2, 4), 16) / 255;
	const b = Number.parseInt(sHex.substring(4, 6), 16) / 255;
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h = 0,
		s = 0,
		l = (max + min) / 2;
	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 1);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number) {
	h = clamp(h, 0, 360);
	s = clamp(s, 0, 100);
	l = clamp(l, 0, 100);
	s /= 100;
	l /= 100;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0,
		g = 0,
		b = 0;
	if (h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (h < 300) {
		r = x;
		g = 0;
		b = c;
	} else {
		r = c;
		g = 0;
		b = x;
	}
	const toHex = (v: number) =>
		Math.round((v + m) * 255)
			.toString(16)
			.padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function suggestPalette(base: string) {
	try {
		const { h, s, l } = hexToHsl(base);
		const primary = base;
		const secondary = hslToHex(
			(h + 200) % 360,
			Math.min(90, s + 10),
			Math.min(90, l + 10),
		);
		const accent = hslToHex(
			(h + 40) % 360,
			Math.min(95, s + 20),
			Math.max(30, l - 10),
		);
		return { primary, secondary, accent };
	} catch {
		return {
			primary: base || "#16a34a",
			secondary: "#0ea5e9",
			accent: "#f59e0b",
		};
	}
}

export const FONT_PAIRS = [
	{ id: "inter-playfair", label: "Inter + Playfair (모던/세련)" },
	{ id: "inter-merriweather", label: "Inter + Merriweather (읽기좋음)" },
	{ id: "inter-roboto-slab", label: "Inter + Roboto Slab (견고함)" },
];
