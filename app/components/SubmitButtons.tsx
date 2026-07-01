"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  text: string;
}
export function SubmitButton({ text }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Please wait..
        </Button>
      ) : (
        <Button type="submit" className="w-full cursor-pointer mt-4">
          {text}
        </Button>
      )}
    </>
  );
}
