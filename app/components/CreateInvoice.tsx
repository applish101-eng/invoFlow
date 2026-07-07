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
import { CalendarIcon } from "lucide-react";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { createInvoice } from "../actions";
import { invoiceSchema } from "../utils/zodSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ErrorMessage } from "@/app/components/ErrorMessage";

export default function CreateInvoice() {
  const [lastResult, action, isPending] = useActionState(
    createInvoice,
    undefined,
  );

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
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [rate, setRate] = useState(0);
  const amount = quantity * rate;

  return (
    <form action={action} id={form.id} onSubmit={form.onSubmit}>
      <input type="hidden" name="date" value={selectedDate.toISOString()} />
      <input type="hidden" name="dueDate" value={selectedDueDate} />
      <input type="hidden" name="status" value="PENDING" />
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
                  <Input
                    name={fields.invoiceNumber.name}
                    key={fields.invoiceNumber.key}
                    defaultValue={fields.invoiceNumber.initialValue}
                    placeholder="e.g. 1234"
                    className="rounded-l-none"
                  />
                </div>
                <ErrorMessage text={fields.invoiceNumber.errors} />
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
                <Label>From</Label>
                <div className="space-y-2">
                  <Input
                    name={fields.fromName.name}
                    key={fields.fromName.key}
                    placeholder="Your Name"
                  />
                  <ErrorMessage text={fields.fromName.errors} />
                  <Input
                    name={fields.fromEmail.name}
                    key={fields.fromEmail.key}
                    type="email"
                    placeholder="Your Email"
                  />
                  <ErrorMessage text={fields.fromEmail.errors} />
                  <Input
                    name={fields.fromAddress.name}
                    key={fields.fromAddress.key}
                    placeholder="Your Address"
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
                    defaultValue={fields.invoiceItemDescription.initialValue}
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
                    defaultValue={fields.invoiceItemQuantity.initialValue}
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
                    defaultValue={fields.invoiceItemRate.initialValue}
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
                <SubmitButton text="Send Invoice to Client" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
