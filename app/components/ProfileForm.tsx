"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubmitButton } from "./SubmitButtons";
import { useActionState, useState } from "react";
import { updateProfile } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { profileSchema } from "../utils/zodSchema";
import { Camera, Loader2 } from "lucide-react";

const MAX_SIZE = 2 * 1024 * 1024;

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  address: string;
  image: string | null;
}

export function ProfileForm({ firstName, lastName, address, image }: ProfileFormProps) {
  const [lastResult, action] = useActionState(updateProfile, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: profileSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [preview, setPreview] = useState<string | null>(image);
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      alert("Only JPEG, PNG, GIF, and WebP images are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase() || "?";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information and profile picture</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative">
            <Avatar className="size-24">
              <AvatarImage src={preview ?? undefined} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 cursor-pointer bg-primary text-primary-foreground rounded-full p-1.5 shadow"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <p className="text-xs text-muted-foreground">JPEG, PNG, GIF or WebP. Max 2MB.</p>
        </div>

        <form
          action={action}
          id={form.id}
          onSubmit={form.onSubmit}
          noValidate
        >
          <input type="hidden" name="image" value={preview ?? ""} />
          <div className="flex gap-4">
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name={fields.firstName.name}
                key={fields.firstName.key}
                defaultValue={firstName}
                placeholder="John"
              />
              <p className="text-red-400 text-sm">{fields.firstName.errors}</p>
            </div>
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name={fields.lastName.name}
                key={fields.lastName.key}
                defaultValue={lastName}
                placeholder="Doe"
              />
              <p className="text-red-400 text-sm">{fields.lastName.errors}</p>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2 mt-4">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name={fields.address.name}
              key={fields.address.key}
              defaultValue={address}
              placeholder="Street 123"
            />
            <p className="text-red-400 text-sm">{fields.address.errors}</p>
          </div>
          <div className="mt-6">
            <SubmitButton text="Save changes" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
