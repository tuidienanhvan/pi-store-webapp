import React from "react";
import { SidebarLink } from "./SidebarLink";
import { NavGroupLabel } from "./NavGroupLabel";

export function NavGroup({ group, items, onLinkClick }) {
  return (
    <div className="flex flex-col mb-6 last:mb-0">
      {group && <NavGroupLabel label={group} />}
      <div className="flex flex-col">
        {items.map((item) => (
          <SidebarLink key={item.to} {...item} onClick={onLinkClick} />
        ))}
      </div>
    </div>
  );
}
