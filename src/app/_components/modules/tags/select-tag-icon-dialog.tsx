"use client";
import { Button, Dialog, DialogContent, DialogTrigger, Header } from "../../ui";
import { type LucideIcon } from "lucide-react";
import { TAG_ICONS } from "~/constants/tag-icons";
import { type Dispatch, type SetStateAction, useState } from "react";

type Props = {
  SelectedIcon: LucideIcon | undefined | null;
  setSelectedIcon: Dispatch<SetStateAction<LucideIcon | null>>;
};

const SelectTagIconDialog = (props: Props) => {
  const { SelectedIcon, setSelectedIcon } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen}>
      <DialogTrigger>
        <Button
          variant="outline"
          size={SelectedIcon ? "icon" : "default"}
          className="gap-2"
          onClick={() => setIsOpen(true)}
        >
          {SelectedIcon ? <SelectedIcon /> : "Select Icon"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Header vtag="h3" className="text-center">
          Select Icon
        </Header>
        <div className="flex flex-wrap justify-center gap-2">
          {Object.values(TAG_ICONS).map((Icon, index) => (
            <Button
              key={index}
              size={"icon"}
              variant={"ghost"}
              onClick={() => {
                setIsOpen(false);
                setSelectedIcon(Icon);
              }}
            >
              <Icon />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SelectTagIconDialog };
