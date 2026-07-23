"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function ToastHandler() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    if (status === "updated") toast.success("Invoice updated and sent");
    else if (status === "deleted") toast.success("Invoice deleted");
    else if (status === "reminder") toast.success("Reminder email sent");
    else if (status === "paid") toast.success("Invoice marked as paid");
  }, [status]);

  return null;
}
