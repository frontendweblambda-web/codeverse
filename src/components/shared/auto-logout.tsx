import { logout } from "@/src/app/(auth)/_action/auth";
import { useAppState } from "@/src/context/root";
import { startTransition, useEffect } from "react";

export default function AutoLogout() {
  const { session } = useAppState();

  useEffect(() => {
    if (!session?.payload?.exp) return;

    const now = Math.floor(Date.now() / 1000);
    const timeLeft = session?.payload?.exp! - now;
    const refreshInterval = (timeLeft - 60) * 1000;

    // Schedule auto-logout 60 seconds before expiration
    const timeout = setTimeout(async () => {
      // Optional: attempt refresh first
      // const newSession = await refreshToken();
      // if (newSession) return setSession(newSession);
      startTransition(async () => {
        await logout();
      });
    }, Math.max(refreshInterval, 0));

    console.log("TimeLeft", refreshInterval);
    return () => clearTimeout(timeout);
  }, [session]);

  return null;
}
