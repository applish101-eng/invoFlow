"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../components/SubmitButtons";
import { useActionState } from "react";
import { onboardUser } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../utils/zodSchema";

export default function Onborading() {
  const [lastResult, action] = useActionState(onboardUser, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <>
      <div className="min-h-screen w-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-xl">You are almost there!</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={action}
              id={form.id}
              onSubmit={form.onSubmit}
              noValidate
            >
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name={fields.firstName.name}
                    key={fields.firstName.key}
                    defaultValue={fields.firstName.initialValue}
                    placeholder="John"
                  />
                  <p className="text-red-400 text-sm">
                    {fields.firstName.errors}
                  </p>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name={fields.lastName.name}
                    key={fields.lastName.key}
                    defaultValue={fields.lastName.initialValue}
                    placeholder="Doe"
                  />
                  <p className="text-red-400 text-sm">
                    {fields.lastName.errors}
                  </p>
                </div>
              </div>
              <div className="flex flex-col w-full gap-2 mt-4">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name={fields.address.name}
                  key={fields.address.key}
                  defaultValue={fields.address.initialValue}
                  placeholder="Street 123"
                />
                <p className="text-red-400 text-sm">{fields.address.errors}</p>
              </div>
              <SubmitButton text="Finish onboarding" />
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
