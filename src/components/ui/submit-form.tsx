import clsx from "clsx";
import { useFormStatus } from "react-dom";

type SubmitFormProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  btnLabel?: string;
};

export default function SubmitForm({
  className,
  children,
  loading,
  disabled,
  btnLabel = "Save",
  ...rest
}: SubmitFormProps) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending || loading || disabled}
      className={clsx("py-1 text-white px-6 min-w-20 bg-slate-900 rounded-sm")}
      {...rest}
    >
      {children || btnLabel}
    </button>
  );
}
