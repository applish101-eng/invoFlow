import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { prisma } from "../utils/db";
import { requiredUser } from "../utils/hooks";
import { formatCurrency } from "@/lib/utils";

async function getData(userId: string) {
  const [totalInvoices, pendingInvoices, paidInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      select: {
        total: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PAID",
      },
      select: {
        id: true,
      },
    }),
  ]);

  return { totalInvoices, pendingInvoices, paidInvoices };
}

export async function DashboardBlocks() {
  const session = await requiredUser();
  const {totalInvoices, pendingInvoices, paidInvoices} = await getData(session.user?.id as string);
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground"></DollarSign>
          </CardHeader>
          <CardContent>
            <h2 className=" text-2xl font-bold">{formatCurrency(totalInvoices.reduce((acc, invoice) => acc + invoice.total, 0), "USD")}</h2>
            <p className=" text-xs text-muted-foreground">
              Based on the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">
              Total Invoices Issued
            </CardTitle>
            <Users className="size-4 text-muted-foreground"></Users>
          </CardHeader>
          <CardContent>
            <h2 className=" text-2xl font-bold">{totalInvoices.length}</h2>
            <p className=" text-xs text-muted-foreground">
              Total invoices issued
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <CreditCard className="size-4 text-muted-foreground"></CreditCard>
          </CardHeader>
          <CardContent>
            <h2 className=" text-2xl font-bold">{paidInvoices.length}</h2>
            <p className=" text-xs text-muted-foreground">
              Total invoices paid
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <Activity className="size-4 text-muted-foreground"></Activity>
          </CardHeader>
          <CardContent>
            <h2 className=" text-2xl font-bold">{pendingInvoices.length}</h2>
            <p className=" text-xs text-muted-foreground">
              Invoices which haven't been paid
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
