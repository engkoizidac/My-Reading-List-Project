import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const books = await prisma.book.findMany({
    orderBy: {
      title: "asc",
    },
  });
  return books;
});
