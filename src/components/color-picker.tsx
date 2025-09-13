"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    cmykToRgb,
    hexToHsv,
    hsvToHex,
    hsvToRgb,
    normalizeHex,
    rgbToCmyk,
    rgbToHex,
    isValidHexLoose,
} from "@/lib/color-utils";
import { Heart, Palette, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface ColorPickerProps {
	value: string; // hex
	onChange: (color: string) => void;
	label: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}

type ColorFormat = "hex" | "rgb" | "cmyk";

// 미리 정의된 색상 팔레트
const PRESET_COLORS = [
	"#16a34a",
	"#0ea5e9",
	"#f59e0b",
	"#dc2626",
	"#9333ea",
	"#e11d48",
	"#059669",
	"#0891b2",
	"#ca8a04",
	"#b91c1c",
	"#7c3aed",
	"#be123c",
	"#065f46",
	"#0c4a6e",
	"#92400e",
	"#991b1b",
	"#581c87",
	"#9f1239",
	"#064e3b",
	"#1e3a8a",
];

export function ColorPicker({
	value,
	onChange,
	label,
	open,
	onOpenChange,
	children,
}: ColorPickerProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [format, setFormat] = useState<ColorFormat>("hex");
	const [recentColors, setRecentColors] = useState<string[]>([]);
	const [favoriteColors, setFavoriteColors] = useState<string[]>([]);

	// HSV working state
	const initialHsv = useMemo(() => hexToHsv(value) ?? { h: 0, s: 100, v: 50 }, [value]);
	const [hsv, setHsv] = useState<{ h: number; s: number; v: number }>(initialHsv);

	// text input value for current format
	const [text, setText] = useState<string>("");

	const isOpen = open !== undefined ? open : internalOpen;
	const setIsOpen = onOpenChange || setInternalOpen;

	// localStorage 키들
	const RECENT_COLORS_KEY = "plate-play-recent-colors";
	const FAVORITE_COLORS_KEY = "plate-play-favorite-colors";

	useEffect(() => {
		try {
			const r = localStorage.getItem(RECENT_COLORS_KEY);
			const f = localStorage.getItem(FAVORITE_COLORS_KEY);
			if (r) setRecentColors(JSON.parse(r) || []);
			if (f) setFavoriteColors(JSON.parse(f) || []);
		} catch (e) {
			console.error("Error loading color history:", e);
		}
	}, []);

	// Reset state when opened
	useEffect(() => {
		if (isOpen) {
			const h = hexToHsv(value) ?? { h: 0, s: 100, v: 50 };
			setHsv(h);
			setText(formatValue(h, format));
		}
	}, [isOpen, value]);

	// Keep text in sync when hsv or format changes while open
	useEffect(() => {
		if (!isOpen) return;
		setText(formatValue(hsv, format));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hsv.h, hsv.s, hsv.v, format]);

	const hex = useMemo(() => hsvToHex(hsv.h, hsv.s, hsv.v), [hsv]);

	const applyColor = () => {
		const n = normalizeHex(hex);
		onChange(n);
		addToRecent(n);
		setIsOpen(false);
	};

	const addToRecent = (color: string) => {
		const next = [color, ...recentColors.filter((c) => c !== color)].slice(0, 10);
		setRecentColors(next);
		try {
			localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(next));
		} catch (e) {
			console.error("Error saving recent colors:", e);
		}
	};

	const toggleFavorite = (color: string) => {
		const next = favoriteColors.includes(color)
			? favoriteColors.filter((c) => c !== color)
			: [...favoriteColors, color];
		setFavoriteColors(next);
		try {
			localStorage.setItem(FAVORITE_COLORS_KEY, JSON.stringify(next));
		} catch (e) {
			console.error("Error saving favorite colors:", e);
		}
	};

	const handlePreset = (c: string) => {
		const h = hexToHsv(c);
		if (h) setHsv(h);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{children || (
					<Button variant="outline" className="w-full justify-start gap-2">
						<div
							className="h-4 w-4 rounded border border-gray-300"
							style={{ backgroundColor: value }}
						/>
						{label}
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="max-w-[680px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Palette className="h-5 w-5" />
						{label} 색상 선택
					</DialogTitle>
					<DialogDescription>포토샵 스타일의 색상 선택기입니다.</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-[1fr,260px]">
						<div className="space-y-3">
							<SaturationSquare hue={hsv.h} s={hsv.s} v={hsv.v} onChange={setHsv} />
							<HueSlider hue={hsv.h} onChange={(h) => setHsv((p) => ({ ...p, h }))} />
						</div>

						<div className="space-y-3">
							<Label>미리보기</Label>
							<div
								className="h-20 w-full rounded-md border"
								style={{ backgroundColor: hex }}
							/>

							<div className="flex gap-2">
								<Select value={format} onValueChange={(v) => setFormat(v as ColorFormat)}>
									<SelectTrigger className="h-9 w-[100px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="hex">HEX</SelectItem>
										<SelectItem value="rgb">RGB</SelectItem>
										<SelectItem value="cmyk">CMYK</SelectItem>
									</SelectContent>
								</Select>
								<Input
									value={text}
									onChange={(e) => setText(e.target.value)}
									onBlur={() => {
										const parsed = parseInput(text, format);
										if (!parsed) {
											setText(formatValue(hsv, format));
											return;
										}
										setHsv(parsed);
									}}
									placeholder={placeholderFor(format)}
								/>
							</div>

							<div className="space-y-2">
								<Label>프리셋 색상</Label>
								<div className="grid grid-cols-10 gap-1">
									{PRESET_COLORS.map((c) => (
										<button
											key={c}
											type="button"
											className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
											style={{ backgroundColor: c }}
											onClick={() => handlePreset(c)}
										/>
									))}
								</div>
							</div>

							{favoriteColors.length > 0 && (
								<div className="space-y-2">
									<Label className="flex items-center gap-1">
										<Heart className="h-4 w-4" /> 즐겨찾기
									</Label>
									<div className="flex flex-wrap gap-1">
										{favoriteColors.map((c) => (
											<div key={c} className="group relative">
												<button
													type="button"
													className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
													style={{ backgroundColor: c }}
													onClick={() => handlePreset(c)}
												/>
												<button
													type="button"
													className="-top-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
													onClick={(e) => {
													e.stopPropagation();
													toggleFavorite(c);
												}}
												>
													<X className="h-2 w-2" />
												</button>
											</div>
										))}
									</div>
								</div>
							)}

							{recentColors.length > 0 && (
								<div className="space-y-2">
									<Label className="flex items-center gap-1">
										<RotateCcw className="h-4 w-4" /> 최근 사용
									</Label>
									<div className="flex flex-wrap gap-1">
										{recentColors.map((c, i) => (
											<button
												key={`recent-${c}-${i}`}
												type="button"
												className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
												style={{ backgroundColor: c }}
												onClick={() => handlePreset(c)}
											/>
										))}
									</div>
								</div>
							)}

							<div className="flex items-center justify-between pt-1">
								<Button
									variant="outline"
									size="sm"
									onClick={() => toggleFavorite(hex)}
									className="flex items-center gap-1"
								>
									<Heart
										className={cn(
											"h-4 w-4",
											favoriteColors.includes(hex) ? "fill-red-500 text-red-500" : "",
										)}
									/>
									{favoriteColors.includes(hex) ? "제거" : "즐겨찾기"}
								</Button>
								<div className="space-x-2">
									<Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
										취소
									</Button>
									<Button size="sm" onClick={applyColor}>
										적용
									</Button>
								</div>
							</div>
						</div>
					</div>
			</DialogContent>
		</Dialog>
	);
}

// ======== Internal UI ========
function SaturationSquare({
	hue,
	s,
	v,
	onChange,
}: {
	hue: number;
	s: number;
	v: number;
	onChange: (next: { h: number; s: number; v: number }) => void;
}) {
	const ref = useRef<HTMLDivElement | null>(null);

	const updateFromEvent = (clientX: number, clientY: number) => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		let x = (clientX - rect.left) / rect.width; // 0..1
		let y = (clientY - rect.top) / rect.height; // 0..1
		x = Math.min(1, Math.max(0, x));
		y = Math.min(1, Math.max(0, y));
		const S = Math.round(x * 100);
		const V = Math.round((1 - y) * 100);
		onChange({ h: hue, s: S, v: V });
	};

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.currentTarget.setPointerCapture(e.pointerId);
		updateFromEvent(e.clientX, e.clientY);
	};
	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (e.buttons !== 1) return;
		updateFromEvent(e.clientX, e.clientY);
	};

	return (
		<div className="relative select-none">
			<div
				ref={ref}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				className="h-[260px] w-full cursor-crosshair rounded-md border"
				style={{
					backgroundColor: `hsl(${hue} 100% 50%)`,
					backgroundImage:
						"linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0))",
				}}
			/>
			{/* thumb */}
			<div
				className="pointer-events-none absolute size-4 translate-x-[-8px] translate-y-[-8px] rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
				style={{ left: `${s}%`, top: `${100 - v}%` }}
			/>
		</div>
	);
}

