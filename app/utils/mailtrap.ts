import { MailtrapClient } from "mailtrap";
export const emailClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN!,
});

export const sender = {
  email: process.env.MAILTRAP_FROM_EMAIL!,
  name: process.env.MAILTRAP_FROM_NAME!,
};
