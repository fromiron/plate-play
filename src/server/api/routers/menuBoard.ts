/**
 * MenuBoard tRPC 라우터
 * 메뉴판 CRUD 및 관련 기능을 위한 API 엔드포인트
 */

import type { LocalizedString, Promotion, Theme } from "@/lib/types";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// 입력 스키마 정의
const LocalizedStringSchema = z
	.object({
		default: z.string().min(0).default(""),
		en: z.string().optional(),
		zh: z.string().optional(),
		ja: z.string().optional(),
		ko: z.string().optional(),
		"zh-CN": z.string().optional(),
		"zh-TW": z.string().optional(),
	})
	.transform((data) => ({
		...data,
		default: data.default || "",
	}));

const ThemeSchema = z
	.object({
		primary: z.string().optional(),
		secondary: z.string().optional(),
		accent: z.string().optional(),
		fontPair: z
			.enum(["inter-playfair", "inter-merriweather", "inter-roboto-slab"])
			.optional(),
		template: z.enum(["blank", "cafe", "restaurant", "pub"]).optional(),
	})
	.optional();

const PromotionSchema = z.object({
	id: z.string(),
	name: z.string(),
	percent: z.number().min(0).max(100),
	startHour: z.number().min(0).max(23),
	endHour: z.number().min(0).max(23),
	days: z.array(z.number().min(0).max(6)),
});

const MenuItemSchema = z.object({
	id: z.string(),
	name: LocalizedStringSchema,
	description: LocalizedStringSchema.optional(),
	price: z.number().min(0),
	image: z.string().optional(),
	tags: z.array(z.string()).optional(),
	category: z.string().optional(),
	status: z.enum(["available", "soldout", "hidden"]).default("available"),
});

const SectionSchema = z.object({
	id: z.string(),
	name: LocalizedStringSchema,
	items: z.array(MenuItemSchema),
});

const CreateMenuBoardSchema = z.object({
	title: LocalizedStringSchema,
	description: LocalizedStringSchema.optional(),
	currency: z.string().default("KRW"),
	defaultLang: z.string().default("default"),
	theme: ThemeSchema,
	promotions: z.array(PromotionSchema).optional(),
	sections: z.array(SectionSchema).default([]),
});

const UpdateMenuBoardSchema = CreateMenuBoardSchema.extend({
	id: z.string(),
});

// 유틸리티 함수들
function serializeJSON<T>(data: T): string {
	return JSON.stringify(data);
}

function parseJSON<T>(jsonString: string | null): T | undefined {
	if (!jsonString) return undefined;
	try {
		return JSON.parse(jsonString) as T;
	} catch {
		return undefined;
	}
}

