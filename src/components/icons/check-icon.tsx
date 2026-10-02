import { Check } from "lucide-react";
import type { ComponentProps } from "react";

export function CheckIcon(props: ComponentProps<typeof Check>) {
  return <Check {...props} aria-hidden={props["aria-hidden"] ?? true} />;
}
