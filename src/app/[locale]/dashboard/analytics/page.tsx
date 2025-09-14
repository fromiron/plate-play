"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MenuBoard } from "@/lib/types";
import { api } from "@/trpc/react";

export default function AnalyticsPage() {
	const { data: boards = [] } = api.menuBoard.list.useQuery();

	return (
		<main className="mx-auto w-full max-w-6xl px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button asChild variant="outline" size="icon">
						<Link href="/dashboard" aria-label="뒤로가기">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<h1 className="font-bold text-2xl">분석</h1>
				</div>
			</div>

			<div className="grid gap-6">
				{boards.map((board) => (
					<AnalyticsCard key={board.id} board={board} />
				))}
			</div>
		</main>
	);
}

function AnalyticsCard({ board }: { board: MenuBoard }) {
	const { data: stats } = api.menuBoard.getStats.useQuery({ id: board.id });

	if (!stats) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{board.title.default}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-muted-foreground text-sm">
						데이터를 불러오는 중...
					</div>
				</CardContent>
			</Card>
		);
	}

	const maxHour = Math.max(1, ...stats.hourlyViews);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{board.title.default}</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-6">
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div className="rounded-lg border p-3 text-center">
						<div className="font-bold text-2xl">{stats.totalViews}</div>
						<div className="text-muted-foreground text-xs">총 조회수</div>
					</div>
					<div className="rounded-lg border p-3 text-center">
						<div className="font-bold text-2xl">{stats.totalSections}</div>
						<div className="text-muted-foreground text-xs">섹션 수</div>
					</div>
					<div className="rounded-lg border p-3 text-center">
						<div className="font-bold text-2xl">{stats.totalItems}</div>
						<div className="text-muted-foreground text-xs">메뉴 수</div>
					</div>
					<div className="rounded-lg border p-3 text-center">
						<div className="font-bold text-2xl">{stats.soldOutItems}</div>
						<div className="text-muted-foreground text-xs">품절</div>
					</div>
				</div>

				<div className="grid gap-2">
					<div className="text-muted-foreground text-sm">
						시간대별 조회 패턴
					</div>
					<div className="flex items-end gap-1 rounded-md border p-3">
						{stats.hourlyViews.map((v, i) => (
							<div
								key={`hour-${i}-${v}`}
								className="flex flex-col items-center gap-1"
							>
								<div
									className="w-3 rounded-t bg-emerald-500"
									style={{ height: `${Math.round((v / maxHour) * 120)}px` }}
									title={`${i}시: ${v}`}
								/>
								<div className="text-[10px] text-muted-foreground">{i}</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
