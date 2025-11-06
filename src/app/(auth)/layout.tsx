import { ReactNode } from "react";

import { redirect } from "next/navigation";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Screen from "@/components/ui/screen";

import { getSession } from "@/core/session/session";

/**
 * Auth layout
 * @param param0
 * @returns
 */
export default async function AuthLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await getSession();
	if (session?.payload?.userId) {
		const roles = session.payload.roles?.map((r) => r.name) || [];

		const isOwner = roles.some((name) => ["owner", "member"].includes(name));
		const isAdmin = roles.some((name) =>
			["admin", "superadmin"].includes(name),
		);

		// Get current path
		const currentPath =
			typeof window !== "undefined" ? window.location.pathname : "";

		console.log("currentPath", currentPath);
		// Only redirect if user is on the "root" of auth layout, e.g., "/"

		if (currentPath === "" || currentPath === "/") {
			if (isOwner) redirect("/me");
			if (isAdmin) redirect("/admin");
		}
	}

	return (
		<Screen className="flex flex-col">
			<Header />
			<main className="flex-1 flex items-center justify-center">
				{children}
			</main>
			<Footer />
		</Screen>
	);
}
