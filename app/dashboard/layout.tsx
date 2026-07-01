import { Children, ReactNode } from "react";
import { requiredUser } from "../utils/hooks";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import { DashboardLinks } from "../components/DashboardLinks";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requiredUser();
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
              <nav className="gird items-start px-2 text-sm font-medium lg:px-4 ">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
