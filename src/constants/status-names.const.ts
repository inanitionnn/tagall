import { ItemStatus } from "@prisma/client";
import { Bookmark, Check, Eye, LucideIcon, Trash2 } from "lucide-react";

export const STATUS_NAMES: Record<ItemStatus, string> = {
  ABANDONED: "Adandoned",
  COMPLETED: "Completed",
  INPROGRESS: "In Progress",
  NOTSTARTED: "Not Started",
} as const;

export const STATUS_ICONS: Record<ItemStatus, LucideIcon> = {
  ABANDONED: Trash2,
  COMPLETED: Check,
  INPROGRESS: Eye,
  NOTSTARTED: Bookmark,
} as const;
