import { Plus } from "lucide-react";
import type { ComponentProps } from "react";

export function PlusIcon(props: ComponentProps<typeof Plus>) {
  return <Plus {...props} aria-hidden={props["aria-hidden"] ?? true} />;
}
