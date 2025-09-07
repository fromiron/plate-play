"use client";

import { Badge } from "@/components/ui/badge";
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
import { Heart, Palette, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ColorPickerProps {
	value: string;
	onChange: (color: string) => void;
	label: string;
	children?: React.ReactNode;
}

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

// 색상 유효성 검증 함수
const isValidHexColor = (color: string): boolean => {
	return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
};

// Hex to RGB 변환
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result && result[1] && result[2] && result[3]
		? {
				r: Number.parseInt(result[1], 16),
				g: Number.parseInt(result[2], 16),
				b: Number.parseInt(result[3], 16),
			}
		: null;
};

// RGB to Hex 변환
const rgbToHex = (r: number, g: number, b: number): string => {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// HSL to RGB 변환
const hslToRgb = (
	h: number,
	s: number,
	l: number,
): { r: number; g: number; b: number } => {
	h /= 360;
	s /= 100;
	l /= 100;

	const hue2rgb = (p: number, q: number, t: number): number => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};

	let r: number, g: number, b: number;

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
const rgbToHsl = (
	r: number,
	g: number,
	b: number,
): { h: number; s: number; l: number } => {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h: number, s: number;
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
				h = 0;
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

export function ColorPicker({
	value,
	onChange,
	label,
	children,
}: ColorPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [tempColor, setTempColor] = useState(value);
	const [hexInput, setHexInput] = useState(value);
	const [rgbInput, setRgbInput] = useState({ r: 0, g: 0, b: 0 });
	const [hslInput, setHslInput] = useState({ h: 0, s: 0, l: 0 });
	const [recentColors, setRecentColors] = useState<string[]>([]);
	const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
	const [inputMode, setInputMode] = useState<"hex" | "rgb" | "hsl">("hex");

	// localStorage 키들
	const RECENT_COLORS_KEY = "plate-play-recent-colors";
	const FAVORITE_COLORS_KEY = "plate-play-favorite-colors";

	// 최근 색상과 즐겨찾기 색상 로드
	useEffect(() => {
		try {
			const savedRecentColors = localStorage.getItem(RECENT_COLORS_KEY);
			const savedFavoriteColors = localStorage.getItem(FAVORITE_COLORS_KEY);

			if (savedRecentColors) {
				setRecentColors(JSON.parse(savedRecentColors) || []);
			}
			if (savedFavoriteColors) {
				setFavoriteColors(JSON.parse(savedFavoriteColors) || []);
			}
		} catch (error) {
			console.error("Error loading color history:", error);
		}
	}, []);

	// 모달이 열릴 때 현재 색상으로 초기화
	useEffect(() => {
		if (isOpen) {
			setTempColor(value);
			setHexInput(value);
			updateRgbFromHex(value);
			updateHslFromHex(value);
		}
	}, [isOpen, value]);

	// Hex에서 RGB 업데이트
	const updateRgbFromHex = (hex: string) => {
		const rgb = hexToRgb(hex);
		if (rgb) {
			setRgbInput(rgb);
		}
	};

	// Hex에서 HSL 업데이트
	const updateHslFromHex = (hex: string) => {
		const rgb = hexToRgb(hex);
		if (rgb) {
			const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
			setHslInput(hsl);
		}
	};

	// 색상 변경 처리
	const handleColorChange = (newColor: string) => {
		if (!isValidHexColor(newColor)) return;

		setTempColor(newColor);
		setHexInput(newColor);
		updateRgbFromHex(newColor);
		updateHslFromHex(newColor);
	};

	// Hex 입력 처리
	const handleHexInputChange = (hex: string) => {
		setHexInput(hex);
		if (isValidHexColor(hex)) {
			handleColorChange(hex);
		}
	};

	// RGB 입력 처리
	const handleRgbChange = (component: "r" | "g" | "b", value: number) => {
		const newRgb = {
			...rgbInput,
			[component]: Math.max(0, Math.min(255, value)),
		};
		setRgbInput(newRgb);
		const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
		setTempColor(hex);
		setHexInput(hex);
		updateHslFromHex(hex);
	};

	// HSL 입력 처리
	const handleHslChange = (component: "h" | "s" | "l", value: number) => {
		const newHsl = { ...hslInput };

		if (component === "h") {
			newHsl.h = Math.max(0, Math.min(360, value));
		} else {
			newHsl[component] = Math.max(0, Math.min(100, value));
		}

		setHslInput(newHsl);
		const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
		const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
		setTempColor(hex);
		setHexInput(hex);
		setRgbInput(rgb);
	};

	// 색상 적용
	const applyColor = () => {
		onChange(tempColor);
		addToRecentColors(tempColor);
		setIsOpen(false);
	};

	// 최근 색상에 추가
	const addToRecentColors = (color: string) => {
		const newRecentColors = [
			color,
			...recentColors.filter((c) => c !== color),
		].slice(0, 10);
		setRecentColors(newRecentColors);
		try {
			localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(newRecentColors));
		} catch (error) {
			console.error("Error saving recent colors:", error);
		}
	};

	// 즐겨찾기에 추가/제거
	const toggleFavorite = (color: string) => {
		const newFavorites = favoriteColors.includes(color)
			? favoriteColors.filter((c) => c !== color)
			: [...favoriteColors, color];

		setFavoriteColors(newFavorites);
		try {
			localStorage.setItem(FAVORITE_COLORS_KEY, JSON.stringify(newFavorites));
		} catch (error) {
			console.error("Error saving favorite colors:", error);
		}
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

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Palette className="h-5 w-5" />
						{label} 색상 선택
					</DialogTitle>
					<DialogDescription>
						원하는 방식으로 색상을 선택하세요.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* 색상 미리보기 */}
					<div className="flex items-center justify-center">
						<div
							className="h-16 w-full rounded-lg border border-gray-300"
							style={{ backgroundColor: tempColor }}
						/>
					</div>

					{/* 입력 모드 전환 */}
					<div className="flex gap-2">
						<Button
							size="sm"
							variant={inputMode === "hex" ? "default" : "outline"}
							onClick={() => setInputMode("hex")}
						>
							HEX
						</Button>
						<Button
							size="sm"
							variant={inputMode === "rgb" ? "default" : "outline"}
							onClick={() => setInputMode("rgb")}
						>
							RGB
						</Button>
						<Button
							size="sm"
							variant={inputMode === "hsl" ? "default" : "outline"}
							onClick={() => setInputMode("hsl")}
						>
							HSL
						</Button>
					</div>

					{/* 색상 입력 필드 */}
					{inputMode === "hex" && (
						<div className="space-y-2">
							<Label>Hex 코드</Label>
							<Input
								value={hexInput}
								onChange={(e) => handleHexInputChange(e.target.value)}
								placeholder="#FFFFFF"
								maxLength={7}
							/>
							{!isValidHexColor(hexInput) && hexInput && (
								<p className="text-red-500 text-sm">
									유효하지 않은 Hex 코드입니다.
								</p>
							)}
						</div>
					)}

					{inputMode === "rgb" && (
						<div className="space-y-3">
							<Label>RGB 값</Label>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Label className="w-4">R</Label>
									<Input
										type="number"
										min="0"
										max="255"
										value={rgbInput.r}
										onChange={(e) =>
											handleRgbChange("r", Number.parseInt(e.target.value) || 0)
										}
										className="flex-1"
									/>
								</div>
								<div className="flex items-center gap-2">
									<Label className="w-4">G</Label>
									<Input
										type="number"
										min="0"
										max="255"
										value={rgbInput.g}
										onChange={(e) =>
											handleRgbChange("g", Number.parseInt(e.target.value) || 0)
										}
										className="flex-1"
									/>
								</div>
								<div className="flex items-center gap-2">
									<Label className="w-4">B</Label>
									<Input
										type="number"
										min="0"
										max="255"
										value={rgbInput.b}
										onChange={(e) =>
											handleRgbChange("b", Number.parseInt(e.target.value) || 0)
										}
										className="flex-1"
									/>
								</div>
							</div>
						</div>
					)}

					{inputMode === "hsl" && (
						<div className="space-y-3">
							<Label>HSL 값</Label>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Label className="w-4">H</Label>
									<Input
										type="number"
										min="0"
										max="360"
										value={hslInput.h}
										onChange={(e) =>
											handleHslChange("h", Number.parseInt(e.target.value) || 0)
										}
										className="flex-1"
									/>
									<span className="text-muted-foreground text-sm">°</span>
								</div>
								<div className="flex items-center gap-2">
									<Label className="w-4">S</Label>
									<Input
										type="number"
										min="0"
										max="100"
										value={hslInput.s}
										onChange={(e) =>
											handleHslChange("s", Number.parseInt(e.target.value) || 0)
										}
										className="flex-1"
									/>
									<span className="text-muted-foreground text-sm">%</span>
								</div>
								<div className="flex items-center gap-2">
									<Label className="w-4">L</Label>
									<Input
										type="number"
										min="0"
										max="100"
										value={hslInput.l}
										onChange={(e) =>
											handleHslChange("l", Number.parseInt(e.target.value) || 0)
										}
										className="flex-1"
									/>
									<span className="text-muted-foreground text-sm">%</span>
								</div>
							</div>
						</div>
					)}

					{/* 미리 정의된 색상 팔레트 */}
					<div className="space-y-2">
						<Label>프리셋 색상</Label>
						<div className="grid grid-cols-10 gap-1">
							{PRESET_COLORS.map((color) => (
								<button
									key={color}
									className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
									style={{ backgroundColor: color }}
									onClick={() => handleColorChange(color)}
									title={color}
								/>
							))}
						</div>
					</div>

					{/* 즐겨찾기 색상 */}
					{favoriteColors.length > 0 && (
						<div className="space-y-2">
							<Label className="flex items-center gap-1">
								<Heart className="h-4 w-4" />
								즐겨찾기
							</Label>
							<div className="flex flex-wrap gap-1">
								{favoriteColors.map((color) => (
									<div key={color} className="group relative">
										<button
											className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
											style={{ backgroundColor: color }}
											onClick={() => handleColorChange(color)}
											title={color}
										/>
										<button
											className="-top-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
											onClick={(e) => {
												e.stopPropagation();
												toggleFavorite(color);
											}}
										>
											<X className="h-2 w-2" />
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* 최근 사용 색상 */}
					{recentColors.length > 0 && (
						<div className="space-y-2">
							<Label className="flex items-center gap-1">
								<RotateCcw className="h-4 w-4" />
								최근 사용
							</Label>
							<div className="flex flex-wrap gap-1">
								{recentColors.map((color, index) => (
									<button
										key={`${color}-${index}`}
										className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
										style={{ backgroundColor: color }}
										onClick={() => handleColorChange(color)}
										title={color}
									/>
								))}
							</div>
						</div>
					)}

					{/* 액션 버튼들 */}
					<div className="flex justify-between">
						<Button
							variant="outline"
							size="sm"
							onClick={() => toggleFavorite(tempColor)}
							className="flex items-center gap-1"
						>
							<Heart
								className={`h-4 w-4 ${favoriteColors.includes(tempColor) ? "fill-red-500 text-red-500" : ""}`}
							/>
							{favoriteColors.includes(tempColor) ? "제거" : "즐겨찾기"}
						</Button>

						<div className="flex gap-2">
							<Button variant="outline" onClick={() => setIsOpen(false)}>
								취소
							</Button>
							<Button onClick={applyColor}>적용</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
