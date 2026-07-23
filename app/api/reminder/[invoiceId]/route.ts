import { prisma } from "@/app/utils/db";
import { emailClient, sender } from "@/app/utils/mailtrap";
import { requiredUser } from "@/app/utils/hooks";
import { buildInvoiceHtml } from "@/app/utils/email";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const session = await requiredUser();
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: { id: invoiceId, userId: session.user?.id },
  });

  if (!data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const dueDateFormatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(
    new Date(new Date(data.date).getTime() + data.dueDate * 86400000),
  );

  const totalFormatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(data.total);

  const html = buildInvoiceHtml({
    heading: "REMINDER",
    invoiceNumber: `#${data.invoiceNumber}`,
    clientName: data.clientName,
    fromEmail: data.fromEmail,
    dueDate: dueDateFormatted,
    currency: data.currency,
    total: totalFormatted,
    invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
    bodyText: "This is a reminder for your pending invoice. Please find the summary below.",
  });

  await emailClient.emails.send({
    from: sender,
    to: [data.clientEmail],
    subject: `Reminder: Invoice #${data.invoiceNumber} from InvoFlow`,
    html,
  });

  return redirect("/dashboard/invoices?status=reminder");
}
