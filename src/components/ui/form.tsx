import clsx from "clsx";

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {};

/**
 * Form component
 * @param param0
 * @returns
 */
export default function Form({ className, children, ...rest }: FormProps) {
  return (
    <form className={clsx(className)} {...rest} noValidate>
      {children}
    </form>
  );
}
