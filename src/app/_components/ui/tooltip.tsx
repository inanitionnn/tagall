"use client";

import { cn } from "~/lib/utils";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type Side = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  content: string;
  children: ReactNode;
  className?: string;
  side?: Side;
};

type TooltipPosition = { top: number; left: number };

const GAP = 6;

function computePosition(
  trigger: DOMRect,
  tooltip: DOMRect,
  side: Side,
): TooltipPosition {
  switch (side) {
    case "top":
      return {
        top: trigger.top - tooltip.height - GAP,
        left: trigger.left + trigger.width / 2 - tooltip.width / 2,
      };
    case "bottom":
      return {
        top: trigger.bottom + GAP,
        left: trigger.left + trigger.width / 2 - tooltip.width / 2,
      };
    case "left":
      return {
        top: trigger.top + trigger.height / 2 - tooltip.height / 2,
        left: trigger.left - tooltip.width - GAP,
      };
    case "right":
      return {
        top: trigger.top + trigger.height / 2 - tooltip.height / 2,
        left: trigger.right + GAP,
      };
  }
}

const Tooltip = ({ content, children, className, side = "top" }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setPosition(computePosition(triggerRect, tooltipRect, side));
  }, [side]);

  useEffect(() => {
    if (visible) {
      updatePosition();
    }
  }, [visible, updatePosition]);

  return (
    <span
      ref={triggerRef}
      className={cn("inline-flex items-center", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            ref={tooltipRef}
            style={{ top: position.top, left: position.left }}
            className={cn(
              "pointer-events-none fixed z-[9999] rounded-md border border-border bg-popover px-2 py-1 text-xs font-normal text-popover-foreground shadow-md",
              "whitespace-nowrap",
            )}
          >
            {content}
          </span>,
          document.body,
        )}
    </span>
  );
};

export { Tooltip };
