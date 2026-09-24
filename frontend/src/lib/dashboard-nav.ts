import {
  LayoutDashboard,
  FileCode2,
  SquarePen,
  Tag,
  Globe,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** matches every route under this prefix, not just an exact path */
  matchPrefix?: string;
};

/**
 * Primary navigation for the dashboard sidebar. Kept in one place so the
 * sidebar, the mobile drawer, and any future command palette stay in sync.
 */
export const dashboardNav: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My snippets",
    href: "/dashboard/snippets",
    icon: FileCode2,
    matchPrefix: "/dashboard/snippets",
  },
  {
    label: "New snippet",
    href: "/dashboard/new",
    icon: SquarePen,
    matchPrefix: "/dashboard/new",
  },
  {
    label: "Tags",
    href: "/dashboard/tags",
    icon: Tag,
    matchPrefix: "/dashboard/tags",
  },
  {
    label: "Explore",
    href: "/dashboard/explore",
    icon: Globe,
    matchPrefix: "/dashboard/explore",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    matchPrefix: "/dashboard/settings",
  },
];

/** sidebar footer links — signed-out surface only */
export const dashboardFooterNav: NavItem[] = [
  {
    label: "Back to site",
    href: "/",
    icon: LayoutDashboard,
  },
];
