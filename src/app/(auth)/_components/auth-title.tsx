import clsx from "clsx";
import Link from "next/link";

type AuthTitleProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
  linkLabel?: string;
};
export default function AuthTitle({
  title = "Login",
  subtitle = "Welcome to codeverse",
  className,
  ...rest
}: AuthTitleProps) {
  return (
    <div className={clsx("mb-4", className)} {...rest}>
      <h1 className="text-xl">{title}</h1>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
