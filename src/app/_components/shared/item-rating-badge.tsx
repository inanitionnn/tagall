import { cn } from "../../../lib";

type Props = {
  rate: number;
  className?: string;
};

const ItemRatingBadge = ({ rate, className }: Props) => (
  <span className={cn("flex items-center gap-1 font-semibold text-yellow-400", className)}>
    <span>★</span>
    <span>{Math.round(rate * 10) / 10}</span>
  </span>
);

export { ItemRatingBadge };
