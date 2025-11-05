"use client";
import { createContext, PropsWithChildren, use, useMemo } from "react";
import useConfirm, { ConfirmModal } from "../hooks/confirm";

type AppStateType = {
  confirm: ConfirmModal;
  handleCancelConfirm: () => void;
  handleConfirm: (confirm: ConfirmModal) => void;
};
const AppContext = createContext<AppStateType | undefined>(undefined);
type RootProviderProps = PropsWithChildren & {};

/**
 * Root provider
 * @param param0
 * @returns
 */
export default function AppProvider({ children }: RootProviderProps) {
  const { confirm, handleCancelConfirm, handleConfirm } = useConfirm();

  const value = useMemo(
    () => ({ confirm, handleCancelConfirm, handleConfirm }),
    [confirm, handleCancelConfirm, handleConfirm]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = use(AppContext);
  if (!context)
    throw new Error("useAppState  must be used within an AppProvider");
  return context;
}
