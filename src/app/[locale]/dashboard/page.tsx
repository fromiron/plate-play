"use client";

import BoardCard from "@/components/board-card";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CURRENCIES } from "@/lib/currencies";
import { computeCoverage } from "@/lib/lang-stats";
import type { MenuBoard } from "@/lib/types";
import { formatCount, formatDate } from "@/lib/utils-local";
import { api } from "@/trpc/react";
import {
	BarChart3,
	ExternalLink,
	Eye,
	Pencil,
	Plus,
	QrCode,
	Search,
	Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function DashboardPage() {
	const t = useTranslations();
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [tpl, setTpl] = useState<"blank" | "cafe" | "restaurant" | "pub">(
		"blank",
	);
	const [currency, setCurrency] = useState("KRW");
	const [query, setQuery] = useState("");

	const { data: boards = [], refetch } = api.menuBoard.list.useQuery();
	const createMutation = api.menuBoard.create.useMutation({
		onSuccess: (result) => {
			refetch();
			setOpen(false);
			setTitle("");
			setDesc("");
			setCurrency("KRW");
			location.href = `/dashboard/${result.id}`;
		},
	});
	const deleteMutation = api.menuBoard.delete.useMutation({
		onSuccess: () => refetch(),
	});

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return boards;
		return boards.filter((b) =>
			[b.title.default, b.description?.default]
				.join(" ")
				.toLowerCase()
				.includes(q),
		);
	}, [boards, query]);

	const handleCreate = () => {
		createMutation.mutate({
			title: { default: title.trim() || t("dashboard.newMenu") },
			description: desc.trim() ? { default: desc.trim() } : undefined,
			currency: currency,
			defaultLang: "default",
			theme: tpl !== "blank" ? { template: tpl } : undefined,
			sections: [],
		});
	};

	const handleDelete = (id: string) => {
		if (!confirm(t("dashboard.deleteConfirm"))) return;
		deleteMutation.mutate({ id });
	};

	return (
		<main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
			<div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="font-bold text-2xl md:text-3xl">
						{t("dashboard.myMenus")}
					</h1>
					<p className="text-muted-foreground text-sm">
						{t("dashboard.subtitle")}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						asChild
						variant="outline"
						className="inline-flex items-center gap-2 bg-transparent"
					>
						<Link href="/dashboard/analytics">
							<BarChart3 className="h-4 w-4" />
							{t("dashboard.viewAnalytics")}
						</Link>
					</Button>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button className="inline-flex items-center gap-2">
								<Plus className="h-4 w-4" />
								{t("dashboard.newMenu")}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t("dashboard.createNew")}</DialogTitle>
							</DialogHeader>
							<div className="grid gap-3 py-2">
								<label className="font-medium text-sm">
									{t("dashboard.template")}
								</label>
								<Select
									value={tpl}
									onValueChange={(v: "blank" | "cafe" | "restaurant" | "pub") =>
										setTpl(v)
									}
								>
									<SelectTrigger className="h-9">
										<SelectValue placeholder={t("common.search")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="blank">
											{t("dashboard.templateBlank")}
										</SelectItem>
										<SelectItem value="cafe">
											{t("dashboard.templateCafe")}
										</SelectItem>
										<SelectItem value="restaurant">
											{t("dashboard.templateRestaurant")}
										</SelectItem>
										<SelectItem value="pub">
											{t("dashboard.templatePub")}
										</SelectItem>
									</SelectContent>
								</Select>
								<label className="font-medium text-sm">
									{t("dashboard.currency")}
								</label>
								<Select
									value={currency}
									onValueChange={setCurrency}
								>
									<SelectTrigger className="h-9">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{CURRENCIES.map((cur) => (
											<SelectItem key={cur.value} value={cur.value}>
												{cur.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<label className="font-medium text-sm" htmlFor="board-title">
									{t("dashboard.titleLabel")}
								</label>
								<Input
									id="board-title"
									placeholder={t("dashboard.titlePlaceholder")}
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
								<label className="font-medium text-sm" htmlFor="board-desc">
									{t("dashboard.descLabel")}
								</label>
								<Input
									id="board-desc"
									placeholder={t("dashboard.descPlaceholder")}
									value={desc}
									onChange={(e) => setDesc(e.target.value)}
								/>
							</div>
							<DialogFooter>
								<Button variant="outline" onClick={() => setOpen(false)}>
									{t("dashboard.cancel")}
								</Button>
								<Button onClick={handleCreate}>{t("dashboard.create")}</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<div className="mb-4 flex items-center gap-2">
				<div className="relative w-full md:w-80">
					<Search className="pointer-events-none absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={t("dashboard.searchPlaceholder")}
						className="pl-8"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
			</div>

			<Separator className="mb-6" />

			{filtered.length === 0 ? (
				<div className="rounded-lg border bg-muted/20 p-10 text-center text-muted-foreground text-sm">
					{t("dashboard.noMenus")}
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((board) => {
						const cov = computeCoverage(board);
						const itemCount = board.sections.reduce(
							(acc, s) => acc + s.items.length,
							0,
						);
						const soldOut = board.sections.reduce(
							(acc, s) =>
								acc + s.items.filter((i) => i.status === "soldout").length,
							0,
						);
						const categories = new Set(
							board.sections.flatMap((s) =>
								s.items.map((i) => i.category || "other"),
							),
						).size;
						return (
							<Card key={board.id} className="flex flex-col">
								<CardHeader>
									<CardTitle className="line-clamp-1">
										{board.title.default}
									</CardTitle>
								</CardHeader>
								<CardContent className="flex flex-1 flex-col gap-3">
									<BoardCard board={board} />
									<div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
										<span>
											{t("dashboard.sections")}{" "}
											{formatCount(board.sections.length)}
										</span>
										<span>
											{t("dashboard.items")} {formatCount(itemCount)}
										</span>
										<span>
											{t("dashboard.categories")} {formatCount(categories)}
										</span>
										<span>
											{t("dashboard.soldOut")} {formatCount(soldOut)}
										</span>
										<span className="inline-flex items-center gap-1">
											<Eye className="h-3.5 w-3.5" />
											{formatCount(board.viewsCount)}
										</span>
									</div>
									<div className="text-muted-foreground text-xs">
										EN {cov.en.filled}/{cov.en.total} · 中 {cov.zh.filled}/
										{cov.zh.total}
									</div>
									<div className="text-[11px] text-muted-foreground">
										{t("dashboard.updated")}: {formatDate(board.updatedAt)}
									</div>
								</CardContent>
								<CardFooter className="flex items-center justify-between gap-2">
									<Button
										asChild
										variant="outline"
										size="sm"
										className="inline-flex items-center gap-2 bg-transparent"
									>
										<Link href={`/dashboard/${board.id}`}>
											<Pencil className="h-4 w-4" />
											{t("dashboard.edit")}
										</Link>
									</Button>
									<div className="flex items-center gap-2">
										<Button
											asChild
											variant="outline"
											size="icon"
											aria-label={t("dashboard.openWebMenu")}
										>
											<Link href={`/menu/${board.id}`} target="_blank">
												<ExternalLink className="h-4 w-4" />
											</Link>
										</Button>
										<Button
											asChild
											variant="outline"
											size="icon"
											aria-label={t("dashboard.viewQr")}
										>
											<Link href={`/dashboard/${board.id}#qr`}>
												<QrCode className="h-4 w-4" />
											</Link>
										</Button>
										<Button
											variant="destructive"
											size="icon"
											onClick={() => handleDelete(board.id)}
											aria-label={t("dashboard.delete")}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</CardFooter>
							</Card>
						);
					})}
				</div>
			)}
		</main>
	);
}
