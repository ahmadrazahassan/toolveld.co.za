import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, hover = false, ...props }: ComponentProps<"div"> & { hover?: boolean }) {
  return <div {...props} className={cn("card-modern", hover && "card-hover", className)} />;
}

export function Tray({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn("tray", className)} />;
}

export function Panel({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn("on-dark rounded-[40px] bg-panel text-on-panel", className)} />;
}