function HueSlider({ hue, onChange }: { hue: number; onChange: (h: number) => void }) {
	const ref = useRef<HTMLDivElement | null>(null);
	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.currentTarget.setPointerCapture(e.pointerId);
		update(e.clientX);
	};
	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (e.buttons !== 1) return;
		update(e.clientX);
	};
	const update = (clientX: number) => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		let x = (clientX - rect.left) / rect.width;
		x = Math.min(1, Math.max(0, x));
		onChange(Math.round(x * 360));
	};
	return (
		<div className="relative">
			<div
				ref={ref}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				className="h-4 w-full cursor-pointer rounded-md border"
				style={{
					background:
						"linear-gradient(90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
				}}
			/>
			<div
				className="pointer-events-none absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
				style={{ left: `calc(${(hue / 360) * 100}% - 6px)` }}
			/>
		</div>
	);
}

// ======== Parsing / Formatting ========
function formatValue(hsv: { h: number; s: number; v: number }, format: ColorFormat): string {
	const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v);
	if (format === "hex") return rgbToHex(r, g, b);
	if (format === "rgb") return `${r}, ${g}, ${b}`;
	const { c, m, y, k } = rgbToCmyk(r, g, b);
	return `${c}, ${m}, ${y}, ${k}`;
}

function placeholderFor(format: ColorFormat): string {
	if (format === "hex") return "#16a34a";
	if (format === "rgb") return "22, 163, 74";
	return "75, 0, 55, 36";
}

