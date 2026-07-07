"use client";


interface ErrorMessageProp {
   text: string | string[] | undefined;
}
export function ErrorMessage({ text }: ErrorMessageProp) {
  const message = Array.isArray(text) ? text[0] : text;

  return message ? <p className="text-sm text-red-500">{message}</p> : null;
}
