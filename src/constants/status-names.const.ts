import { ItemStatus } from "@prisma/client";
import {
  Bookmark,
  CalendarClock,
  Check,
  Eye,
  type LucideIcon,
  Trash2,
} from "lucide-react";

export const STATUS_NAMES: Record<ItemStatus, string> = {
  ABANDONED: "Abandoned",
  COMPLETED: "Completed",
  WAITING: "Waiting",
  INPROGRESS: "In Progress",
  NOTSTARTED: "Not Started",
} as const;

export const STATUS_ICONS: Record<ItemStatus, LucideIcon> = {
  ABANDONED: Trash2,
  COMPLETED: Check,
  WAITING: CalendarClock,
  INPROGRESS: Eye,
  NOTSTARTED: Bookmark,
} as const;

export const STATUS_VALUES = [
  ItemStatus.ABANDONED,
  ItemStatus.NOTSTARTED,
  ItemStatus.INPROGRESS,
  ItemStatus.WAITING,
  ItemStatus.COMPLETED,
] as const;

export const STATUS_COLORS: Record<ItemStatus, string> = {
  COMPLETED: "text-green-400",
  INPROGRESS: "text-yellow-400",
  WAITING: "text-yellow-400",
  NOTSTARTED: "text-foreground",
  ABANDONED: "text-red-400",
} as const;
