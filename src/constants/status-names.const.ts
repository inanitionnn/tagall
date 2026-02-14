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
  ItemStatus.COMPLETED,
  ItemStatus.INPROGRESS,
  ItemStatus.WAITING,
  ItemStatus.NOTSTARTED,
  ItemStatus.ABANDONED,
] as const;
