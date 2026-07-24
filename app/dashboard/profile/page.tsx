import { requiredUser } from "@/app/utils/hooks";
import { prisma } from "@/app/utils/db";
import { ProfileForm } from "@/app/components/ProfileForm";

async function getUser(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      address: true,
      image: true,
    },
  });
  return data;
}

export default async function ProfilePage() {
  const session = await requiredUser();
  const user = await getUser(session.user?.id as string);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <ProfileForm
        firstName={user?.firstName ?? ""}
        lastName={user?.lastName ?? ""}
        address={user?.address ?? ""}
        image={user?.image ?? null}
      />
    </div>
  );
}
