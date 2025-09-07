"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginButton } from "./login-button";

interface AuthGuardProps {
	children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
	const { data: session, status } = useSession();
	const t = useTranslations();

	if (status === "loading") {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex items-center gap-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span>{t("auth.loading")}</span>
				</div>
			</div>
		);
	}

	if (!session) {
		return (
			<div className="flex min-h-screen items-center justify-center px-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle>{t("auth.signInRequired")}</CardTitle>
					</CardHeader>
					<CardContent className="flex justify-center">
						<LoginButton />
					</CardContent>
				</Card>
			</div>
		);
	}

	return <>{children}</>;
}
