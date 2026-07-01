"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
export function SubmitButton() {
  const { pending } = useFormStatus();
  return <>{pending ? <Button disabled className="w-full"><Loader2 className="mr-2 size-4 animate-spin"/>Please wait..</Button> : <Button type="submit" className="w-full cursor-pointer" >Submit</Button>}</>;
}
