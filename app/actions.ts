"use server";

import { requiredUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchema";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient, sender } from "./utils/mailtrap";

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
  await emailClient.send({
    from: sender,
    to: [{ email: "applish101@gmail.com" }],
    subject: "Welcome to InvoFlow",
    text: "You have been onboarded successfully.",
    category: "onboarding",
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

  const invoice = await prisma.invoice.create({
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
      user: { connect: { id: session.user?.id as string } },
    },
  });

  await emailClient.send({
    from: sender,
    to: [{ email: "applish101@gmail.com" }],
    template_uuid: process.env.MAILTRAP_TEMPLATE_UUID!,
    template_variables: {
      invoiceNumber: `#${submission.value.invoiceNumber}`,
      clientName: submission.value.clientName,
      fromEmail: submission.value.fromEmail,
      dueDate: new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
        new Date(new Date(submission.value.date).getTime() + submission.value.dueDate * 86400000)
      ),
      currency: submission.value.currency,
      total: new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(submission.value.total),
      invoiceLink: `http://localhost:3000//api/invoice/${invoice.id}`,
    },
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

  await emailClient.send({
    from: sender,
    to: [{ email: "applish101@gmail.com" }],
    template_uuid: process.env.MAILTRAP_UPDATE_TEMPLATE_UUID!,
    template_variables: {
      invoiceNumber: `#${submission.value.invoiceNumber}`,
      clientName: submission.value.clientName,
      fromEmail: submission.value.fromEmail,
      dueDate: new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
        new Date(new Date(submission.value.date).getTime() + submission.value.dueDate * 86400000)
      ),
      currency: submission.value.currency,
      total: new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(submission.value.total),
      invoiceLink: `http://localhost:3000//api/invoice/${invoiceId}`,
    },
  });

  return redirect("/dashboard/invoices");
}
