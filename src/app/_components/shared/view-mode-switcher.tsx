import { LayoutList, List, Shuffle } from "lucide-react";
import { GrainCardContainer } from "./grain-card-container";
import { Button } from "../ui";

type ViewMode = "standard" | "tierlist" | "random";

type Props = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

const VIEW_MODES: { value: ViewMode; label: string; Icon: React.ElementType }[] = [
  { value: "standard", label: "Collection", Icon: LayoutList },
  { value: "tierlist", label: "Tier List", Icon: List },
  { value: "random", label: "Random", Icon: Shuffle },
];

export const ViewModeSwitcher = ({ viewMode, onViewModeChange }: Props) => {
  return (
    <div className="w-min">
      <GrainCardContainer>
        {VIEW_MODES.map(({ value, label, Icon }) => (
          <Button
            key={value}
            variant={viewMode === value ? "default" : "ghost"}
            onClick={() => onViewModeChange(value)}
            className="gap-1.5 hover:scale-110 transition-all duration-300"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </GrainCardContainer>
    </div>
  );
};
