"use client";

import {
	Copy,
	Heart,
	HeartMinus,
	HeartPlus,
	Palette,
	RotateCcw,
	X,
} from "lucide-react";
import type * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	cmykToRgb,
	hexToHsv,
	hsvToHex,
	hsvToRgb,
	isValidHexLoose,
	normalizeHex,
	rgbToCmyk,
	rgbToHex,
} from "@/lib/color-utils";

interface ColorPickerProps {
	value: string; // hex
	onChange: (color: string) => void;
	label: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}

// no ColorFormat selector; show all models side-by-side

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
	const [recentColors, setRecentColors] = useState<string[]>([]);
	const [favoriteColors, setFavoriteColors] = useState<string[]>([]);

	// HSV working state
	const initialHsv = useMemo(
		() => hexToHsv(value) ?? { h: 0, s: 100, v: 50 },
		[value],
	);
	const [hsv, setHsv] = useState<{ h: number; s: number; v: number }>(
		initialHsv,
	);

	// text inputs for each model
	const [hexText, setHexText] = useState<string>("");
	const [rText, setRText] = useState<string>("");
	const [gText, setGText] = useState<string>("");
	const [bText, setBText] = useState<string>("");
	const [cText, setCText] = useState<string>("");
	const [mText, setMText] = useState<string>("");
	const [yText, setYText] = useState<string>("");
	const [kText, setKText] = useState<string>("");

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
		}
	}, [isOpen, value]);

	// Keep per-model inputs in sync with hsv while open
	useEffect(() => {
		if (!isOpen) return;
		const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v);
		const { c, m, y, k } = rgbToCmyk(r, g, b);
		setHexText(rgbToHex(r, g, b));
		setRText(String(r));
		setGText(String(g));
		setBText(String(b));
		setCText(String(c));
		setMText(String(m));
		setYText(String(y));
		setKText(String(k));
	}, [hsv, isOpen]);

	const hex = useMemo(() => hsvToHex(hsv.h, hsv.s, hsv.v), [hsv]);
	const normalizedHex = useMemo(() => normalizeHex(hex), [hex]);

	const isFavorite = favoriteColors.includes(normalizedHex);

	const clampToRangeInt = (
		s: string,
		min: number,
		max: number,
	): number | null => {
		const n = Number.parseInt(s, 10);
		if (Number.isNaN(n)) return null;
		return Math.min(max, Math.max(min, n));
	};
	const clampToRangeFloat = (
		s: string,
		min: number,
		max: number,
	): number | null => {
		const n = Number.parseFloat(s);
		if (Number.isNaN(n)) return null;
		return Math.min(max, Math.max(min, n));
	};

	const commitCmyk = () => {
		const c = clampToRangeFloat(cText, 0, 100);
		const m = clampToRangeFloat(mText, 0, 100);
		const y = clampToRangeFloat(yText, 0, 100);
		const k = clampToRangeFloat(kText, 0, 100);
		if (c == null || m == null || y == null || k == null) {
			const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v);
			const { c: cc, m: mm, y: yy, k: kk } = rgbToCmyk(r, g, b);
			setCText(String(cc));
			setMText(String(mm));
			setYText(String(yy));
			setKText(String(kk));
			return;
		}
		const { r, g, b } = cmykToRgb(c, m, y, k);
		const next = hexToHsv(rgbToHex(r, g, b));
		if (next) setHsv(next);
	};

	const applyColor = () => {
		const n = normalizeHex(hex);
		onChange(n);
		addToRecent(n);
		setIsOpen(false);
	};

	const addToRecent = (color: string) => {
		const next = [color, ...recentColors.filter((c) => c !== color)].slice(
			0,
			10,
		);
		setRecentColors(next);
		try {
			localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(next));
		} catch (e) {
			console.error("Error saving recent colors:", e);
		}
	};

	const toggleFavorite = (color: string) => {
		const n = normalizeHex(color);
		const next = favoriteColors.includes(n)
			? favoriteColors.filter((c) => c !== n)
			: [...favoriteColors, n];
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
							className="h-4 w-4 rounded"
							style={{ backgroundColor: value }}
						/>
						{label}
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="max-w-xl sm:max-w-xl lg:max-w-2xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Palette className="h-5 w-5" />
						{label} 색상 선택
					</DialogTitle>
					<DialogDescription>
						색상을 선택하거나 직접 입력할 수 있습니다.
						<br />
						즐겨찾기한 색상은 <strong>빨간 하트</strong> 아이콘을 눌러 추가/제거
						할 수 있습니다.
						<br />
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="flex gap-x-4">
						<div className="flex-2 space-y-3">
							<div className="relative aspect-square">
								<SaturationSquare
									hue={hsv.h}
									s={hsv.s}
									v={hsv.v}
									onChange={setHsv}
								/>
							</div>
							<HueSlider
								hue={hsv.h}
								onChange={(h) => setHsv((p) => ({ ...p, h }))}
							/>
							<div className="space-y-3">
								{/* Color model inputs */}
								<div className="space-y-2">
									{/* HEX */}
									<div className="flex items-center gap-2">
										<Label className="w-16 min-w-16 text-sm">HEX</Label>
										<Input
											value={hexText}
											onChange={(e) => setHexText(e.target.value)}
											className="w-full"
											onBlur={() => {
												const v = hexText.trim();
												if (!isValidHexLoose(v)) {
													setHexText(normalizedHex);
													return;
												}
												const h = hexToHsv(v);
												if (h) setHsv(h);
											}}
											placeholder="#16a34a"
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												navigator.clipboard?.writeText(normalizedHex)
											}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>

									{/* RGB */}
									<div className="flex items-center gap-2">
										<Label className="w-16 min-w-16 text-sm ">RGB</Label>
										<Input
											type="number"
											inputMode="numeric"
											min={0}
											max={255}
											step={1}
											noAppearance
											value={rText}
											onChange={(e) => setRText(e.target.value)}
											onBlur={() => {
												const r = clampToRangeInt(rText, 0, 255);
												const g = clampToRangeInt(gText, 0, 255);
												const b = clampToRangeInt(bText, 0, 255);
												if (r == null || g == null || b == null) {
													// reset
													const {
														r: rr,
														g: gg,
														b: bb,
													} = hsvToRgb(hsv.h, hsv.s, hsv.v);
													setRText(String(rr));
													setGText(String(gg));
													setBText(String(bb));
													return;
												}
												const next = hexToHsv(rgbToHex(r, g, b));
												if (next) setHsv(next);
											}}
											className="w-full"
											placeholder="R"
										/>
										<Input
											type="number"
											inputMode="numeric"
											min={0}
											max={255}
											step={1}
											noAppearance
											value={gText}
											onChange={(e) => setGText(e.target.value)}
											onBlur={() => {
												const r = clampToRangeInt(rText, 0, 255);
												const g = clampToRangeInt(gText, 0, 255);
												const b = clampToRangeInt(bText, 0, 255);
												if (r == null || g == null || b == null) {
													const {
														r: rr,
														g: gg,
														b: bb,
													} = hsvToRgb(hsv.h, hsv.s, hsv.v);
													setRText(String(rr));
													setGText(String(gg));
													setBText(String(bb));
													return;
												}
												const next = hexToHsv(rgbToHex(r, g, b));
												if (next) setHsv(next);
											}}
											className="w-full"
											placeholder="G"
										/>
										<Input
											type="number"
											inputMode="numeric"
											min={0}
											max={255}
											step={1}
											noAppearance
											value={bText}
											onChange={(e) => setBText(e.target.value)}
											onBlur={() => {
												const r = clampToRangeInt(rText, 0, 255);
												const g = clampToRangeInt(gText, 0, 255);
												const b = clampToRangeInt(bText, 0, 255);
												if (r == null || g == null || b == null) {
													const {
														r: rr,
														g: gg,
														b: bb,
													} = hsvToRgb(hsv.h, hsv.s, hsv.v);
													setRText(String(rr));
													setGText(String(gg));
													setBText(String(bb));
													return;
												}
												const next = hexToHsv(rgbToHex(r, g, b));
												if (next) setHsv(next);
											}}
											className="w-full"
											placeholder="B"
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => {
												const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v);
												navigator.clipboard?.writeText(`${r}, ${g}, ${b}`);
											}}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>

									{/* CMYK */}
									<div className="flex items-center gap-2">
										<Label className="w-16 min-w-16 text-sm ">CMYK</Label>
										{/** C **/}
										<Input
											type="number"
											inputMode="numeric"
											min={0}
											max={100}
											step={1}
											noAppearance
											value={cText}
											onChange={(e) => setCText(e.target.value)}
											onBlur={() => commitCmyk()}
											className="w-full"
											placeholder="C"
										/>
										{/** M **/}
										<Input
											type="number"
											inputMode="numeric"
											min={0}
											max={100}
											step={1}
											noAppearance
											value={mText}
											onChange={(e) => setMText(e.target.value)}
											onBlur={() => commitCmyk()}
											className="w-full"
											placeholder="M"
										/>
										{/** Y **/}
										<Input
											type="number"
											inputMode="numeric"
											min={0}
											max={100}
											step={1}
											noAppearance
											value={yText}
											onChange={(e) => setYText(e.target.value)}
											onBlur={() => commitCmyk()}
											className="w-full"
											placeholder="Y"
										/>
										{/** K **/}
										<Input
											type="number"
											inputMode="numeric"
											min={0}
											max={100}
											step={1}
											noAppearance
											value={kText}
											onChange={(e) => setKText(e.target.value)}
											onBlur={() => commitCmyk()}
											className="w-full"
											placeholder="K"
										/>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => {
												const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v);
												const { c, m, y, k } = rgbToCmyk(r, g, b);
												navigator.clipboard?.writeText(
													`${c}, ${m}, ${y}, ${k}`,
												);
											}}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>
						</div>
						<div className="flex-1 space-y-4 rounded-xl bg-gray-100 p-4">
							<div className="-mb-1 inline-flex items-center">
								{isFavorite ? (
									<Label>
										<HeartPlus className="h-4 w-4" /> 즐겨찾기 추가
									</Label>
								) : (
									<Label>
										<HeartPlus className="h-4 w-4" /> 즐겨찾기 제거
									</Label>
								)}
							</div>
							<button
								type="button"
								aria-pressed={isFavorite}
								aria-label={
									isFavorite ? "즐겨찾기에서 제거" : "즐겨찾기에 추가"
								}
								onClick={() => toggleFavorite(normalizedHex)}
								className="h-12 w-full cursor-pointer rounded-md"
								style={{ backgroundColor: hex }}
							>
								{isFavorite ? (
									<HeartMinus className="mx-auto h-6 w-6 text-white" />
								) : (
									<HeartPlus className="mx-auto h-6 w-6 text-white" />
								)}
							</button>

							<div className="space-y-2">
								<Label>
									<Palette className="h-4 w-4" /> 프리셋 색상
								</Label>
								<div className="grid grid-cols-5 gap-2">
									{PRESET_COLORS.map((c) => (
										<Button
											key={c}
											type="button"
											size="icon-circle"
											className="cursor-pointer hover:scale-110"
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

									<div className="grid grid-cols-5 gap-2">
										{favoriteColors.map((c) => (
											<div key={c} className="group relative">
												<Button
													type="button"
													size="icon-circle"
													className="cursor-pointer hover:scale-110"
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
									<div className="grid grid-cols-5 gap-2">
										{recentColors.map((c) => (
											<Button
												key={c}
												type="button"
												size="icon-circle"
												className="cursor-pointer hover:scale-110"
												style={{ backgroundColor: c }}
												onClick={() => handlePreset(c)}
											/>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center justify-between pt-1">
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsOpen(false)}
							>
								취소
							</Button>
							<Button size="sm" onClick={applyColor}>
								적용
							</Button>
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
		<div className="absolute inset-0 select-none">
			<div
				ref={ref}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				className="h-full w-full cursor-crosshair rounded-md"
				style={{
					backgroundColor: `hsl(${hue} 100% 50%)`,
					backgroundImage:
						"linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0))",
				}}
			/>
			{/* thumb */}
			<div
				className="pointer-events-none absolute size-4 translate-x-[-8px] translate-y-[-8px] rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
				style={{ left: `${s}%`, top: `${100 - v}%` }}
			/>
		</div>
	);
}

function HueSlider({
	hue,
	onChange,
}: {
	hue: number;
	onChange: (h: number) => void;
}) {
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
				className="h-4 w-full cursor-pointer rounded-md"
				style={{
					background:
						"linear-gradient(90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
				}}
			/>
			<div
				className="-translate-y-1/2 pointer-events-none absolute top-1/2 size-3 rounded-full"
				style={{ left: `calc(${(hue / 360) * 100}% - 6px)` }}
			/>
		</div>
	);
}
