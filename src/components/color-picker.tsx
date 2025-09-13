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
import { Heart, Palette, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
	value: string;
	onChange: (color: string) => void;
	label: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
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

export function ColorPicker({
	value,
	onChange,
	label,
	open,
	onOpenChange,
	children,
}: ColorPickerProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [tempColor, setTempColor] = useState(value);
	const [recentColors, setRecentColors] = useState<string[]>([]);
	const [favoriteColors, setFavoriteColors] = useState<string[]>([]);

	// localStorage 키들
	const RECENT_COLORS_KEY = "plate-play-recent-colors";
	const FAVORITE_COLORS_KEY = "plate-play-favorite-colors";

	// open 상태 관리 - 외부에서 제어하거나 내부적으로 관리
	const isOpen = open !== undefined ? open : internalOpen;
	const setIsOpen = onOpenChange || setInternalOpen;

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
		}
	}, [isOpen, value]);

	const normalizedTempHex = useMemo(() => normalizeHex(tempColor), [tempColor]);
	const isHexValid = useMemo(() => isValidHex(tempColor), [tempColor]);

	// 색상 적용
	const applyColor = () => {
		const hex = normalizeHex(tempColor);
		onChange(hex);
		addToRecentColors(hex);
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

	// 프리셋 색상 클릭 처리
	const handlePresetClick = (color: string) => {
		setTempColor(color);
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

			<DialogContent className="max-w-[520px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Palette className="h-5 w-5" />
						{label} 색상 선택
					</DialogTitle>
					<DialogDescription>
						색상을 선택하고 미리보기/팔레트를 활용해 보세요.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Core picker row: preview, input[type=color], hex input */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div className="space-y-2">
							<Label>미리보기</Label>
							<div
								className="h-24 w-full rounded-md border"
								style={{ backgroundColor: normalizedTempHex }}
							/>
						</div>
						<div className="space-y-2">
							<Label>빠른 선택</Label>
							<input
								type="color"
								value={safeColorInputValue(normalizedTempHex)}
								onChange={(e) => setTempColor(e.target.value)}
								className="h-10 w-full cursor-pointer rounded-md border bg-background p-1"
								aria-label="색상 선택"
							/>
						</div>
						<div className="space-y-2">
							<Label>HEX</Label>
							<Input
								value={tempColor}
								onChange={(e) => setTempColor(e.target.value)}
								placeholder="#16a34a"
								aria-label="HEX 색상"
								className={isHexValid ? undefined : "border-destructive"}
							/>
						</div>
					</div>

					{/* 미리 정의된 색상 팔레트 */}
					<div className="space-y-2">
						<Label>프리셋 색상</Label>
						<div className="grid grid-cols-10 gap-1">
							{PRESET_COLORS.map((color) => (
								<button
									key={color}
									type="button"
									className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
									style={{ backgroundColor: color }}
									onClick={() => handlePresetClick(color)}
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
											type="button"
											className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
											style={{ backgroundColor: color }}
											onClick={() => handlePresetClick(color)}
											title={color}
										/>
										<button
											type="button"
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
										key={`recent-color-${color.replace("#", "")}-${index}`}
										type="button"
										className="h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110"
										style={{ backgroundColor: color }}
										onClick={() => handlePresetClick(color)}
										title={color}
									/>
								))}
							</div>
						</div>
					)}

					{/* 즐겨찾기 추가 버튼 */}
					<div className="flex items-center justify-between">
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
			</DialogContent>
		</Dialog>
	);
}

// Helpers
function normalizeHex(input: string): string {
  if (!input) return "#000000";
  let v = input.trim().toLowerCase();
  if (!v.startsWith("#")) v = `#${v}`;
  // Expand #abc to #aabbcc
  if (/^#([0-9a-f]{3})$/.test(v)) {
    const [, s] = v.match(/^#([0-9a-f]{3})$/) as RegExpMatchArray;
    v = `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`;
  }
  // Validate #rrggbb
  if (!/^#([0-9a-f]{6})$/.test(v)) return "#000000";
  return v;
}

function safeColorInputValue(hex: string): string {
  // input[type=color] requires a valid #rrggbb
  return /^#([0-9a-f]{6})$/i.test(hex) ? hex : "#000000";
}

function isValidHex(input: string): boolean {
  if (!input) return false;
  let v = input.trim().toLowerCase();
  if (!v.startsWith("#")) v = `#${v}`;
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(v);
}
