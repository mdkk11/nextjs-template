import {
  Button as BaseButton,
  type ButtonProps as BaseButtonProps,
  type ButtonState,
} from "@base-ui/react/button";

import { cn } from "@/lib/cn";

const buttonStyles = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "border border-border bg-surface text-foreground hover:bg-surface-muted",
  danger: "bg-danger text-danger-foreground hover:bg-danger/90",
  ghost: "text-foreground hover:bg-surface-muted",
} as const;

type ButtonVariant = keyof typeof buttonStyles;

export type ButtonProps = BaseButtonProps & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const mergedClassName =
    typeof className === "function"
      ? (state: ButtonState) =>
          cn(
            "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50",
            buttonStyles[variant],
            className(state),
          )
      : cn(
          "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50",
          buttonStyles[variant],
          className,
        );

  return <BaseButton {...props} className={mergedClassName} />;
}
