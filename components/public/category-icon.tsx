import { Boxes, Calculator, Handshake, SquareKanban, Users, Wallet, type LucideProps } from "lucide-react";
import type { IconName } from "@/lib/types";

const ICONS = {
  calculator: Calculator,
  wallet: Wallet,
  users: Users,
  handshake: Handshake,
  boxes: Boxes,
  kanban: SquareKanban,
} satisfies Record<IconName, unknown>;

export function CategoryIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" strokeWidth={1.9} {...props} />;
}
