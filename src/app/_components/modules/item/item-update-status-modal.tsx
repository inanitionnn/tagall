import {
  Button,
  Header,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Separator,
} from "../../ui";
import type { Dispatch, SetStateAction } from "react";
import { STATUS_ICONS, STATUS_NAMES } from "../../../../constants";
import { ItemStatus } from "@prisma/client";
import type { ItemType } from "../../../../server/api/modules/item/types";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: ItemType;
  status: ItemStatus;
  setItemStatus: Dispatch<SetStateAction<ItemStatus>>;
  submit: () => void;
};

const ItemUpdateStatusModal = (props: Props) => {
  const { item, open, setOpen, status, setItemStatus, submit } = props;

  const StatusIcon = STATUS_ICONS[item.status];

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <div className="flex w-64 cursor-pointer items-center gap-2 rounded-md bg-background p-4 shadow transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-md">
          <Header vtag="h6">Status:</Header>
          <div className="flex w-full items-center justify-between gap-1">
            <StatusIcon size={16} />
            <Paragraph>{STATUS_NAMES[item.status]}</Paragraph>
          </div>
        </div>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-0 sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <div className="flex w-full flex-col justify-center rounded-sm bg-background p-2">
          <div className="flex w-full flex-col justify-between gap-4 p-6 sm:min-w-96">
            <Header vtag="h4" className="leading-tight">
              Update Status
            </Header>

            <Separator />
            <div className="flex w-full items-center justify-between gap-2">
              <Paragraph>
                <b>Status:</b>
                {"   "}
                {STATUS_NAMES[status]}
              </Paragraph>
              <div className="flex gap-2">
                {Object.values(ItemStatus)
                  .reverse()
                  .map((s) => {
                    const IconComponent = STATUS_ICONS[s];
                    return (
                      <Button
                        key={s}
                        size={"icon"}
                        variant={status === s ? "default" : "secondary"}
                        onClick={() => setItemStatus(s)}
                      >
                        <IconComponent size={16} />
                      </Button>
                    );
                  })}
              </div>
            </div>
            <Separator />
            <Button onClick={submit}>Update</Button>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { ItemUpdateStatusModal };
