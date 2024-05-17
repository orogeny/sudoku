import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

type ToggleableButtonProps = ComponentPropsWithoutRef<"button"> & {
  toggled?: boolean;
  toggledClassName?: string;
};

function ToggleableButton({
  children,
  className,
  toggledClassName,
  toggled = false,
  ...restProps
}: ToggleableButtonProps) {
  return (
    <button
      className={cn(className, toggled && toggledClassName)}
      {...restProps}
    >
      {children}
    </button>
  );
}

export { ToggleableButton, type ToggleableButtonProps };
