import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requiredUser } from "../utils/hooks";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import { DashboardLinks } from "../components/DashboardLinks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/utils/auth";
import { User2 } from "lucide-react";
import { prisma } from "@/app/utils/db";

async function getUser(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      address: true,
    },
  });

  if (!data) {
    redirect("/login");
  }

  if (!data.firstName || !data.lastName || !data.address) {
    redirect("/onboarding");
  }

  return data;
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requiredUser();

  const data = await getUser(session.user?.id as string);
  await getUser(session.user?.id as string);
  return (
    <>
      <div className="Wrapper grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className=" hidden border-r bg-muted/40 md:block">
          <div className=" flex flex-col max-h-screen h-full gap-2">
            <div className=" h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-3">
              <Link href="/" className="flex items-center gap-2">
                <Image src={Logo} className="size-9" alt="" />
                <p className=" font-semibold text-2xl text-blue-700 ">
                  InvoFlow
                </p>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4 ">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col ">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 ">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] p-0">
                <nav className="grid gap-2 mt-12 text-sm px-4 font-medium lg:px-4 ">
                  <DashboardLinks />
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2 ml-auto ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <Button
                    variant="outline"
                    className="w-10 h-10 p-0  rounded-full"
                  >
                    <User2
                      // src={session.user.image || ""}
                      // alt="Profile"
                      className="rounded-full "
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuSeparator></DropdownMenuSeparator>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/invoices">Invoices</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator></DropdownMenuSeparator>
                  <DropdownMenuItem asChild>
                    <form
                      className="w-full"
                      action={async () => {
                        "use server";
                        await signOut();
                      }}
                    >
                      <button className="w-full text-left cursor-pointer">
                        Log out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 flex-col p-4 gap-6 lg:gap-5 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
