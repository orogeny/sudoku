import { ComponentProps } from "react";
import { cn } from "../../shared/cn";

type ToggleableButtonProps = ComponentProps<"button"> & {
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
