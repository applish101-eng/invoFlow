import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth, signIn } from "../utils/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { SubmitButton } from "../components/SubmitButtons";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Log in</CardTitle>
          <CardDescription>
            Enter your email to log in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            action={async (formData) => {
              "use server";
              const email = formData.get("email") as string;
              if (!email) return;
              const result = await signIn("nodemailer", {
                email,
                redirect: false,
              });
              if (!result?.error) redirect("/check-email");
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                required
              />
            </div>
            <SubmitButton ></SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
