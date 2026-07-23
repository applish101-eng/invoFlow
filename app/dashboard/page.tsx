import { requiredUser } from "../utils/hooks";
import { signOut } from "../utils/auth";
import { DashboardBlocks } from "../components/DashboardBlocks";
import { InvoiceGraph } from "../components/InvoiceGraph";
export default async function DasbboardRoute() {
  const session = await requiredUser();

  return (
    <>
      <DashboardBlocks />
      <div className="grid gap-2 lg:grid-cols-3 md:gap-4 mt-6">
        <InvoiceGraph />
        <h1 className="col-span-1 bg-amber-200">30%</h1>
      </div>
    </>
  );
}
