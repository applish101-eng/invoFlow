import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ChevronLeft } from "lucide-react";
import Link from "next/link";
export default function CheckEmailPage() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="size-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Check your email
          </CardTitle>
          <CardDescription className="text-center">
            A sign-in link has been sent to your email address. Please check
            your inbox and click the link to log in.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <a
            href="/login"
            className="text-primary underline underline-offset-4"
          >
            try again
          </a>
          .
        </CardContent>

        <CardContent className="flex flex-col items-center justify-center">
          <div className="relative bg-gray-300 w-full h-px my-4">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>
          <Link href="/" className="flex justify-center items-center gap-2 text-gray-500 cursor-pointer">
            <ChevronLeft />
            back to home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
