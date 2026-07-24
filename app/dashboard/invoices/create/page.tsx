import CreateInvoice from "@/app/components/CreateInvoice";
import { requiredUser } from "@/app/utils/hooks";
import { prisma } from "@/app/utils/db";

async function getUserData() {
  const session = await requiredUser();

  const [user, last] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user?.id },
      select: { firstName: true, lastName: true, address: true, email: true },
    }),
    prisma.invoice.findFirst({
      where: { userId: session.user?.id as string },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true },
    }),
  ])

  const nextInvoiceNumber = (last?.invoiceNumber ?? 0) + 1

  return { user, nextInvoiceNumber }
}
export default async function InvoiceCreationRoute() {
  const { user, nextInvoiceNumber } = await getUserData();
  return (
    <CreateInvoice
      nextInvoiceNumber={nextInvoiceNumber}
      user={{
        firstName: user?.firstName ?? null,
        lastName: user?.lastName ?? null,
        address: user?.address ?? null,
        email: user?.email ?? null,
      }}
    />
  );
}
