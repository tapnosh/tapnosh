export interface NavItem {
  text: string;
  href: string;
  icon?: SVGElement;
}

export const navItems: { [key: string]: NavItem } = {
  dashboard: { text: "Dashboard", href: "/dashboard" },
  adminPanel: { text: "Admin Panel", href: "/admin" },
  profile: { text: "Profile", href: "/profile" },
};
