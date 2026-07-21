import { prisma } from "@/app/utils/db";
import { requiredUser } from "@/app/utils/hooks";
import { notFound } from "next/navigation";
import { EditInvoice } from "@/app/components/EditInvoice";
async function getData(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });
  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ invoiceid: string }>;

export default async function EditInvoiceRoute({ params }: { params: Params }) {
  const { invoiceid: invoiceId } = await params;
  const session = await requiredUser();

  const data = await getData(invoiceId, session.user?.id as string);
  const user = await prisma.user.findUnique({
    where: { id: session.user?.id as string },
    select: { firstName: true, lastName: true, address: true, email: true },
  });

  return (
    <EditInvoice
      data={data}
      user={{
        firstName: user?.firstName ?? null,
        lastName: user?.lastName ?? null,
        address: user?.address ?? null,
        email: user?.email ?? null,
      }}
    />
  );
}
