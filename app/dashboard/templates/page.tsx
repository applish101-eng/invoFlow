import { requiredUser } from "@/app/utils/hooks";
import { prisma } from "@/app/utils/db";
import { TemplateManager } from "./TemplateManager";
import type { Template } from "./TemplateManager";

export default async function TemplatesPage() {
  const session = await requiredUser();
  const userId = session.user?.id as string;

  const raw = await prisma.template.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const templates: Template[] = raw.map((t) => ({
    ...t,
    data: t.data as Template["data"],
  }));

  return <TemplateManager templates={templates} />;
}
