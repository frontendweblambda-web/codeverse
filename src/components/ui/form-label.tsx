import clsx from "clsx";

export type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  label?: string;
};
export default function FormLabel({
  label,
  className,
  ...rest
}: FormLabelProps) {
  return (
    <label className={clsx("mb-1 text-xs text-gray-600", className)} {...rest}>
      {label}
    </label>
  );
}
