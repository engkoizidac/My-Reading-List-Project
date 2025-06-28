import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const body = await readBody(event);

  return await prisma.book.update({
    where: { id },
    data: {
      title: body.title,
      author: body.author,
      is_read: body.is_read,
    },
  });
});
