import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { InvoiceList } from "@/app/components/InvoiceList";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function InvoicesRoute() {
  return (
    <>
      <Card>
        <CardHeader className="text-2xl font-bold">
          <div className="flex items-center justify-between">
            <div>
              {" "}
              <CardTitle className="text-2xl font-semibold">Invoices</CardTitle>
              <CardDescription className="font-normal">
                Manage your invoices
              </CardDescription>
            </div>
            <Link
              href=""
              className={buttonVariants({
                className: "flex items-center  ",
                variant: "default",
              })}
            >
              <PlusIcon className="size-5" />{" "}
              <span className="text-sm font-normal">Create Invoice</span>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <InvoiceList />
        </CardContent>
      </Card>
    </>
  );
}
