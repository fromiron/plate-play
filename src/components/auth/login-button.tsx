"use client";

import { LogIn, LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function LoginButton() {
	const { data: session, status } = useSession();
	const t = useTranslations();

	if (status === "loading") {
		return (
			<Button disabled variant="ghost">
				{t("auth.loading")}
			</Button>
		);
	}

	if (session) {
		return (
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2 text-sm">
					<User className="h-4 w-4" />
					<span>{session.user?.name}</span>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => signOut({ callbackUrl: "/" })}
					className="flex items-center gap-2"
				>
					<LogOut className="h-4 w-4" />
					{t("auth.signOut")}
				</Button>
			</div>
		);
	}

	return (
		<Button
			onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
			className="flex items-center gap-2"
		>
			<LogIn className="h-4 w-4" />
			{t("auth.signIn")}
		</Button>
	);
}
