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

export default function InvoiceActions() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="">
              {" "}
              <Pencil className="size-4 mr-1" /> Edit Invoice{" "}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="">
              {" "}
              <DownloadCloud className="size-4 mr-1" /> Download Invoice{" "}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="">
              {" "}
              <Mail className="size-4 mr-1" /> Send Reminder{" "}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="">
              {" "}
              <Trash className="size-4 mr-1" /> Delete Invoice{" "}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="">
              {" "}
              <CheckCircle className="size-4 mr-1" /> Mark as Paid{" "}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
