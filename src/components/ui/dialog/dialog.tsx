import {
  Dialog as BaseDialog,
  type DialogBackdropProps,
  type DialogBackdropState,
  type DialogCloseProps,
  type DialogCloseState,
  type DialogDescriptionProps,
  type DialogDescriptionState,
  type DialogPopupProps,
  type DialogPopupState,
  type DialogTitleProps,
  type DialogTitleState,
  type DialogViewportProps,
  type DialogViewportState,
} from "@base-ui/react/dialog";

import { cn } from "@/lib/cn";

function Backdrop({ className, ...props }: DialogBackdropProps) {
  const mergedClassName =
    typeof className === "function"
      ? (state: DialogBackdropState) =>
          cn("fixed inset-0 bg-overlay transition-opacity", className(state))
      : cn("fixed inset-0 bg-overlay transition-opacity", className);

  return <BaseDialog.Backdrop {...props} className={mergedClassName} />;
}

function Viewport({ className, ...props }: DialogViewportProps) {
  const mergedClassName =
    typeof className === "function"
      ? (state: DialogViewportState) =>
          cn("fixed inset-0 flex items-center justify-center p-4", className(state))
      : cn("fixed inset-0 flex items-center justify-center p-4", className);

  return <BaseDialog.Viewport {...props} className={mergedClassName} />;
}

function Popup({ className, ...props }: DialogPopupProps) {
  const mergedClassName =
    typeof className === "function"
      ? (state: DialogPopupState) =>
          cn(
            "w-full max-w-md rounded-lg border border-border bg-surface p-6 text-foreground shadow-xl outline-none",
            className(state),
          )
      : cn(
          "w-full max-w-md rounded-lg border border-border bg-surface p-6 text-foreground shadow-xl outline-none",
          className,
        );

  return <BaseDialog.Popup {...props} className={mergedClassName} />;
}

function Title({ className, ...props }: DialogTitleProps) {
  const mergedClassName =
    typeof className === "function"
      ? (state: DialogTitleState) => cn("text-lg font-semibold", className(state))
      : cn("text-lg font-semibold", className);

  return <BaseDialog.Title {...props} className={mergedClassName} />;
}

function Description({ className, ...props }: DialogDescriptionProps) {
  const mergedClassName =
    typeof className === "function"
      ? (state: DialogDescriptionState) =>
          cn("mt-2 text-sm text-muted-foreground", className(state))
      : cn("mt-2 text-sm text-muted-foreground", className);

  return <BaseDialog.Description {...props} className={mergedClassName} />;
}

function Close({ className, ...props }: DialogCloseProps) {
  const mergedClassName =
    typeof className === "function"
      ? (state: DialogCloseState) =>
          cn(
            "rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            className(state),
          )
      : cn(
          "rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          className,
        );

  return <BaseDialog.Close {...props} className={mergedClassName} />;
}

export const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Portal: BaseDialog.Portal,
  Backdrop,
  Viewport,
  Popup,
  Title,
  Description,
  Close,
};
