import { Trash } from "lucide-react";
import type { ComponentProps } from "react";

export function TrashIcon(props: ComponentProps<typeof Trash>) {
  return <Trash {...props} aria-hidden={props["aria-hidden"] ?? true} />;
}
