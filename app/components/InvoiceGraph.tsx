import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Graph } from "./Graph";
import { prisma } from "../utils/db"
import { requiredUser } from "../utils/hooks";

async function getInvoices(userId: string) {
  const rawData = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      userId: userId,
      createdAt: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const dailyTotals: { date: string; amount: number }[] = [];
  let currentDate = "";
  let currentTotal = 0;

  for (const invoice of rawData) {
    const dateStr = invoice.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (dateStr === currentDate) {
      currentTotal += invoice.total;
    } else {
      if (currentDate) {
        dailyTotals.push({ date: currentDate, amount: currentTotal });
      }
      currentDate = dateStr;
      currentTotal = invoice.total;
    }
  }

  if (currentDate) {
    dailyTotals.push({ date: currentDate, amount: currentTotal });
  }

  return dailyTotals;
}


export async function InvoiceGraph() {
  const session = await requiredUser();
  const data = await getInvoices(session.user?.id as string);
console.log(data);
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>
          Invoices which have been paid in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Graph data={data} />
      </CardContent>
    </Card>
  );
}
