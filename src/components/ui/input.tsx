import clsx from "clsx";
import FormLabel from "./form-label";
import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { IconBase, IconType } from "react-icons";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
  isPassword?: boolean;
  startIcon?: IconType;
  endIcon?: IconType;
  iconDir?: "left" | "right";
};
export default function Input({
  label,
  error,
  isPassword,
  startIcon,
  endIcon,
  type = "text",
  ...rest
}: InputProps) {
  const [visible, setVisible] = useState(false);
  const IconStart = startIcon;
  const IconEnd = endIcon;
  return (
    <div className="flex flex-col w-full">
      {label && <FormLabel label={label} />}
      <div
        className={clsx(
          "w-full rounded-md flex items-center px-3 relativerounded-md border  text-sm bg-transparent outline-none pr-9",
          "border-gray-200 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          error &&
            "border-rose-600 text-red-500 focus:border-rose-600 focus:ring-rose-600"
        )}
      >
        {IconStart && <IconStart className=" left-2 text-gray-400" />}
        <input
          type={visible ? "text" : type}
          className={clsx("outline-none py-3 w-full", startIcon && "px-3")}
          {...rest}
        />
        {IconEnd && <IconEnd className="ml-2 text-gray-400" />}
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
          >
            {visible ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
          </button>
        )}
      </div>
      {error && <p className="text-red-600 text-xs mt-2 block">{error}</p>}
    </div>
  );
}
