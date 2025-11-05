import clsx from "clsx";

type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  label?: string;
};
export default function FormLabel({
  label,
  className,
  ...rest
}: FormLabelProps) {
  return (
    <label className={clsx("mb-2", className)} {...rest}>
      {label}
    </label>
  );
}
