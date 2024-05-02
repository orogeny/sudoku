import { ClassValue, clsx } from "clsx";
import { twMerge } from "tw-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export { cn };
