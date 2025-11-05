import { appConfig } from "@/src/core/config";
import SidebarControl from "./sidebar-control";
import { menu } from "@/src/core/static/menu";
import NavLink from "../ui/nav-link";

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 bg-gray-50 h-full border-r border-gray-200 flex flex-col"
      style={{
        width: appConfig.sidebarWidth,
      }}
    >
      {/* Sidebar Control and Logo if needed */}
      <div className="p-2 ">
        <SidebarControl />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {menu.map(({ title, items }) => (
          <section key={title} className="mb-6">
            <h2 className="text-sidebar-foreground/70 text-xs px-2 mb-2 select-none">
              {title}
            </h2>
            <ul role="list" className="space-y-1">
              {items.map(({ label, icon: Icon, href }) => (
                <NavLink
                  key={label}
                  href={`/admin/` + href!}
                  menu
                  parentProps={{ role: "listitem" }}
                >
                  {Icon && <Icon className="shrink-0 text-gray-600" />}
                  <span>{label}</span>
                </NavLink>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </aside>
  );
}
