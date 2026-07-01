import { HomeIcon, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "@/lib/cm"
export const dashboardLinks = [
  {
    id: 0,
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },

  {
    id: 1,
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: User2,
  },
];

export function DashboardLinks() {
  const pathname = usePathname();
  return (
    <>
      {dashboardLinks.map((link) => (
        <Link
          href={link.href}
          key={link.id}
          className={cn(pathname === link.href ? 'text-primary bg-primary/10': 'text-muted-froground hover:text-foreground')}
        >
          <link.icon className="size-5" />
          {link.name}
        </Link>
      ))}
    </>
  );
}