export const menuBoardRouter = createTRPCRouter({
	/**
	 * 사용자의 모든 메뉴판 목록 조회
	 */
	list: protectedProcedure.query(async ({ ctx }) => {
		const menuBoards = await ctx.db.menuBoard.findMany({
			where: { createdById: ctx.session.user.id },
			include: {
				sections: {
					include: {
						items: {
							orderBy: { order: "asc" },
						},
					},
					orderBy: { order: "asc" },
				},
				_count: {
					select: {
						views: true,
					},
				},
			},
			orderBy: { updatedAt: "desc" },
		});

		return menuBoards.map((board) => ({
			id: board.id,
			title: parseJSON<LocalizedString>(board.title)!,
			description: parseJSON<LocalizedString>(board.description || "{}"),
			currency: board.currency,
			defaultLang: board.defaultLang as
				| "default"
				| "en"
				| "zh"
				| "ja"
				| "ko"
				| "zh-CN"
				| "zh-TW",
			theme: parseJSON<Theme>(board.theme),
			promotions: parseJSON<Promotion[]>(board.promotions) || [],
			sections: board.sections.map((section) => ({
				id: section.id,
				name: parseJSON<LocalizedString>(section.name)!,
				items: section.items.map((item) => ({
					id: item.id,
					name: parseJSON<LocalizedString>(item.name)!,
					description: parseJSON<LocalizedString>(item.description || "{}"),
					price: item.price / 100, // DB는 정수, 앱은 소수점
					image: item.image,
					tags: parseJSON<string[]>(item.tags) || [],
					category: item.category,
					status: item.status as "available" | "soldout" | "hidden",
				})),
			})),
			createdAt: board.createdAt.getTime(),
			updatedAt: board.updatedAt.getTime(),
			viewsCount: board._count.views,
		}));
	}),

	/**
	 * 특정 메뉴판 상세 조회
	 */
	getById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const board = await ctx.db.menuBoard.findFirst({
				where: {
					id: input.id,
					createdById: ctx.session.user.id,
				},
				include: {
					sections: {
						include: {
							items: {
								orderBy: { order: "asc" },
							},
						},
						orderBy: { order: "asc" },
					},
				},
			});

			if (!board) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "MenuBoard not found",
				});
			}

			return {
				id: board.id,
				title: parseJSON<LocalizedString>(board.title)!,
				description: parseJSON<LocalizedString>(board.description || "{}"),
				currency: board.currency,
				defaultLang: board.defaultLang as
					| "default"
					| "en"
					| "zh"
					| "ja"
					| "ko"
					| "zh-CN"
					| "zh-TW",
				theme: parseJSON<Theme>(board.theme),
				promotions: parseJSON<Promotion[]>(board.promotions) || [],
				sections: board.sections.map((section) => ({
					id: section.id,
					name: parseJSON<LocalizedString>(section.name)!,
					items: section.items.map((item) => ({
						id: item.id,
						name: parseJSON<LocalizedString>(item.name)!,
						description: parseJSON<LocalizedString>(item.description || "{}"),
						price: item.price / 100,
						image: item.image,
						tags: parseJSON<string[]>(item.tags) || [],
						category: item.category,
						status: item.status as "available" | "soldout" | "hidden",
					})),
				})),
				createdAt: board.createdAt.getTime(),
				updatedAt: board.updatedAt.getTime(),
			};
		}),

	/**
	 * 공개 메뉴판 조회 (로그인 불필요)
	 */
	getPublic: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const board = await ctx.db.menuBoard.findUnique({
				where: { id: input.id },
				include: {
					sections: {
						include: {
							items: {
								where: { status: { not: "hidden" } }, // 숨김 상태 제외
								orderBy: { order: "asc" },
							},
						},
						orderBy: { order: "asc" },
					},
				},
			});

			if (!board) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "MenuBoard not found",
				});
			}

			// 조회수 증가
			await ctx.db.boardView.create({
				data: {
					menuBoardId: board.id,
					hour: new Date().getHours(),
					// 필요시 IP, User-Agent 등 추가 가능
				},
			});

			return {
				id: board.id,
				title: parseJSON<LocalizedString>(board.title)!,
				description: parseJSON<LocalizedString>(board.description || "{}"),
				currency: board.currency,
				defaultLang: board.defaultLang as
					| "default"
					| "en"
					| "zh"
					| "ja"
					| "ko"
					| "zh-CN"
					| "zh-TW",
				theme: parseJSON<Theme>(board.theme),
				promotions: parseJSON<Promotion[]>(board.promotions) || [],
				sections: board.sections.map((section) => ({
					id: section.id,
					name: parseJSON<LocalizedString>(section.name)!,
					items: section.items.map((item) => ({
						id: item.id,
						name: parseJSON<LocalizedString>(item.name)!,
						description: parseJSON<LocalizedString>(item.description || "{}"),
						price: item.price / 100,
						image: item.image,
						tags: parseJSON<string[]>(item.tags) || [],
						category: item.category,
						status: item.status as "available" | "soldout" | "hidden",
					})),
				})),
				createdAt: board.createdAt.getTime(),
				updatedAt: board.updatedAt.getTime(),
			};
		}),

	/**
	 * 새 메뉴판 생성
	 */
	create: protectedProcedure
		.input(CreateMenuBoardSchema)
		.mutation(async ({ ctx, input }) => {
			const board = await ctx.db.$transaction(async (tx) => {
				// 메뉴판 생성
				const newBoard = await tx.menuBoard.create({
					data: {
						title: serializeJSON(input.title),
						description: input.description
							? serializeJSON(input.description)
							: undefined,
						currency: input.currency,
						defaultLang: input.defaultLang,
						theme: input.theme ? serializeJSON(input.theme) : undefined,
						promotions: input.promotions?.length
							? serializeJSON(input.promotions)
							: undefined,
						createdById: ctx.session.user.id,
					},
				});

				// 섹션들 생성
				if (input.sections.length > 0) {
					for (let sIdx = 0; sIdx < input.sections.length; sIdx++) {
						const sectionData = input.sections[sIdx];
						if (!sectionData) continue;

						const section = await tx.section.create({
							data: {
								id: sectionData.id,
								name: serializeJSON(sectionData.name),
								order: sIdx,
								menuBoardId: newBoard.id,
							},
						});

						// 아이템들 생성
						if (sectionData.items?.length > 0) {
							for (let iIdx = 0; iIdx < sectionData.items.length; iIdx++) {
								const itemData = sectionData.items[iIdx];
								if (!itemData) continue;

								await tx.menuItem.create({
									data: {
										id: itemData.id,
										name: serializeJSON(itemData.name),
										description: itemData.description
											? serializeJSON(itemData.description)
											: undefined,
										price: Math.round((itemData.price ?? 0) * 100), // 소수점을 정수로
										image: itemData.image,
										tags: itemData.tags?.length
											? serializeJSON(itemData.tags)
											: undefined,
										category: itemData.category,
										status: itemData.status ?? "available",
										order: iIdx,
										sectionId: section.id,
									},
								});
							}
						}
					}
				}

				return newBoard;
			});

			return { id: board.id };
		}),

	/**
	 * 메뉴판 업데이트
	 */
	update: protectedProcedure
		.input(UpdateMenuBoardSchema)
		.mutation(async ({ ctx, input }) => {
			// 소유권 확인
			const existingBoard = await ctx.db.menuBoard.findFirst({
				where: {
					id: input.id,
					createdById: ctx.session.user.id,
				},
			});

			if (!existingBoard) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "MenuBoard not found",
				});
			}

			await ctx.db.$transaction(async (tx) => {
				// 메뉴판 업데이트
				await tx.menuBoard.update({
					where: { id: input.id },
					data: {
						title: serializeJSON(input.title),
						description: input.description
							? serializeJSON(input.description)
							: undefined,
						currency: input.currency,
						defaultLang: input.defaultLang,
						theme: input.theme ? serializeJSON(input.theme) : undefined,
						promotions: input.promotions?.length
							? serializeJSON(input.promotions)
							: undefined,
						updatedAt: new Date(),
					},
				});

				// 기존 섹션 및 아이템 삭제 (CASCADE로 자동 삭제되지만 명시적으로)
				await tx.section.deleteMany({
					where: { menuBoardId: input.id },
				});

				// 새 섹션들 생성
				if (input.sections.length > 0) {
					for (let sIdx = 0; sIdx < input.sections.length; sIdx++) {
						const sectionData = input.sections[sIdx];
						if (!sectionData) continue;

						const section = await tx.section.create({
							data: {
								id: sectionData.id,
								name: serializeJSON(sectionData.name),
								order: sIdx,
								menuBoardId: input.id,
							},
						});

						// 아이템들 생성
						if (sectionData.items?.length > 0) {
							for (let iIdx = 0; iIdx < sectionData.items.length; iIdx++) {
								const itemData = sectionData.items[iIdx];
								if (!itemData) continue;

								await tx.menuItem.create({
									data: {
										id: itemData.id,
										name: serializeJSON(itemData.name),
										description: itemData.description
											? serializeJSON(itemData.description)
											: undefined,
										price: Math.round((itemData.price ?? 0) * 100),
										image: itemData.image,
										tags: itemData.tags?.length
											? serializeJSON(itemData.tags)
											: undefined,
										category: itemData.category,
										status: itemData.status ?? "available",
										order: iIdx,
										sectionId: section.id,
									},
								});
							}
						}
					}
				}
			});

			return { success: true };
		}),

	/**
	 * 메뉴판 삭제
	 */
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// 소유권 확인
			const board = await ctx.db.menuBoard.findFirst({
				where: {
					id: input.id,
					createdById: ctx.session.user.id,
				},
			});

			if (!board) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "MenuBoard not found",
				});
			}

			// CASCADE로 관련 데이터 자동 삭제
			await ctx.db.menuBoard.delete({
				where: { id: input.id },
			});

			return { success: true };
		}),

	/**
	 * 메뉴판 통계 조회
	 */
	getStats: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const board = await ctx.db.menuBoard.findFirst({
				where: {
					id: input.id,
					createdById: ctx.session.user.id,
				},
				include: {
					sections: {
						include: {
							items: true,
						},
					},
					views: {
						select: {
							viewedAt: true,
							hour: true,
						},
					},
				},
			});

			if (!board) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "MenuBoard not found",
				});
			}

			const totalItems = board.sections.reduce(
				(sum, section) => sum + section.items.length,
				0,
			);
			const soldOutItems = board.sections.reduce(
				(sum, section) =>
					sum +
					section.items.filter((item) => item.status === "soldout").length,
				0,
			);
			const categories = new Set(
				board.sections.flatMap((section) =>
					section.items.map((item) => item.category || "other"),
				),
			).size;

			const hourlyViews = Array(24).fill(0);
			board.views.forEach((view) => {
				hourlyViews[view.hour]++;
			});

			return {
				totalViews: board.views.length,
				totalSections: board.sections.length,
				totalItems,
				soldOutItems,
				availableItems: totalItems - soldOutItems,
				categoriesCount: categories,
				hourlyViews,
				recentViews: board.views.slice(-10).map((view) => ({
					viewedAt: view.viewedAt.getTime(),
					hour: view.hour,
				})),
			};
		}),
});
