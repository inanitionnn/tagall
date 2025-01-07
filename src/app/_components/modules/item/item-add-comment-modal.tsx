'use client';
import {
  AutosizeTextarea,
  Button,
  DualRangeSlider,
  Header,
  Input,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Separator,
} from '../../ui';
import { useState } from 'react';
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from '../../../../constants';
import type { ItemType } from '../../../../server/api/modules/item/types';
import { ItemStatus } from '@prisma/client';
import { useAddComment } from './hooks/use-add-comment.hook';

type Props = {
  item: ItemType;
};

const ItemAddCommentModal = (props: Props) => {
  const { item } = props;
  const [open, setOpen] = useState(false);

  const {
    description,
    rating,
    setDescription,
    setRating,
    status,
    setStatus,
    setTitle,
    submit,
    title,
  } = useAddComment({
    item,
    setOpen,
  });

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <div className="flex cursor-pointer rounded-md bg-background p-4 shadow transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-md">
          <Header vtag="h6">Add comment</Header>
        </div>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-0 sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <div className="flex w-full flex-col justify-center rounded-sm bg-background p-2">
          <div className="flex w-full flex-col justify-between gap-4 p-6 sm:min-w-96">
            <Header vtag="h4" className="leading-tight">
              Add new comment
            </Header>
            <Separator />
            <div className="flex w-full flex-col items-start gap-2">
              <Paragraph>
                <b>Title:</b>
              </Paragraph>
              <div className="w-full">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="1 Season"
                  max={255}
                />
              </div>
            </div>
            <Separator />
            <div className="flex w-full flex-col items-start gap-2">
              <Paragraph>
                <b>Description:</b>
              </Paragraph>
              <div className="w-full">
                <AutosizeTextarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Good show, I liked it"
                  maxHeight={200}
                  maxLength={1000}
                />
              </div>
            </div>
            <Separator />
            <div className="flex w-full items-center justify-between gap-2">
              <Paragraph>
                <b>Status:</b>
                {'   '}
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
                        size={'icon'}
                        variant={status === s ? 'default' : 'secondary'}
                        onClick={() => setStatus(s)}
                      >
                        <IconComponent size={16} />
                      </Button>
                    );
                  })}
              </div>
            </div>
            <Separator />
            <div className="flex w-full flex-col items-start gap-2">
              <div className="flex w-full items-center justify-between gap-2">
                <Paragraph>
                  <b>Rating:</b> {rating[0] ? rating[0] : 'None'}
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

            <Button onClick={submit}>Add to collection</Button>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { ItemAddCommentModal };
