import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const emailClient = {
  emails: {
    send: async ({
      from,
      to,
      subject,
      html,
      text,
    }: {
      from: string;
      to: string[];
      subject: string;
      html?: string;
      text?: string;
    }) => {
      const info = await transport.sendMail({
        from,
        to: to.join(", "),
        subject,
        html,
        text,
      });
      return info;
    },
  },
};

export const sender = process.env.EMAIL_FROM!;
