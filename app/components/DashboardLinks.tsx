"use client"
import { HomeIcon, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"
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
          className={cn(pathname === link.href ? 'text-primary bg-primary/10 w-full flex items0-center gap-4 rounded-lg p-3 text-sm font-medium transition-colors ': 'text-muted-foreground hover:text-foreground w-full flex items-center gap-4 rounded-lg p-3 text-sm font-medium transition-colors')}
        >
          <link.icon className="size-5" />
          {link.name}
        </Link>
      ))}
    </>
  );
}
