import clsx from "clsx";
import { ReactNode } from "react";

type ScreenProps = React.HtmlHTMLAttributes<HTMLDivElement> & {};
export default function Screen({ children, className, ...rest }: ScreenProps) {
  return (
    <div className={clsx("h-screen w-screen", className)} {...rest}>
      {children}
    </div>
  );
}
