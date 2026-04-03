import type { ItemStatus } from "@prisma/client";
import { STATUS_COLORS, STATUS_ICONS, STATUS_NAMES } from "../../../constants";
import { cn } from "../../../lib";
import { Tooltip } from "../ui";

type Props = {
  status: ItemStatus;
  showLabel?: boolean;
  className?: string;
};

const ItemStatusBadge = ({ status, showLabel = true, className }: Props) => {
  const Icon = STATUS_ICONS[status];

  return (
    <Tooltip content={`Watch status: ${STATUS_NAMES[status]}`}>
      <span className={cn("flex items-center gap-1 font-semibold", STATUS_COLORS[status], className)}>
        <Icon className="size-4 stroke-[2.5px]" />
        {showLabel && <span>{STATUS_NAMES[status]}</span>}
      </span>
    </Tooltip>
  );
};

export { ItemStatusBadge };
