import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "../utils/db"
import { requiredUser } from "../utils/hooks";
import { formatCurrency } from "@/lib/utils";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      clientName: true,
      clientEmail: true,
      total: true,
      currency:true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });
  return data;
}

export async function RecentInvoices() {
  const session = await requiredUser();
  const data = await getData(session.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {data.map((invoice, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Avatar className="hidden sm:flex size-9 shrink-0">
                <AvatarFallback>
                  {invoice.clientName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-medium leading-none truncate">
                  {invoice.clientName}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {invoice.clientEmail}
                </p>
              </div>
            </div>
            <div className="font-medium shrink-0 whitespace-nowrap">
              {formatCurrency(invoice.total, invoice.currency || "USD")}
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent invoices</p>
        )}
      </CardContent>
    </Card>
  );
}
