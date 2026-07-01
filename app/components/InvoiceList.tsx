import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import InvoiceActions from "./InvoiceActions";
export function InvoiceList() {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV-001</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>NRS. 10,000</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>2026/02/23</TableCell>
            <TableCell>
              <InvoiceActions />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
