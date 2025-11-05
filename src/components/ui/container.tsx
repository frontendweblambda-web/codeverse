import clsx from "clsx";
type ContainerProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  isFull?: boolean;
};
export default function Container({
  children,
  className,
  isFull = false,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={clsx("px-4", !isFull && "max-w-7xl mx-auto ", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
