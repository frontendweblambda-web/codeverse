import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { SiFeedly } from "react-icons/si";

type LogoProps = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {};
export default function Logo({ href = "/", className, ...rest }: LogoProps) {
  return (
    <Link className={clsx("block", className)} href={href} {...rest}>
      <h1 className="flex flex-row items-center gap-2">
        <SiFeedly />
        <span className="text-sm font-semibold">
          Next<span className="text-rose-700">Blog</span>
        </span>
      </h1>
    </Link>
  );
}
