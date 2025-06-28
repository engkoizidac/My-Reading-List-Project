import { defineEventHandler, getRouterParam, createError } from "h3";
import { prisma } from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  console.log("Toggling book read status for ID:", id);

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book)
    throw createError({ statusCode: 404, statusMessage: "Book not found" });

  const updated = await prisma.book.update({
    where: { id },
    data: { is_read: !book.is_read },
  });

  return updated;
});
