import clsx from "clsx";
import FormLabel, { FormLabelProps } from "./form-label";
import { useRef } from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  labelProps?: FormLabelProps;
};
export default function Checkbox({
  className,
  labelProps,
  label,
  ...rest
}: CheckboxProps) {
  const inpuRef = useRef<HTMLInputElement>(null);
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <input type="checkbox" ref={inpuRef} {...rest} />
      <FormLabel
        className="mb-0"
        label={label}
        htmlFor={rest.name}
        onClick={() => inpuRef.current?.click()}
        {...labelProps}
      />
    </div>
  );
}
