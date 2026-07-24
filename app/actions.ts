"use server";

import { requiredUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema, profileSchema, templateSchema } from "./utils/zodSchema";
import { prisma } from "./utils/db";
import { findFrequentPatterns } from "@/lib/algorithms/frequency";
import { formatInvoiceNumber } from "@/lib/utils";
import { redirect } from "next/navigation";
import { emailClient, sender } from "./utils/mailtrap";
import { buildInvoiceHtml } from "./utils/email";

export async function onboardUser(prevState: any, formData: FormData) {
  const session = await requiredUser();
  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });
  await emailClient.emails.send({
    from: sender,
    to: ["applish101@gmail.com"],
    subject: "Welcome to InvoFlow",
    text: "You have been onboarded successfully.",
  });
  return redirect("/dashboard/invoices");
}

export async function createInvoice(prevState: unknown, formData: FormData) {
  const session = await requiredUser();
  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const last = await prisma.invoice.findFirst({
    where: { userId: session.user?.id as string },
    orderBy: { invoiceNumber: "desc" },
    select: { invoiceNumber: true },
  })
  const nextNumber = (last?.invoiceNumber ?? 0) + 1

  const rawItems = submission.value.items
    ? (JSON.parse(submission.value.items) as { description: string; quantity: number; rate: number }[])
    : [{ description: submission.value.invoiceItemDescription, quantity: submission.value.invoiceItemQuantity, rate: submission.value.invoiceItemRate }]

  const total = rawItems.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const first = rawItems[0]

  const invoice = await prisma.invoice.create({
    data: {
      invoiceName: submission.value.invoiceName,
      total,
      status: submission.value.status as "PAID" | "PENDING",
      date: new Date(submission.value.date),
      dueDate: submission.value.dueDate,
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,
      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,
      currency: submission.value.currency,
      invoiceNumber: nextNumber,
      note: submission.value.note ?? "",
      items: rawItems,
      invoiceItemDescription: first.description,
      invoiceItemQuantity: first.quantity,
      invoiceItemRate: first.rate,
      user: { connect: { id: session.user?.id as string } },
    },
  });

  const dueDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(
    new Date(
      new Date(submission.value.date).getTime() +
        submission.value.dueDate * 86400000,
    ),
  );
  const formattedTotal = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(total);
  const invNum = formatInvoiceNumber(nextNumber)

  const html = buildInvoiceHtml({
    heading: "INVOICE",
    invoiceNumber: `#${invNum}`,
    clientName: submission.value.clientName,
    fromEmail: submission.value.fromEmail,
    dueDate,
    currency: submission.value.currency,
    total: formattedTotal,
    invoiceLink: `http://localhost:3000/api/invoice/${invoice.id}`,
    bodyText: "Your invoice has been created. Please find the summary below.",
  });

  await emailClient.emails.send({
    from: sender,
    to: [submission.value.clientEmail],
    subject: `Invoice #${invNum} from InvoFlow`,
    html,
  });

  return redirect("/dashboard/invoices");
}

export async function editInvoice(prevState: unknown, formData: FormData) {
  const session = await requiredUser();
  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const invoiceId = formData.get("id") as string;

  await prisma.invoice.update({
    where: {
      id: invoiceId,
      userId: session.user?.id as string,
    },
    data: {
      invoiceName: submission.value.invoiceName,
      total: submission.value.total,
      status: submission.value.status as "PAID" | "PENDING",
      date: new Date(submission.value.date),
      dueDate: submission.value.dueDate,
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,
      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,
      currency: submission.value.currency,
      invoiceNumber: submission.value.invoiceNumber,
      note: submission.value.note ?? "",
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
    },
  });

  const dueDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(
    new Date(
      new Date(submission.value.date).getTime() +
        submission.value.dueDate * 86400000,
    ),
  );
  const formattedTotal = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(submission.value.total);
  const invNum = formatInvoiceNumber(submission.value.invoiceNumber ?? 0)

  const html = buildInvoiceHtml({
    heading: "UPDATED INVOICE",
    invoiceNumber: `#${invNum}`,
    clientName: submission.value.clientName,
    fromEmail: submission.value.fromEmail,
    dueDate,
    currency: submission.value.currency,
    total: formattedTotal,
    invoiceLink: `http://localhost:3000/api/invoice/${invoiceId}`,
    bodyText:
      "Your invoice has been updated. Please find the updated summary below.",
  });

  await emailClient.emails.send({
    from: sender,
    to: [submission.value.clientEmail],
    subject: `Invoice #${invNum} has been updated`,
    html,
  });

  return redirect("/dashboard/invoices?status=updated");
}

export async function deleteInvoice(formData: FormData) {
  const session = await requiredUser();
  const invoiceId = formData.get("id") as string;

  await prisma.invoice.delete({
    where: {
      id: invoiceId,
      userId: session.user?.id as string,
    },
  });

  return redirect("/dashboard/invoices?status=deleted");
}

export async function markINvoiceAsPaid(formData: FormData) {
  const session = await requiredUser();
  const invoiceId = formData.get("id") as string;

  await prisma.invoice.update({
    where: {
      id: invoiceId,
      userId: session.user?.id as string,
    },
    data: { status: "PAID" },
  });
  return redirect("/dashboard/invoices?status=paid");
}

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await requiredUser();
  const submission = parseWithZod(formData, {
    schema: profileSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
      image: submission.value.image || null,
    },
  });

  return redirect("/dashboard/profile?success=true");
}

export async function createTemplate(prevState: any, formData: FormData) {
  const session = await requiredUser();
  const submission = parseWithZod(formData, {
    schema: templateSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { name, items, currency } = submission.value

  await prisma.template.create({
    data: {
      name,
      data: { items, currency },
      isAutoGenerated: false,
      user: { connect: { id: session.user?.id as string } },
    },
  });

  return { type: "success" as const, message: "Template created" };
}

export async function deleteTemplate(formData: FormData) {
  const session = await requiredUser();
  const templateId = formData.get("id") as string;

  await prisma.template.delete({
    where: {
      id: templateId,
      userId: session.user?.id as string,
    },
  });

  return { type: "success" as const, message: "Template deleted" };
}

export async function generateAutoTemplates() {
  const session = await requiredUser();
  const userId = session.user?.id as string

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    select: {
      invoiceItemDescription: true,
      invoiceItemRate: true,
      invoiceItemQuantity: true,
      currency: true,
    },
  });

  const patterns = findFrequentPatterns(invoices)

  if (patterns.length === 0) {
    return { type: "error" as const, message: "No frequent patterns found. Create at least 3 similar invoices first." };
  }

  let created = 0;

  for (const p of patterns) {
    const existing = await prisma.template.findFirst({
      where: {
        userId,
        isAutoGenerated: true,
        name: p.description,
      },
    });

    if (!existing) {
      await prisma.template.create({
        data: {
          name: p.description,
          data: {
            items: [{ description: p.description, quantity: p.quantity, rate: p.rate }],
            currency: p.currency,
          },
          isAutoGenerated: true,
          frequency: p.frequency,
          user: { connect: { id: userId } },
        },
      });
      created++;
    }
  }

  return { type: "success" as const, message: `${created} template${created !== 1 ? "s" : ""} generated from invoices` };
}

export async function deleteClient(formData: FormData) {
  const session = await requiredUser();
  const clientName = formData.get("clientName") as string;

  await prisma.invoice.deleteMany({
    where: {
      userId: session.user?.id as string,
      clientName,
    },
  });

  return { type: "success" as const, message: `All invoices for ${clientName} deleted` };
}
