import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const { invoiceId } = await params;
  const data = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: {
      invoiceNumber: true,
      invoiceName: true,
      total: true,
      status: true,
      date: true,
      dueDate: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      clientName: true,
      clientEmail: true,
      clientAddress: true,
      currency: true,
      note: true,
      invoiceItemDescription: true,
      invoiceItemQuantity: true,
      invoiceItemRate: true,
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = 20;

  // ── HEADER ──
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  pdf.text("INVOICE", 20, y);
  y += 10;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("#" + String(data.invoiceNumber), 20, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.text("Status: " + data.status, 120, y - 8);

  // ── FROM (left) & Details (right) ──
  y += 8;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("From", 20, y);
  pdf.text("Details", 120, y);
  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(data.fromName, 20, y);
  const issueDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(data.date);
  pdf.text("Issue Date: " + issueDate, 120, y);
  y += 5;
  pdf.text(data.fromEmail, 20, y);
  const dueDateFormatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(new Date(data.date).getTime() + data.dueDate * 86400000));
  pdf.text("Due Date: " + dueDateFormatted, 120, y);
  y += 5;
  pdf.text(data.fromAddress, 20, y);
  y += 14;

  // ── TO ──
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Bill To", 20, y);
  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(data.clientName, 20, y);
  y += 5;
  pdf.text(data.clientEmail, 20, y);
  y += 5;
  pdf.text(data.clientAddress, 20, y);
  y += 14;

  // ── ITEMS TABLE ──
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Items", 20, y);
  y += 7;

  pdf.setFontSize(8);
  pdf.text("DESCRIPTION", 20, y);
  pdf.text("QTY", 110, y, { align: "right" });
  pdf.text("RATE", 130, y, { align: "right" });
  pdf.text("AMOUNT", 165, y, { align: "right" });
  y += 4;
  pdf.line(20, y, 190, y);
  y += 4;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(data.invoiceItemDescription, 20, y);
  pdf.text(String(data.invoiceItemQuantity), 108, y, { align: "right" });
  const rateStr = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: data.currency,
  }).format(data.invoiceItemRate);
  pdf.text(rateStr, 142, y, { align: "right" });
  const itemTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: data.currency,
  }).format(data.invoiceItemQuantity * data.invoiceItemRate);
  pdf.text(itemTotal, 175, y, { align: "right" });
  y += 6;
  pdf.line(20, y, 190, y);
  y += 14;

  // ── TOTAL ──
  const totalStr = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: data.currency,
  }).format(data.total);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Total Due: " + totalStr, 125, y);
  y += 12;

  // ── NOTE ──
  if (data.note) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Note: " + data.note, 20, y);
    y += 10;
  }

  // ── FOOTER ──
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text(data.fromName + " | " + data.fromEmail, 105, 285, {
    align: "center",
  });

  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'inline; filename="invoice-' + data.invoiceNumber + '.pdf"',
    },
  });
}
