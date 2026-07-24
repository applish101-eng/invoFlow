"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import InvoiceActions from "./InvoiceActions";
import { CurrencyDisplay } from "./CurrencyDisplay";
import { formatInvoiceNumber } from "@/lib/utils";
import { boyerMooreSearch } from "@/lib/algorithms/boyerMoore";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Invoice = {
  id: string;
  clientName: string;
  total: number;
  createdAt: Date;
  status: string;
  invoiceNumber: number;
  currency: string;
};

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      !query.trim() ||
      boyerMooreSearch(inv.clientName, query) ||
      boyerMooreSearch(formatInvoiceNumber(inv.invoiceNumber), query);
    const matchesStatus =
      statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client name or invoice number..."
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <Filter className="size-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                {query ? "No invoices match your search." : "No invoices yet."}
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{formatInvoiceNumber(invoice.invoiceNumber)}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>
                  <CurrencyDisplay
                    amount={invoice.total}
                    currency={invoice.currency}
                  />
                </TableCell>
                <TableCell>
                  <Badge>{invoice.status}</Badge>
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                  }).format(new Date(invoice.createdAt))}
                </TableCell>
                <TableCell className="text-right">
                  <InvoiceActions id={invoice.id} status={invoice.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
