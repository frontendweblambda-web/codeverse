import Checkbox from "./checkbox";

type CheckboxGroupProps<T> = {
  options?: T[];
};
export default function CheckboxGroup<T>({ options }: CheckboxGroupProps<T>) {
  return options?.map((checkbox) => <Checkbox />);
}
