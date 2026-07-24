import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  DownloadCloud,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { deleteInvoice, markINvoiceAsPaid } from "@/app/actions";

interface iAppProps {
  id: string;
  status: string;
}

export default function InvoiceActions({ id, status }: iAppProps) {
  const isPaid = status === "PAID";

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {!isPaid && (
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/invoices/${id}`}>
                <Pencil className="size-4 mr-1" /> Edit Invoice
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href={`/api/invoice/${id}`} target="_blank">
              <DownloadCloud className="size-4 mr-1" /> Download Invoice
            </Link>
          </DropdownMenuItem>
          {!isPaid && (
            <DropdownMenuItem asChild>
              <form action={`/api/reminder/${id}`} method="POST">
                <button type="submit" className="flex items-center w-full gap-2">
                  <Mail className="size-4" /> Send Reminder
                </button>
              </form>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <form action={deleteInvoice}>
              <input type="hidden" name="id" value={id} />
              <button type="submit" className="flex items-center w-full gap-2">
                <Trash className="size-4" /> Delete Invoice
              </button>
            </form>
          </DropdownMenuItem>
          {!isPaid && (
            <DropdownMenuItem asChild>
              <form action={markINvoiceAsPaid}>
                <input type="hidden" name="id" value={id} />
                <button type="submit" className="flex items-center w-full gap-2">
                  <CheckCircle className="size-4 mr-1" /> Mark as Paid
                </button>
              </form>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
