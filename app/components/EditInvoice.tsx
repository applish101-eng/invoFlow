"use client";

import { useActionState, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyDisplay } from "./CurrencyDisplay";
import { formatInvoiceNumber } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { editInvoice } from "../actions";
import { invoiceSchema } from "../utils/zodSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ErrorMessage } from "@/app/components/ErrorMessage";

interface iAppProps {
  data: {
    id: string;
    invoiceName: string;
    total: number;
    status: string;
    date: Date;
    dueDate: number;
    fromName: string;
    fromEmail: string;
    fromAddress: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    currency: string;
    invoiceNumber: number;
    note: string | null;
    invoiceItemDescription: string;
    invoiceItemQuantity: number;
    invoiceItemRate: number;
  };
  user: {
    firstName: string | null;
    lastName: string | null;
    address: string | null;
    email: string | null;
  };
}

export function EditInvoice({ data, user }: iAppProps) {
  const [lastResult, action, isPending] = useActionState(
    editInvoice,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: invoiceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      invoiceName: data.invoiceName,
      invoiceNumber: data.invoiceNumber,
      currency: data.currency,
      fromName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      fromEmail: user.email ?? "",
      fromAddress: user.address ?? "",
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientAddress: data.clientAddress,
      date: data.date.toISOString(),
      dueDate: data.dueDate,
      invoiceItemDescription: data.invoiceItemDescription,
      invoiceItemQuantity: data.invoiceItemQuantity,
      invoiceItemRate: data.invoiceItemRate,
      note: data.note ?? "",
      total: data.total,
      status: data.status,
    },
  });

  const [selectedDate, setSelectedDate] = useState(new Date(data.date));
  const [selectedCurrency, setSelectedCurrency] = useState(data.currency);
  const [selectedDueDate, setSelectedDueDate] = useState(String(data.dueDate));
  const [description, setDescription] = useState(data.invoiceItemDescription);
  const [quantity, setQuantity] = useState(data.invoiceItemQuantity);
  const [rate, setRate] = useState(data.invoiceItemRate);
  const amount = quantity * rate;

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/invoices"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      <form action={action} id={form.id} onSubmit={form.onSubmit}>
        <input type="hidden" name="id" value={data.id} />
        <input type="hidden" name="date" value={selectedDate.toISOString()} />
        <input type="hidden" name="dueDate" value={selectedDueDate} />
        <input type="hidden" name="status" value={data.status} />
        <input type="hidden" name="total" value={amount} />

        <div className="flex flex-col justify-center items-center">
          <Card className="w-full max-w-4xl">
            <CardContent className="p-6">
              <div className="flex flex-col gap-1 w-fit mb-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Draft</Badge>
                  <Input
                    name={fields.invoiceName.name}
                    key={fields.invoiceName.key}
                    defaultValue={fields.invoiceName.initialValue}
                    placeholder="Invoice title"
                  />
                </div>
                <ErrorMessage text={fields.invoiceName.errors} />
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <Label>Invoice No</Label>
                    <div className="flex">
                      <span className="px-3 border rounded-l-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
                        #
                      </span>
                      <div className="flex-1 px-3 border border-l-0 rounded-r-md bg-muted flex items-center h-10 text-sm font-mono">
                        {formatInvoiceNumber(data.invoiceNumber)}
                      </div>
                    </div>
                    <input type="hidden" name="invoiceNumber" value={data.invoiceNumber} />
                  </div>

                <div className="flex flex-col gap-2">
                  <Label>Currency</Label>
                  <Select
                    name={fields.currency.name}
                    key={fields.currency.key}
                    value={selectedCurrency}
                    onValueChange={setSelectedCurrency}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUD">
                        Australian Dollar -- AUD
                      </SelectItem>
                      <SelectItem value="CAD">Canadian Dollar -- CAD</SelectItem>
                      <SelectItem value="CHF">Swiss Franc -- CHF</SelectItem>
                      <SelectItem value="CNY">Chinese Yuan -- CNY</SelectItem>
                      <SelectItem value="EUR">Euro -- EUR</SelectItem>
                      <SelectItem value="GBP">British Pound -- GBP</SelectItem>
                      <SelectItem value="INR">Indian Rupee -- INR</SelectItem>
                      <SelectItem value="JPY">Japanese Yen -- JPY</SelectItem>
                      <SelectItem value="NPR">Nepalese Rupee -- NPR</SelectItem>
                      <SelectItem value="USD">
                        United States Dollar -- USD
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage text={fields.invoiceNumber.errors} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    {" "}
                    <Label>From</Label>{" "}
                    <span className=" flex items-center gap-2 text-gray-400">
                      <Info className="size-4" /> Auto-filled from profile
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Input
                      name={fields.fromName.name}
                      key={fields.fromName.key}
                      defaultValue={
                        user
                          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                          : ""
                      }
                      placeholder="Your Name"
                      disabled
                    />
                    <input
                      type="hidden"
                      name={fields.fromName.name}
                      value={
                        user
                          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                          : ""
                      }
                    />
                    <ErrorMessage text={fields.fromName.errors} />
                    <Input
                      name={fields.fromEmail.name}
                      key={fields.fromEmail.key}
                      type="email"
                      defaultValue={user?.email ?? ""}
                      placeholder="Your Email"
                      disabled
                    />
                    <input
                      type="hidden"
                      name={fields.fromEmail.name}
                      value={user?.email ?? ""}
                    />
                    <ErrorMessage text={fields.fromEmail.errors} />
                    <Input
                      name={fields.fromAddress.name}
                      key={fields.fromAddress.key}
                      defaultValue={user?.address ?? ""}
                      placeholder="Your Address"
                      disabled
                    />
                    <input
                      type="hidden"
                      name={fields.fromAddress.name}
                      value={user?.address ?? ""}
                    />
                    <ErrorMessage text={fields.fromAddress.errors} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>To</Label>
                  <div className="space-y-2">
                    <Input
                      name={fields.clientName.name}
                      key={fields.clientName.key}
                      defaultValue={fields.clientName.initialValue}
                      placeholder="Client Name"
                    />
                    <ErrorMessage text={fields.clientName.errors} />
                    <Input
                      name={fields.clientEmail.name}
                      key={fields.clientEmail.key}
                      defaultValue={fields.clientEmail.initialValue}
                      type="email"
                      placeholder="Client Email"
                    />
                    <ErrorMessage text={fields.clientEmail.errors} />
                    <Input
                      name={fields.clientAddress.name}
                      key={fields.clientAddress.key}
                      defaultValue={fields.clientAddress.initialValue}
                      placeholder="Client Address"
                    />
                    <ErrorMessage text={fields.clientAddress.errors} />
                  </div>
                </div>
                <div className="mt-6 w-[220px] flex flex-col items-start gap-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                        }).format(selectedDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => setSelectedDate(date || new Date())}
                        disabled={{ before: new Date() }}
                      />
                    </PopoverContent>
                  </Popover>
                  <ErrorMessage text={fields.date.errors} />
                </div>

                <div className="mt-6 w-full flex flex-col items-start gap-2">
                  <Label>Income Due</Label>
                  <Select
                    value={selectedDueDate}
                    onValueChange={setSelectedDueDate}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Due on Reciept</SelectItem>
                      <SelectItem value="15">Net 15</SelectItem>
                      <SelectItem value="30">Net 30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-12 gap-4 mt-10 mb-2 font-medium">
                  <p className="col-span-6">Description</p>
                  <p className="col-span-2">Quantity</p>
                  <p className="col-span-2">Rate</p>
                  <p className="col-span-2">Amount</p>
                </div>

                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-6 flex flex-col gap-1">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Item description"
                      className="resize-none"
                      name={fields.invoiceItemDescription.name}
                      key={fields.invoiceItemDescription.key}
                    />
                    <ErrorMessage text={fields.invoiceItemDescription.errors} />
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
                    <Input
                      value={quantity || ""}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                      }
                      className="resize-none"
                      placeholder="0"
                      type="number"
                      name={fields.invoiceItemQuantity.name}
                      key={fields.invoiceItemQuantity.key}
                    />
                    <ErrorMessage text={fields.invoiceItemQuantity.errors} />
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
                    <Input
                      value={rate || ""}
                      onChange={(e) => setRate(Number(e.target.value))}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                      }
                      className="resize-none"
                      placeholder="0"
                      type="number"
                      name={fields.invoiceItemRate.name}
                      key={fields.invoiceItemRate.key}
                    />
                    <ErrorMessage text={fields.invoiceItemRate.errors} />
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
                    <Input
                      className="resize-none"
                      placeholder="0"
                      type="number"
                      value={amount}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-1/3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      <CurrencyDisplay
                        amount={amount}
                        currency={selectedCurrency}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-t">
                    <span>Total ({selectedCurrency})</span>
                    <span className="font-medium underline underline-offset-2">
                      <CurrencyDisplay
                        amount={amount}
                        currency={selectedCurrency}
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Label>Note</Label>
                <Textarea
                  placeholder="Add your notes here"
                  className="w-full resize-none"
                  name={fields.note.name}
                  key={fields.note.key}
                  defaultValue={fields.note.initialValue}
                />
                <ErrorMessage text={fields.note.errors} />
              </div>

              <div className="flex justify-end mt-2">
                <div>
                  <SubmitButton text="Update Invoice" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </>
  );
}
