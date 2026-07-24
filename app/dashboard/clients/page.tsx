"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { deleteClient } from "@/app/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Users, Mail, MapPin, FileText, DownloadCloud, Pencil, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { formatInvoiceNumber } from "@/lib/utils"

type InvoiceRef = {
  id: string
  invoiceName: string
  total: number
  status: string
  invoiceNumber: number
  currency: string
}

type Client = {
  clientName: string
  clientEmail: string
  clientAddress: string
  invoiceCount: number
  invoices: InvoiceRef[]
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)
  const [viewTarget, setViewTarget] = useState<Client | null>(null)

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then(setClients)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(client: Client) {
    const formData = new FormData()
    formData.set("clientName", client.clientName)
    const result = await deleteClient(formData)
    if (result.type === "success") {
      toast.success(result.message)
      setClients((prev) => prev.filter((c) => c.clientName !== client.clientName))
      setDeleteTarget(null)
      router.refresh()
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading clients...</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Clients</h1>
        <p className="text-sm text-muted-foreground">
          {clients.length} client{clients.length !== 1 ? "s" : ""} from your invoices
        </p>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            <Users className="size-8 mx-auto mb-2 opacity-50" />
            No clients yet. Create an invoice to add one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <Card key={client.clientName}>
              <CardContent className="p-4 flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    {client.clientName}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="size-3" />
                    {client.clientEmail}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="size-3" />
                    {client.clientAddress}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => setViewTarget(client)}
                    >
                      <FileText className="size-3 mr-1" />
                      {client.invoiceCount} invoice{client.invoiceCount !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewTarget(client)}
                  >
                    <Eye className="size-3 mr-1" /> View
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(client)}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!viewTarget} onOpenChange={() => setViewTarget(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoices for {viewTarget?.clientName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {viewTarget?.invoices.map((inv) => (
              <Card key={inv.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {formatInvoiceNumber(inv.invoiceNumber)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {inv.invoiceName} — {inv.currency} {inv.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={inv.status === "PAID" ? "default" : "secondary"}>
                      {inv.status}
                    </Badge>
                    {inv.status === "PAID" ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/api/invoice/${inv.id}`} target="_blank">
                          <DownloadCloud className="size-3 mr-1" /> PDF
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/invoices/${inv.id}`}>
                          <Pencil className="size-3 mr-1" /> Edit
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete client?</DialogTitle>
            <DialogDescription>
              This will permanently delete all {deleteTarget?.invoiceCount} invoice{deleteTarget?.invoiceCount !== 1 ? "s" : ""} for <strong>{deleteTarget?.clientName}</strong>. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Delete all invoices
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
