import { cn } from "../../../lib";
import { Tooltip } from "../ui";

type Props = {
  year: number;
  className?: string;
};

const ItemYearBadge = ({ year, className }: Props) => (
  <Tooltip content="Release year">
    <span className={cn("font-semibold text-chart-4", className)}>{year}</span>
  </Tooltip>
);

export { ItemYearBadge };
