import { ComponentPropsWithoutRef } from "react";

type SelectorProps = ComponentPropsWithoutRef<"select"> & {
  options: string[];
};

function Selector({ options, ...restProps }: SelectorProps) {
  return (
    <label className="flex w-40 items-center justify-between">
      Difficulty:
      <select {...restProps}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export { Selector };
