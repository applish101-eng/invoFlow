import { requiredUser } from "../utils/hooks";
import { signOut } from "../utils/auth";
import { DashboardBlocks } from "../components/DashboardBlocks";
import { InvoiceGraph } from "../components/InvoiceGraph";
import {RecentInvoices} from "../components/RecentInvoices"

export default async function DasbboardRoute() {
  const session = await requiredUser();

  return (
    <>
      <DashboardBlocks />
      <div className="grid gap-2 lg:grid-cols-3 md:gap-4 mt-6">
        <InvoiceGraph />
        <div className="col-span-1 ">
          <RecentInvoices />
        </div>
      </div>
    </>
  );
}
