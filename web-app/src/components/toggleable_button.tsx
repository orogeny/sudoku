import { ClassValue, clsx } from "clsx";
import { ComponentProps, MouseEvent, PropsWithChildren, useState } from "react";
import { twMerge } from "tw-merge";

type ToggleableButtonProps = PropsWithChildren &
  ComponentProps<"button"> & {
    toggledClasses?: string;
  };

const NATIVE_CLASSES =
  "rounded-lg bg-gray-300 px-5 py-2 font-semibold text-slate-800 hover:bg-gray-400 hover:text-slate-100 active:bg-gray-800 active:text-white";

function cn(...utilities: ClassValue[]) {
  return twMerge(clsx(utilities));
}

function ToggleableButton({
  children,
  className,
  toggledClasses = "bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-300",
  ...restProps
}: ToggleableButtonProps) {
  const [toggled, setToggled] = useState(false);

  const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setToggled((_) => !toggled);

    const { onClick: theirClick } = restProps;

    if (theirClick) {
      theirClick(e);
    }
  };

  return (
    <button
      {...restProps}
      className={cn(NATIVE_CLASSES, className, toggled && toggledClasses)}
      onClick={handleToggle}
    >
      {children}
      <p>{toggled ? "on" : "off"}</p>
    </button>
  );
}

export { ToggleableButton };
