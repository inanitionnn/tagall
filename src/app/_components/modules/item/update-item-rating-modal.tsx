import {
  Button,
  DualRangeSlider,
  Header,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Separator,
} from "../../ui";
import { Dispatch, SetStateAction } from "react";
import { RATING_NAMES } from "../../../../constants";
import { ItemType } from "../../../../server/api/modules/item/types";
import { Star } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: ItemType;
  rating: number[];
  setRating: Dispatch<SetStateAction<number[]>>;
  submit: () => void;
};

const UpdateItemRatingModal = (props: Props) => {
  const { item, open, setOpen, rating, setRating, submit } = props;

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <div className="flex w-64 cursor-pointer items-center gap-2 rounded-md bg-background p-4 shadow transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-md">
          <Header vtag="h6">Rate:</Header>
          {item.rate ? (
            <>
              <div className="flex w-full justify-between">
                <div className="flex items-center gap-1">
                  <Paragraph className="font-semibold">{item.rate}</Paragraph>
                  <Star size={16} />
                </div>
                <Paragraph>{RATING_NAMES[item.rate]}</Paragraph>
              </div>
            </>
          ) : (
            <Paragraph>None</Paragraph>
          )}
        </div>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-0 sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <div className="flex w-full flex-col justify-center rounded-sm bg-background p-2">
          <div className="flex w-full flex-col justify-between gap-4 p-6 sm:min-w-96">
            <Header vtag="h4" className="leading-tight">
              Update Rate
            </Header>

            <Separator />
            <div className="flex w-full flex-col items-start gap-2">
              <div className="flex w-full items-center justify-between gap-2">
                <Paragraph>
                  <b>Rating:</b> {rating[0] ? rating[0] : "None"}
                </Paragraph>
                <Paragraph>
                  {rating[0] ? RATING_NAMES[rating[0]] : "Don't know"}
                </Paragraph>
              </div>
              <DualRangeSlider
                // label={(value) => value}
                value={rating}
                onValueChange={setRating}
                min={0}
                max={10}
                step={1}
              />
            </div>
            <Separator />
            <Button onClick={submit}>Update</Button>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { UpdateItemRatingModal };