function parseInput(text: string, format: ColorFormat): { h: number; s: number; v: number } | null {
	const t = text.trim();
	if (format === "hex") {
		if (!isValidHexLoose(t)) return null;
		const hsv = hexToHsv(t);
		return hsv ?? null;
	}
	if (format === "rgb") {
		const cleaned = t
			.replace(/rgb\(/i, "")
			.replace(/\)/g, "")
			.replace(/\s+/g, " ")
			.replace(/\s*,\s*/g, ",")
			.trim();
		const parts = cleaned.split(",");
		if (parts.length !== 3) return null;
		const [r, g, b] = parts.map((p) => Number.parseInt(p, 10));
		if ([r, g, b].some((n) => Number.isNaN(n) || n < 0 || n > 255)) return null;
		return hexToHsv(rgbToHex(r, g, b));
	}
	// CMYK
	const cleaned = t
		.replace(/cmyk\(/i, "")
		.replace(/\)/g, "")
		.replace(/%/g, "")
		.replace(/\s*,\s*/g, ",")
		.replace(/\s+/g, " ")
		.trim();
	const parts = cleaned.split(",");
	if (parts.length !== 4) return null;
	const [c, m, y, k] = parts.map((p) => Number.parseFloat(p));
	if ([c, m, y, k].some((n) => Number.isNaN(n) || n < 0 || n > 100)) return null;
	const { r, g, b } = cmykToRgb(c, m, y, k);
	return hexToHsv(rgbToHex(r, g, b));
}
