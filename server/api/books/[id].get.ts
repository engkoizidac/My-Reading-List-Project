import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  //  console.log("Fetching book with ID:", id);
  const book = await prisma.book.findUnique({ where: { id } });
  return book;
});
