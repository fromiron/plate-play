/**
 * Review tRPC 라우터
 * 익명 리뷰 시스템을 위한 API 엔드포인트
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const CreateReviewSchema = z.object({
	menuItemId: z.string(),
	rating: z.number().min(1).max(5),
	text: z.string().optional(),
	sessionToken: z.string(),
});

const GetReviewsSchema = z.object({
	menuItemId: z.string(),
});

export const reviewRouter = createTRPCRouter({
	/**
	 * 특정 메뉴 아이템의 리뷰 목록 조회
	 */
	list: publicProcedure
		.input(GetReviewsSchema)
		.query(async ({ ctx, input }) => {
			const reviews = await ctx.db.review.findMany({
				where: {
					menuItemId: input.menuItemId,
					expiresAt: { gt: new Date() }, // 만료되지 않은 리뷰만
				},
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					rating: true,
					text: true,
					createdAt: true,
					sessionToken: true, // 중복 리뷰 방지용
				},
			});

			return reviews.map((review) => ({
				id: review.id,
				rating: review.rating,
				text: review.text,
				createdAt: review.createdAt.getTime(),
				sessionToken: review.sessionToken,
			}));
		}),

	/**
	 * 새 익명 리뷰 생성
	 */
	create: publicProcedure
		.input(CreateReviewSchema)
		.mutation(async ({ ctx, input }) => {
			// 메뉴 아이템 존재 확인
			const menuItem = await ctx.db.menuItem.findUnique({
				where: { id: input.menuItemId },
			});

			if (!menuItem) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Menu item not found",
				});
			}

			// 같은 세션 토큰으로 이미 리뷰를 작성했는지 확인
			const existingReview = await ctx.db.review.findUnique({
				where: {
					menuItemId_sessionToken: {
						menuItemId: input.menuItemId,
						sessionToken: input.sessionToken,
					},
				},
			});

			if (existingReview) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "Review already exists for this item and session",
				});
			}

			// 토큰 만료 시간 설정 (24시간 후)
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

			const review = await ctx.db.review.create({
				data: {
					menuItemId: input.menuItemId,
					rating: input.rating,
					text: input.text,
					sessionToken: input.sessionToken,
					expiresAt,
				},
			});

			// 아이템 조회수 증가
			await ctx.db.itemView.create({
				data: {
					menuItemId: input.menuItemId,
				},
			});

			return {
				id: review.id,
				rating: review.rating,
				text: review.text,
				createdAt: review.createdAt.getTime(),
			};
		}),

	/**
	 * 특정 메뉴 아이템의 리뷰 통계 조회
	 */
	stats: publicProcedure
		.input(GetReviewsSchema)
		.query(async ({ ctx, input }) => {
			const reviews = await ctx.db.review.findMany({
				where: {
					menuItemId: input.menuItemId,
					expiresAt: { gt: new Date() }, // 만료되지 않은 리뷰만
				},
				select: {
					rating: true,
				},
			});

			if (reviews.length === 0) {
				return {
					averageRating: 0,
					totalReviews: 0,
					ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
				};
			}

			const totalReviews = reviews.length;
			const sumRating = reviews.reduce((sum, review) => sum + review.rating, 0);
			const averageRating = Math.round((sumRating / totalReviews) * 10) / 10; // 소수점 1자리

			// 별점 분포
			const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
			for (const review of reviews) {
				ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
			}

			return {
				averageRating,
				totalReviews,
				ratingDistribution,
			};
		}),

	/**
	 * 특정 세션의 기존 리뷰 확인 (중복 방지용)
	 */
	checkExisting: publicProcedure
		.input(
			z.object({
				menuItemIds: z.array(z.string()),
				sessionToken: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const existingReviews = await ctx.db.review.findMany({
				where: {
					menuItemId: { in: input.menuItemIds },
					sessionToken: input.sessionToken,
					expiresAt: { gt: new Date() },
				},
				select: {
					menuItemId: true,
					sessionToken: true,
				},
			});

			return existingReviews;
		}),

	/**
	 * 만료된 리뷰 정리 (cron job이나 주기적 실행용)
	 */
	cleanup: publicProcedure.mutation(async ({ ctx }) => {
		const deletedReviews = await ctx.db.review.deleteMany({
			where: {
				expiresAt: { lt: new Date() },
			},
		});

		return {
			deletedCount: deletedReviews.count,
			cleanedAt: Date.now(),
		};
	}),
});
