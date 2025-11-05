import clsx from "clsx";
import Link, { LinkProps } from "next/link";

type NavLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    menu?: boolean;
    parentProps?: React.LiHTMLAttributes<HTMLLIElement>;
  };

export default function NavLink({
  href,
  className,
  children,
  menu,
  parentProps,
  ...rest
}: NavLinkProps) {
  const classes = clsx(
    "px-2 py-1 text-gray-900 hover:bg-gray-100 rounded-sm flex items-center gap-2 text-sm font-medium",
    className
  );

  if (menu) {
    return (
      <li {...parentProps}>
        <Link href={href} className={classes} {...rest}>
          {children}
        </Link>
      </li>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
