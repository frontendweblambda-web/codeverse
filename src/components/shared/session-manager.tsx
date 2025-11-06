import { startTransition, useEffect, useEffectEvent, useRef } from "react";

import { logout, refreshToken } from "@/app/(auth)/_action/auth";

import { useAppState } from "@/context/root";
import { appConfig } from "@/core/config";

const IDLE_TIMEOUT = appConfig.accessTokenTTL * 1000; // 15 minutes inactivity
export default function SessionManager() {
	const { session } = useAppState();
	const idleTimer = useRef<NodeJS.Timeout | null>(null);
	const refreshTimer = useRef<NodeJS.Timeout | null>(null);

	// Reset idle timer on user activity
	const resetIdleTimer = useEffectEvent(() => {
		if (idleTimer.current) clearTimeout(idleTimer.current);
		idleTimer.current = setTimeout(() => {
			startTransition(async () => await logout());
		}, IDLE_TIMEOUT);
	});

	useEffect(() => {
		// Listen to user interactions
		window.addEventListener("mousemove", resetIdleTimer);
		window.addEventListener("keydown", resetIdleTimer);
		window.addEventListener("touchstart", resetIdleTimer);

		return () => {
			window.removeEventListener("mousemove", resetIdleTimer);
			window.removeEventListener("keydown", resetIdleTimer);
			window.removeEventListener("touchstart", resetIdleTimer);
			if (idleTimer.current) clearTimeout(idleTimer.current);
		};
	}, []);

	useEffect(() => {
		if (!session?.payload?.exp) return;

		const now = Math.floor(Date.now() / 1000); // in seconds
		const timeLeft = session?.payload?.exp! - now;
		const refreshInterval =
			Math.max(timeLeft - appConfig.beforeExpiration, 0) * 1000;

		// Clear previous timer
		if (refreshTimer.current) clearTimeout(refreshTimer.current);

		// Schedule auto-logout 60 seconds before expiration
		refreshTimer.current = setTimeout(async () => {
			// Optional: attempt refresh first
			// const newSession = await refreshToken();
			// if (newSession) return setSession(newSession);
			startTransition(async () => {
				const newSession = await refreshToken();
				if (!newSession) await logout();
			});
		}, refreshInterval);

		console.log("TimeLeft", refreshInterval);
		return () => {
			if (refreshTimer.current) clearTimeout(refreshTimer.current);
		};
	}, [session]);

	return null;
}
