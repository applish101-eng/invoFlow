import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";
import { requiredUser } from "@/app/utils/hooks";

type InvoiceRef = {
  id: string
  invoiceName: string
  total: number
  status: string
  invoiceNumber: number
  currency: string
}

export async function GET() {
  const session = await requiredUser();
  const userId = session.user?.id as string;

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    select: {
      id: true,
      invoiceName: true,
      total: true,
      status: true,
      invoiceNumber: true,
      currency: true,
      clientName: true,
      clientEmail: true,
      clientAddress: true,
    },
  });

  const map = new Map<string, {
    clientName: string
    clientEmail: string
    clientAddress: string
    invoiceCount: number
    invoices: InvoiceRef[]
  }>()

  for (const inv of invoices) {
    const key = inv.clientName.toLowerCase().trim()
    const existing = map.get(key)
    if (existing) {
      existing.invoiceCount++
      existing.invoices.push({
        id: inv.id,
        invoiceName: inv.invoiceName,
        total: inv.total,
        status: inv.status,
        invoiceNumber: inv.invoiceNumber,
        currency: inv.currency,
      })
    } else {
      map.set(key, {
        clientName: inv.clientName,
        clientEmail: inv.clientEmail,
        clientAddress: inv.clientAddress,
        invoiceCount: 1,
        invoices: [{
          id: inv.id,
          invoiceName: inv.invoiceName,
          total: inv.total,
          status: inv.status,
          invoiceNumber: inv.invoiceNumber,
          currency: inv.currency,
        }],
      })
    }
  }

  return NextResponse.json(Array.from(map.values()))
}
