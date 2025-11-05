import { useCallback, useState } from "react";

export type ConfirmModal = {
  visible?: boolean;
  title?: string;
  content?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};
export default function useConfirm() {
  const [confirm, setConfirm] = useState<ConfirmModal>({
    title: "Are you sure?",
    content: "Do you want to perform this action",
    onSubmit: () => {},
    onCancel: () => {},
  });

  const handleConfirm = useCallback((confirm: ConfirmModal) => {
    setConfirm((prev) => ({ ...prev, ...confirm, visible: true }));
  }, []);

  const handleCancelConfirm = useCallback(() => {
    setConfirm((prev) => ({
      ...prev,
      visible: false,
      title: "Are you sure?",
      content: "Do you want to perform this action",
    }));
  }, []);

  return {
    confirm,
    handleCancelConfirm,
    handleConfirm,
  };
}
