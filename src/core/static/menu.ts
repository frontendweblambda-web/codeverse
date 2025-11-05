import { IconType } from "react-icons";
import {
  MdDashboard,
  MdFolder,
  MdPeople,
  MdBarChart,
  MdDescription,
} from "react-icons/md";

export type Menu = {
  label: string;
  icon?: IconType;
  href?: string;
  children?: Menu[];
};

export const menu: { title: string; items: Menu[] }[] = [
  {
    title: "Home",
    items: [
      { label: "Dashboard", href: "/", icon: MdDashboard },
      { label: "Role", href: "/role", icon: MdBarChart },
      { label: "Permission", href: "/analytics", icon: MdBarChart },
      { label: "User", href: "/projects", icon: MdFolder },
      { label: "Team", href: "/team", icon: MdPeople },
    ],
  },
  {
    title: "Documents",
    items: [
      { label: "Data Library", href: "/data-library", icon: MdFolder },
      { label: "Reports", href: "/reports", icon: MdDescription },
      { label: "Word Assistant", href: "/word-assistant", icon: MdDescription },
    ],
  },
];
