import { ComponentProps, MouseEvent, useState } from "react";
import { cn } from "../../shared/cn";

type ToggleableButtonProps = ComponentProps<"button"> & {
  toggled?: boolean;
  toggledClassName?: string;
};

function Button({
  children,
  className,
  ...restProps
}: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "flex h-12 basis-1/4 items-center justify-around rounded bg-zinc-300 text-2xl font-semibold text-slate-800 shadow-sm hover:bg-zinc-400 active:bg-zinc-500",
        "xl:h-16 xl:w-44",
        className,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}

function DigitButton({
  children,
  className,
  ...restProps
}: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "flex aspect-square basis-1/9 items-center justify-center rounded-md bg-sky-200 text-2xl font-semibold text-slate-800 shadow-md hover:bg-sky-300 active:bg-sky-400 xl:h-16",
        className,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}

function ToggleableButton({
  children,
  className,
  onClick,
  toggledClassName,
  toggled = false,
  ...restProps
}: ToggleableButtonProps) {
  const [isToggled, setIsToggled] = useState(toggled);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsToggled((_) => !isToggled);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex h-12 basis-1/4 items-center justify-around rounded bg-zinc-300 text-2xl font-semibold text-slate-800 shadow-sm",
        "xl:h-16 xl:w-44",
        className,
        isToggled && "bg-zinc-500 text-slate-100",
        isToggled && toggledClassName,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}

export { Button, DigitButton, ToggleableButton, type ToggleableButtonProps };
