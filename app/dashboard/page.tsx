import { requiredUser } from "../utils/hooks";
import { signOut } from "../utils/auth"

export default async function DasbboardRoute() {
  const session = await requiredUser();

  return (
    <>
      <h1>Hello {session.user?.email}</h1>
      
    </>
  );
}
