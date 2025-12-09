import { cn } from "@/lib/utils";

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <div
      className={cn("ui-separator h-px w-full bg-slate-200", className)}
      {...props}
    />
  );
}

