import fs from "fs";
import path from "path";

export function buildInvoiceHtml(
  templateVars: Record<string, string>,
): string {
  const templatePath = path.join(process.cwd(), "email-template.html");
  let html = fs.readFileSync(templatePath, "utf-8");

  for (const [key, value] of Object.entries(templateVars)) {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return html;
}
