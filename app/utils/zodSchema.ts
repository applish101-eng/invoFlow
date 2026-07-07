import { z } from "zod";
export const onboardingSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" }),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
});

export const invoiceSchema = z.object({
  invoiceName: z
    .string()
    .min(3, { message: "Invoice name must be at least 3 characters" }),
  total: z.number().min(1, { message: "Total must be at least $1" }),
  status: z.enum(["PAID", "PENDING"]).default("PENDING"),
  date: z.string().min(1, { message: "Please select an invoice date" }),
  fromName: z
    .string()
    .min(3, { message: "Your name must be at least 3 characters" }),
  fromEmail: z.string().email("Please enter a valid email address"),
  fromAddress: z
    .string()
    .min(3, { message: "Your address must be at least 3 characters" }),

  clientName: z
    .string()
    .min(3, { message: "Client name must be at least 3 characters" }),
  clientEmail: z.string().email("Please enter a valid email address"),
  clientAddress: z
    .string()
    .min(3, { message: "Client address must be at least 3 characters" }),

  currency: z.string().min(1, "Please select a currency"),
  dueDate: z.number().min(0, "Please select payment terms"),
  invoiceNumber: z.coerce.number().int().positive("Invoice number must be a positive number"),
  note: z.string().optional(),
  invoiceItemDescription: z.string().min(1, "Please enter an item description"),
  invoiceItemQuantity: z.number().min(1, "Quantity must be at least 1"),
  invoiceItemRate: z.number().min(1, "Rate must be at least $1"),
});
