import CreateInvoice from "@/app/components/CreateInvoice";
import { requiredUser } from "@/app/utils/hooks";
import { prisma } from "@/app/utils/db";

async function getUserData() {
  const session = await requiredUser();

  const data = await prisma.user.findUnique({
    where: {
      id: session.user?.id,
    },
    select: {
      firstName: true,
      lastName: true,
      address: true,
      email: true,
    },
  });
  return data;
}
export default async function InvoiceCreationRoute() {
  const user = await getUserData();
  return (
    <CreateInvoice
      user={{
        firstName: user?.firstName ?? null,
        lastName: user?.lastName ?? null,
        address: user?.address ?? null,
        email: user?.email ?? null,
      }}
    />
  );
}
