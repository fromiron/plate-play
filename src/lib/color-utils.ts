// 색상 유효성 검증 함수
export const isValidHexColor = (color: string): boolean => {
	return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
};

// Hex to RGB 변환 (3자리와 6자리 모두 지원)
export const hexToRgb = (
	hex: string,
): { r: number; g: number; b: number } | null => {
	// # 제거
	const cleanHex = hex.replace(/^#/, "");

	// 3자리 hex를 6자리로 확장 (예: "fff" -> "ffffff")
	let fullHex: string;
	if (cleanHex.length === 3) {
		fullHex = cleanHex
			.split("")
			.map((c) => c + c)
			.join("");
	} else if (cleanHex.length === 6) {
		fullHex = cleanHex;
	} else {
		return null;
	}

	const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
	return result?.[1] && result[2] && result[3]
		? {
				r: Number.parseInt(result[1], 16),
				g: Number.parseInt(result[2], 16),
				b: Number.parseInt(result[3], 16),
			}
		: null;
};

// RGB to Hex 변환
export const rgbToHex = (r: number, g: number, b: number): string => {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Clamp helper
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// ========== HSV/HSL ==========
// RGB [0-255] -> HSV {h [0-360], s [0-100], v [0-100]}
export const rgbToHsv = (
	rInput: number,
	gInput: number,
	bInput: number,
): { h: number; s: number; v: number } => {
	const r = rInput / 255;
	const g = gInput / 255;
	const b = bInput / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const d = max - min;
	let h = 0;
	if (d !== 0) {
		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
				break;
			case g:
				h = ((b - r) / d + 2) * 60;
				break;
			case b:
				h = ((r - g) / d + 4) * 60;
				break;
		}
	}
	const s = max === 0 ? 0 : d / max;
	const v = max;
	return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(v * 100) };
};

// HSV -> RGB
export const hsvToRgb = (
	h: number,
	sPercent: number,
	vPercent: number,
): { r: number; g: number; b: number } => {
	const s = clamp(sPercent, 0, 100) / 100;
	const v = clamp(vPercent, 0, 100) / 100;
	const hh = ((h % 360) + 360) % 360; // normalize
	const c = v * s;
	const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
	const m = v - c;
	let r1 = 0,
		g1 = 0,
		b1 = 0;
	if (hh < 60) {
		r1 = c;
		g1 = x;
		b1 = 0;
	} else if (hh < 120) {
		r1 = x;
		g1 = c;
		b1 = 0;
	} else if (hh < 180) {
		r1 = 0;
		g1 = c;
		b1 = x;
	} else if (hh < 240) {
		r1 = 0;
		g1 = x;
		b1 = c;
	} else if (hh < 300) {
		r1 = x;
		g1 = 0;
		b1 = c;
	} else {
		r1 = c;
		g1 = 0;
		b1 = x;
	}
	return {
		r: Math.round((r1 + m) * 255),
		g: Math.round((g1 + m) * 255),
		b: Math.round((b1 + m) * 255),
	};
};

// HSL to RGB 변환
export const hslToRgb = (
	hInput: number,
	sInput: number,
	lInput: number,
): { r: number; g: number; b: number } => {
	const h = hInput / 360;
	const s = sInput / 100;
	const l = lInput / 100;

	const hue2rgb = (p: number, q: number, tInput: number): number => {
		let t = tInput;
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};

	let r: number;
	let g: number;
	let b: number;

	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255),
	};
};

// RGB to HSL 변환
export const rgbToHsl = (
	rInput: number,
	gInput: number,
	bInput: number,
): { h: number; s: number; l: number } => {
	const r = rInput / 255;
	const g = gInput / 255;
	const b = bInput / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h: number;
	let s: number;
	const l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
			default:
				h = 0; // 이 경우는 실제로는 발생하지 않지만 TypeScript를 위해 추가
				break;
		}

		h /= 6;
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
};

// ========== CMYK ==========
// RGB [0-255] -> CMYK [0-100]
export const rgbToCmyk = (
	r: number,
	g: number,
	b: number,
): { c: number; m: number; y: number; k: number } => {
	const rr = r / 255;
	const gg = g / 255;
	const bb = b / 255;
	const k = 1 - Math.max(rr, gg, bb);
	if (k === 1) {
		return { c: 0, m: 0, y: 0, k: 100 };
	}
	const c = (1 - rr - k) / (1 - k);
	const m = (1 - gg - k) / (1 - k);
	const y = (1 - bb - k) / (1 - k);
	return {
		c: Math.round(c * 100),
		m: Math.round(m * 100),
		y: Math.round(y * 100),
		k: Math.round(k * 100),
	};
};

// CMYK [0-100] -> RGB [0-255]
export const cmykToRgb = (
	c: number,
	m: number,
	y: number,
	k: number,
): { r: number; g: number; b: number } => {
	const C = clamp(c, 0, 100) / 100;
	const M = clamp(m, 0, 100) / 100;
	const Y = clamp(y, 0, 100) / 100;
	const K = clamp(k, 0, 100) / 100;
	const r = 255 * (1 - C) * (1 - K);
	const g = 255 * (1 - M) * (1 - K);
	const b = 255 * (1 - Y) * (1 - K);
	return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
};

// Convenience helpers
export const hexToHsv = (hex: string): { h: number; s: number; v: number } | null => {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;
	return rgbToHsv(rgb.r, rgb.g, rgb.b);
};

export const hsvToHex = (h: number, s: number, v: number): string => {
	const { r, g, b } = hsvToRgb(h, s, v);
	return rgbToHex(r, g, b);
};

export const normalizeHex = (input: string): string => {
	if (!input) return "#000000";
	let v = input.trim().toLowerCase();
	if (!v.startsWith("#")) v = `#${v}`;
    const short = v.match(/^#([0-9a-f]{3})$/);
    if (short) {
        const s = short[1]!;
        v = `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`;
    }
	if (!/^#([0-9a-f]{6})$/.test(v)) return "#000000";
	return v;
};

export const isValidHexLoose = (input: string): boolean => {
	if (!input) return false;
	let v = input.trim().toLowerCase();
	if (!v.startsWith("#")) v = `#${v}`;
	return /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(v);
};

export const safeHexForColorInput = (hex: string): string =>
	/^#([0-9a-f]{6})$/i.test(hex) ? hex : "#000000";
