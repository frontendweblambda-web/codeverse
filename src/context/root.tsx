"use client";
import {
  createContext,
  PropsWithChildren,
  use,
  useEffect,
  useMemo,
} from "react";
import useConfirm, { ConfirmModal } from "../hooks/confirm";
import { VerifiedToken } from "../utils/jwt-token";
import AutoLogout from "../components/shared/auto-logout";

type AppStateType = {
  confirm: ConfirmModal;
  handleCancelConfirm: () => void;
  handleConfirm: (confirm: ConfirmModal) => void;
  session?: VerifiedToken;
};
const AppContext = createContext<AppStateType | undefined>(undefined);
type RootProviderProps = PropsWithChildren & {
  session?: VerifiedToken;
};

/**
 * Root provider
 * @param param0
 * @returns
 */
export default function AppProvider({ children, session }: RootProviderProps) {
  const { confirm, handleCancelConfirm, handleConfirm } = useConfirm();

  const value = useMemo(
    () => ({ confirm, handleCancelConfirm, handleConfirm, session }),
    [confirm, handleCancelConfirm, handleConfirm, session]
  );

  return (
    <AppContext.Provider value={value}>
      <AutoLogout />

      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = use(AppContext);
  if (!context)
    throw new Error("useAppState  must be used within an AppProvider");
  return context;
}
