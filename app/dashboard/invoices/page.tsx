import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { InvoiceList } from "@/app/components/InvoiceList";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ToastHandler from "@/app/components/ToastHandler";
import { requiredUser } from "@/app/utils/hooks";
import { prisma } from "@/app/utils/db";

export default async function InvoicesRoute() {
  const session = await requiredUser();

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user?.id as string },
    select: {
      id: true,
      clientName: true,
      total: true,
      createdAt: true,
      status: true,
      invoiceNumber: true,
      currency: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <ToastHandler />
      <Card>
        <CardHeader className="text-2xl font-bold">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold">Invoices</CardTitle>
              <CardDescription className="font-normal">
                Manage your invoices
              </CardDescription>
            </div>
            <Link
              href="/dashboard/invoices/create"
              className={buttonVariants({
                className: "flex items-center",
                variant: "default",
              })}
            >
              <PlusIcon className="size-5" />
              <span className="text-sm font-normal">Create Invoice</span>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <InvoiceList invoices={JSON.parse(JSON.stringify(invoices))} />
        </CardContent>
      </Card>
    </>
  );
}
