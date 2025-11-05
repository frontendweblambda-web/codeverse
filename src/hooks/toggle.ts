import { useCallback, useState } from "react";

export default function useToggle(value: boolean = false) {
  const [toggle, setToggle] = useState(value);

  const handleToggle = useCallback(() => setToggle((prev) => !prev), []);
  const handleClose = useCallback(() => setToggle(false), []);
  const handleOpen = useCallback(() => setToggle(true), []);

  return {
    toggle,
    handleClose,
    handleOpen,
    handleToggle,
  };
}
