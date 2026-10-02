import {
  Input as BaseInput,
  type InputProps as BaseInputProps,
  type InputState,
} from "@base-ui/react/input";

import { cn } from "@/lib/cn";

export type InputProps = BaseInputProps;

export function Input({ className, ...props }: InputProps) {
  const mergedClassName =
    typeof className === "function"
      ? (state: InputState) =>
          cn(
            "w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground transition-shadow outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20",
            className(state),
          )
      : cn(
          "w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground transition-shadow outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20",
          className,
        );

  return <BaseInput {...props} className={mergedClassName} />;
}
