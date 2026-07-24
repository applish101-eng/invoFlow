"use client";

import { useActionState, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyDisplay } from "./CurrencyDisplay";
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
import { CalendarIcon, Info, Plus, X } from "lucide-react";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { createInvoice } from "../actions";
import { LoadTemplateDialog } from "./LoadTemplateDialog";
import { ClientAutocomplete } from "./ClientAutocomplete";
import { invoiceSchema } from "../utils/zodSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ErrorMessage } from "@/app/components/ErrorMessage";

type ItemRow = {
  description: string
  quantity: number
  rate: number
}

export default function CreateInvoice({
  user,
  nextInvoiceNumber,
}: {
  user: {
    firstName: string | null;
    lastName: string | null;
    address: string | null;
    email: string | null;
  };
  nextInvoiceNumber: number;
}) {
  const [lastResult, action] = useActionState(createInvoice, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: invoiceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCurrency, setSelectedCurrency] = useState("NPR");
  const [selectedDueDate, setSelectedDueDate] = useState("0");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  const [items, setItems] = useState<ItemRow[]>([
    { description: "", quantity: 1, rate: 1 },
  ]);

  const total = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)

  function addItem() {
    setItems([...items, { description: "", quantity: 1, rate: 1 }])
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: keyof ItemRow, value: string | number) {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  function handleTemplateSelect(data: {
    currency: string
    items: { description: string; quantity: number; rate: number }[]
  }) {
    setSelectedCurrency(data.currency)
    setItems(data.items.length > 0 ? data.items : items)
  }

  return (
    <form action={action} id={form.id} onSubmit={form.onSubmit}>
      <input type="hidden" name="date" value={selectedDate.toISOString()} />
      <input type="hidden" name="dueDate" value={selectedDueDate} />
      <input type="hidden" name="status" value="PENDING" />
      <input type="hidden" name="total" value={total} />
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      {items.length > 0 && (
        <>
          <input type="hidden" name="invoiceItemDescription" value={items[0].description} />
          <input type="hidden" name="invoiceItemQuantity" value={items[0].quantity} />
          <input type="hidden" name="invoiceItemRate" value={items[0].rate} />
        </>
      )}

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
                    INV-{String(nextInvoiceNumber).padStart(4, "0")}
                  </div>
                </div>
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
                    <SelectItem value="AUD">Australian Dollar -- AUD</SelectItem>
                    <SelectItem value="CAD">Canadian Dollar -- CAD</SelectItem>
                    <SelectItem value="CHF">Swiss Franc -- CHF</SelectItem>
                    <SelectItem value="CNY">Chinese Yuan -- CNY</SelectItem>
                    <SelectItem value="EUR">Euro -- EUR</SelectItem>
                    <SelectItem value="GBP">British Pound -- GBP</SelectItem>
                    <SelectItem value="INR">Indian Rupee -- INR</SelectItem>
                    <SelectItem value="JPY">Japanese Yen -- JPY</SelectItem>
                    <SelectItem value="NPR">Nepalese Rupee -- NPR</SelectItem>
                    <SelectItem value="USD">United States Dollar -- USD</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage text={fields.invoiceNumber.errors} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <Label>From</Label>
                  <span className="flex items-center gap-2 text-gray-400">
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
                  />
                  <ErrorMessage text={fields.fromName.errors} />
                  <Input
                    name={fields.fromEmail.name}
                    key={fields.fromEmail.key}
                    type="email"
                    defaultValue={user?.email ?? ""}
                    placeholder="Your Email"
                  />
                  <ErrorMessage text={fields.fromEmail.errors} />
                  <Input
                    name={fields.fromAddress.name}
                    key={fields.fromAddress.key}
                    defaultValue={user?.address ?? ""}
                    placeholder="Your Address"
                  />
                  <ErrorMessage text={fields.fromAddress.errors} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>To</Label>
                <div className="space-y-2">
                  <input type="hidden" name={fields.clientName.name} value={clientName} />
                  <ClientAutocomplete
                    value={clientName}
                    onChange={setClientName}
                    placeholder="Client Name"
                  />
                  <ErrorMessage text={fields.clientName.errors} />
                  <Input
                    name={fields.clientEmail.name}
                    key={fields.clientEmail.key}
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    type="email"
                    placeholder="Client Email"
                  />
                  <ErrorMessage text={fields.clientEmail.errors} />
                  <Input
                    name={fields.clientAddress.name}
                    key={fields.clientAddress.key}
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
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

            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <Label>Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="size-3 mr-1" /> Add item
                </Button>
              </div>

              <div className="flex gap-2 mb-2 font-medium text-sm">
                <p className="flex-1">Description</p>
                <p className="w-24">Qty</p>
                <p className="w-28">Rate</p>
                <p className="w-20">Amount</p>
                <div className="w-9" />
              </div>

              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(i, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={item.quantity || ""}
                        onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                        placeholder="1"
                      />
                    </div>
                    <div className="w-28">
                      <Input
                        type="number"
                        value={item.rate || ""}
                        onChange={(e) => updateItem(i, "rate", Number(e.target.value))}
                        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                        placeholder="100"
                      />
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        value={item.quantity * item.rate}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div className="w-9 flex items-center">
                      {items.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(i)}>
                          <X className="size-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <div className="w-1/3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    <CurrencyDisplay amount={total} currency={selectedCurrency} />
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t">
                  <span>Total ({selectedCurrency})</span>
                  <span className="font-medium underline underline-offset-2">
                    <CurrencyDisplay amount={total} currency={selectedCurrency} />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">
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

            <div className="flex justify-end mt-2 gap-2">
              <LoadTemplateDialog onSelect={handleTemplateSelect} />
              <div>
                <SubmitButton text="Send Invoice to Client" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
